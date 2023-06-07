"use client";
import { useState } from "react";
import Modal from "../modal/modal";
import styles from "./invite-button.module.css";
import { supabase } from "../../lib/supabaseClient";
import { v4 as uuidv4 } from 'uuid';

let referralLink = 'http://directorysf.com/?referralCode='

const copyToClipboard = async () => {
  try {
    await navigator.clipboard.writeText(referralLink);
    alert("Referral link copied to clipboard!");
  } catch (err) {
    console.error("Failed to copy text: ", err);
  }
};

export default function InviteButton() {
  const [isOpen, setIsOpen] = useState(false);

  function openModal() {
    generateReferralCode();
    setIsOpen(true);
  }

  function closeModal() {
    setIsOpen(false);
  }

  const generateReferralCode = async () => {
    try {
      // Use a UUID generator to generate the referral code
      const referralCode = Math.floor(Math.random() * 1000000000000000)
      referralLink = `http://directorysf.com/?referralCode=${referralCode}`
  
      // Insert a new record into your `referrals` table
      const { data, error } = await supabase
        .from('referrals')
        .insert([
          { 
            referral_id: referralCode,
            originator_id: '6ebdd1c1-f36e-4613-931f-4f7dc40463b8' // THIS IS FAKE CODE, REPLACE
          },
        ]);
  
      if (error) throw error;
      
      console.log('Referral code generated:', referralCode);
    } catch (error) {
      console.error('Failed to generate referral code:', error);
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
            <img style={{ marginRight: "8px" }} src="./link.svg" />
            {referralLink}
          </div>
        </div>
      </Modal>
    </>
  );
}
