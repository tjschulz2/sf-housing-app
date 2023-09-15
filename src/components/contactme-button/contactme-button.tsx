"use client";
import { useState } from "react";
import Modal from "../modal/modal";
import styles from "./contactme-button.module.css";

export default function ContactMeButton({
  contactMethod,
  color,
}: {
  contactMethod: string;
  color: string;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const emailRegex = /^[\w-.]+(\+[\.\w-]+)?@([\w-]+\.)+[a-zA-Z]{2,7}$/;
  const phoneRegex = /^(\+\d{1,3}[- ]?)?\(?\d{3}\)?[- ]?\d{3}[- ]?\d{4}$/;
  const websiteRegex =
    /^(?!(?:www\.)?twitter\.com$)((http(s?):\/\/)?([wW]{3}\.)?[a-zA-Z0-9\-.]{2,}\.[a-zA-Z]{2,}(?:(?:\/[^\s/]*))*)$/;
  const twitterLinkRegex =
    /^(http(s)?:\/\/)?((w){3}.)?twitter.com\/(#!\/)?[a-z0-9_]+$/;

  let colorClassWrapper: any;
  if (color === "purple") {
    colorClassWrapper = styles.backgroundPurple;
  } else if (color === "green") {
    colorClassWrapper = styles.backgroundGreen;
  } else {
    colorClassWrapper = styles.backgroundBlue;
  }

  const openModal = () => {
    if (emailRegex.test(contactMethod) || phoneRegex.test(contactMethod)) {
      setIsOpen(true);
    } else if (
      websiteRegex.test(contactMethod) ||
      twitterLinkRegex.test(contactMethod)
    ) {
      goToLink();
    } else {
      console.log(contactMethod);
      alert(
        "We probably made a mistake in our code. Send a screenshot to me @thomasschulzz on twitter."
      );
    }
  };

  const goToLink = () => {
    let url = contactMethod;

    if (!/^http[s]?:\/\//.test(contactMethod)) {
      url = "http://" + contactMethod;
    }

    window.open(url, "_blank");
  };

  const closeModal = () => {
    setIsOpen(false);
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(contactMethod);
      alert("Contact information copied to clipboard!");
    } catch (err) {
      console.error("Failed to copy text: ", err);
    }
  };

  return (
    <>
      <a
        className={`${styles.contactMeWrapper} ${colorClassWrapper}`}
        onClick={openModal}
      >
        <p className="text-white font-bold p-4">Contact me</p>
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
          <h2>Contact information</h2>
          <p style={{ color: "grey" }}>
            Only use this information to reach out about housing. Using contact
            information for nefarious purposes will result in account deletion.
          </p>
          <div className={styles.referralClipboard} onClick={copyToClipboard}>
            <img style={{ marginRight: "8px" }} src="/link.svg" />
            {contactMethod}
          </div>
        </div>
      </Modal>
    </>
  );
}
