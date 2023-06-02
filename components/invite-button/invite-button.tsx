"use client";
import { useState } from "react";
import Modal from "../modal/modal";
import styles from "./invite-button.module.css";

const referralLink = "http://yourReferralLink.com";

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
    setIsOpen(true);
  }

  function closeModal() {
    setIsOpen(false);
  }

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
