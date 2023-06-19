"use client";
import { useState } from "react";
import Modal from "../modal/modal";
import styles from "./invite-button.module.css";
import { supabase } from "../../lib/supabaseClient";
import { getUserSession } from "../../lib/utils/auth";

let referralBaseLink = "https://directorysf.com/?referralCode=";

export default function InviteButton() {
  const [isOpen, setIsOpen] = useState(false);
  const [referralLink, setReferralLink] = useState("");

  const openModal = async () => {
    const userId = await getSessionData();
    if (userId) {
      await generateReferralCode(userId);
      setIsOpen(true);
    }
  };

  const getSessionData = async () => {
    const session = await getUserSession();
    if (session && session.twitterID) {
      const { data, error } = await supabase
        .from("users")
        .select("user_id")
        .eq("twitter_id", session.twitterID);

      if (error) {
        console.error("Error fetching user:", error);
        return null;
      }

      if (data && data.length > 0) {
        return data[0].user_id;
      }
    }
    return null;
  };

  const generateReferralCode = async (userId: string) => {
    try {
      const referralCode = Math.floor(Math.random() * 1000000000000000);
      const newReferralLink = referralBaseLink + referralCode;
      setReferralLink(newReferralLink);

      // Insert a new record into your `referrals` table
      const { data, error } = await supabase.from("referrals").insert([
        {
          referral_id: referralCode,
          originator_id: userId,
        },
      ]);

      if (error) throw error;

      console.log("Referral code generated:", referralCode);
    } catch (error) {
      console.error("Failed to generate referral code:", error);
    }
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
          <h2>Invite a friend</h2>
          <p style={{ color: "grey" }}>
            Only refer people you know, trust, or think would be a good fit for
            this directory. Referring randoms will get your referral link
            reversed.
          </p>
          <div className={styles.referralClipboard} onClick={copyToClipboard}>
            <img style={{ marginRight: "8px" }} src="/link.svg" />
            {referralLink}
          </div>
        </div>
      </Modal>
    </>
  );
}
