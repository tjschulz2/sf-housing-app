"use client";
import { useState } from "react";
import Modal from "../modal/modal";

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
      <button onClick={openModal}>Open Modal</button>
      <Modal closeModal={closeModal} isOpen={isOpen}>
        <p>Modal text content</p>
        <button onClick={closeModal}>Close</button>
      </Modal>
    </>
  );
}
