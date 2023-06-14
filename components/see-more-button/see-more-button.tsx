"use client";
import { useState } from "react";
import Modal from "../modal/modal";
import styles from "./see-more-button.module.css";

type ChildComponentProps = {
  seeMoreText: string;
  color: string;
};

export default function SeeMoreButton({ seeMoreText, color }: ChildComponentProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  let colorClass: any;
  if (color === 'purple') {
    colorClass = styles.colorPurple;
  } else if (color === 'green') {
    colorClass = styles.colorGreen;  // Make sure to define colorGreen in your styles
  } else {
    colorClass = styles.colorBlue;
  }

  const handleClick = () => {
    setIsExpanded(!isExpanded);
    openModal();
  };

  function openModal() {
    setIsOpen(true);
  }

  function closeModal() {
    setIsOpen(false);
  }

  return (
    <>
      <a className={`${styles.seeMore} ${colorClass}`} onClick={handleClick}>
        {"See more"}
      </a>
      <Modal closeModal={closeModal} isOpen={isOpen}>
        <div
          style={{
            // position: "relative",
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
          <h2>About</h2>
          <p style={{ color: "grey" }}>{seeMoreText}</p>
        </div>
      </Modal>
    </>
  );
}
