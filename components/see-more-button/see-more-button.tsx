"use client";
import { useState } from "react";
import Modal from "../modal/modal";
import styles from "./see-more-button.module.css";

type ChildComponentProps = {
  seeMoreText: string;
};

export default function SeeMoreButton({ seeMoreText }: ChildComponentProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  const handleClick = () => {
    setIsExpanded(!isExpanded);
    openModal()
  };

  function openModal() {
    setIsOpen(true);
  }

  function closeModal() {
    setIsOpen(false);
  }

  return (
    <>
      <a className={styles.seeMore} onClick={handleClick}>{'See more'}</a>
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
          <h2>About me</h2>
          <p style={{ color: "grey" }}>
            {seeMoreText}
          </p>
        </div>
      </Modal>
    </>
  );
}
