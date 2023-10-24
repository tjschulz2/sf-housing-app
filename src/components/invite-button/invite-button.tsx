"use client";
import { useState, useEffect } from "react";
import Modal from "../modal/modal";
import { supabase } from "../../lib/supabaseClient";
import { getUserSession } from "../../lib/utils/auth";
import styles from "./invite-button.module.css";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Copy, UserPlus } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const referralBaseLink = "https://directorysf.com/?referralCode=";

function ReferralLink() {
  const [referralLink, setReferralLink] = useState("");
  // const [userID, setUserID] = useState("");

  useEffect(() => {
    const genReferralLink = async () => {
      const session = await getUserSession();
      if (session && session.userID) {
        // setUserID(session.userID);
        const { data, error } = await supabase
          .from("users")
          .select("*")
          .eq("user_id", session.userID);

        if (error) {
          console.error("Error fetching user:", error);
          return;
        }

        if (data?.length > 0) {
          const user = data[0];
          if (user.is_super !== null) {
            const { data: referralsData, error: referralsError } =
              await supabase
                .from("referrals")
                .select("*")
                .eq("originator_id", session.userID)
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
              const { error: insertError } = await supabase
                .from("referrals")
                .insert([
                  {
                    referral_id: referralCode,
                    originator_id: session.userID,
                    usage_limit: 500,
                    usage_count: 0,
                  },
                ]);

              if (insertError) throw insertError;
            }
          } else {
            const referralCode = Math.floor(Math.random() * 1000000000000000);
            setReferralLink(`${referralBaseLink}${referralCode}`);
            const { error: insertError } = await supabase
              .from("referrals")
              .insert([
                {
                  referral_id: referralCode,
                  originator_id: session.userID,
                  usage_limit: 1,
                  usage_count: 0,
                },
              ]);

            if (insertError) throw insertError;
          }
        }
      }
    };

    genReferralLink();
  }, []);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(referralLink);
      alert("Referral link copied to clipboard!");
    } catch (err) {
      console.error("Failed to copy text: ", err);
    }
  };

  return (
    <div className="flex items-center space-x-2">
      <div className="grid flex-1 gap-2">
        <Label htmlFor="link" className="sr-only">
          Link
        </Label>
        <Input id="link" defaultValue={referralLink} readOnly />
      </div>
      <Button
        type="submit"
        size="sm"
        className="px-3"
        onClick={copyToClipboard}
      >
        <span className="sr-only">Copy</span>
        <Copy className="h-4 w-4" />
      </Button>
    </div>
  );
}

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
      <Dialog>
        <DialogTrigger>
          <Button className="rounded-3xl p-6">
            <UserPlus className="mr-2 h-4 w-4" /> Invite a friend
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Invite a friend</DialogTitle>
            <DialogDescription>
              Only refer people you know, trust, or think would be a good fit
              for this directory.
            </DialogDescription>
          </DialogHeader>
          <ReferralLink />
        </DialogContent>
      </Dialog>

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
