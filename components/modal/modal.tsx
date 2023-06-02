"use client";
import { useRef, useCallback, useEffect } from "react";
import styles from "./modal.module.css";

type ModalProps = {
  isOpen: Boolean;
  closeModal: () => void;
  children: React.ReactNode;
};

export default function Modal({ isOpen, closeModal, children }: ModalProps) {
  const modalRef = useRef(null);

  const onClick = useCallback(
    ({ target }) => {
      const { current: el } = modalRef;
      console.log(el);
      console.log(target);
      if (target === el) {
        closeModal();
      }
    },
    [closeModal]
  );

  useEffect(() => {
    const { current: el } = modalRef;
    if (isOpen) {
      el.showModal();
    } else {
      el.close();
    }
  }, [isOpen]);

  return (
    <dialog
      ref={modalRef}
      onClose={closeModal}
      onClick={onClick}
      className={styles.dialog}
    >
      <div className={styles.dialogContents}>{children}</div>
    </dialog>
  );
}
