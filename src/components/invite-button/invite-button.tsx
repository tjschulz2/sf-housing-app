"use client";
import { useState, useEffect } from "react";
import Modal from "../modal/modal";
import { supabase } from "../../lib/supabaseClient";
import { getUserSession } from "../../lib/utils/auth";
import styles from "./invite-button.module.css";

const referralBaseLink = "https://directorysf.com/?referralCode=";

const InviteButton = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [referralLink, setReferralLink] = useState("");
  const [isSuper, setIsSuper] = useState(false);
  const [userID, setUserID] = useState("");

  // I'm trying to get the user's information
  // Test to see if the user has is_super && if has is_super, then also check to see if they have an active referral code
  // If is_super & has referral code, then show that referral code
  // If the user isn't is_super, then just generate a new code upon opening up the modal
  // If the user is_super and the referral code's usage_limit == usage_count, then generate a new code

  useEffect(() => {
    const fetchUserData = async () => {
      const session = await getUserSession();

      if (session && session.userID) {
        setUserID(session.userID);
        const { data, error } = await supabase
          .from("users")
          .select("*")
          .eq("user_id", session.userID);

        if (error) console.error("Error fetching user:", error);

        if (data && data.length > 0) {
          const user = data[0];
          if (user.is_super !== null) setIsSuper(user.is_super);
        }
      }
    };

    fetchUserData();
  }, []);

  const generateReferralCode = async () => {
    if (isSuper) {
      const { data: referralsData, error: referralsError } = await supabase
        .from("referrals")
        .select("*")
        .eq("originator_id", userID)
        .eq("usage_limit", 500)
        .not("usage_count", "gte", 500);

      if (referralsError) {
        console.error("Error fetching user:", referralsError);
        return;
      }

      if (referralsData && referralsData.length > 0) {
        const referralCode = referralsData[0].referral_id;
        setReferralLink(`${referralBaseLink}${referralCode}`);
      } else {
        const referralCode = Math.floor(Math.random() * 1000000000000000);
        setReferralLink(`${referralBaseLink}${referralCode}`);
        // Insert a new record into the `referrals` table
        const { error: insertError } = await supabase.from("referrals").insert([
          {
            referral_id: referralCode,
            originator_id: userID,
            usage_limit: 500,
            usage_count: 0,
          },
        ]);

        if (insertError) throw insertError;
      }
    } else {
      const referralCode = Math.floor(Math.random() * 1000000000000000);
      setReferralLink(`${referralBaseLink}${referralCode}`);
      // Insert a new record into the `referrals` table
      const { error: insertError } = await supabase.from("referrals").insert([
        {
          referral_id: referralCode,
          originator_id: userID,
          usage_limit: 1,
          usage_count: 0,
        },
      ]);

      if (insertError) throw insertError;
    }
  };

  const openModal = async () => {
    await generateReferralCode();
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(referralLink);
      alert("Referral link copied to clipboard!");
    } catch (err) {
      console.error("Failed to copy text: ", err);
    }
  };

  return (
    <>
      <a className={styles.inviteButton} onClick={openModal}>
        Invite a friend
      </a>
      <Modal closeModal={closeModal} isOpen={isOpen}>
        <div
          style={{
            position: "relative",
            marginBottom: "16px",
            marginLeft: "16px",
            marginRight: "16px",
          }}
        >
          <button
            onClick={closeModal}
            style={{ position: "absolute", top: 0, right: 0 }}
          >
            x
          </button>
          <h2 className="text-2xl font-bold my-4">Invite a friend</h2>
          <p className="text-neutral-500 mb-4">
            {isSuper
              ? `You have 500 invitations with this link. Only refer people you know, trust, or think would be a good fit for
            this directory. Referring randoms will get your referral link
            reversed.`
              : `Only refer people you know, trust, or think would be a good fit for
            this directory. Referring randoms will get your referral link
            reversed.`}
          </p>
          <div className={styles.referralClipboard} onClick={copyToClipboard}>
            <img style={{ marginRight: "8px" }} src="/link.svg" />
            <span className="text-sm sm:text-md"> {referralLink}</span>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default InviteButton;
