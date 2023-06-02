"use client";
import { useRef, useCallback, useEffect, MouseEventHandler } from "react";
import styles from "./modal.module.css";

type ModalProps = {
  isOpen: Boolean;
  closeModal: () => void;
  children: React.ReactNode;
};

export default function Modal({ isOpen, closeModal, children }: ModalProps) {
  const modalRef = useRef<HTMLDialogElement>(null);

  const onClick: MouseEventHandler<HTMLDialogElement> = useCallback(
    (e) => {
      const { current: el } = modalRef;
      if (e.target === el) {
        closeModal();
      }
    },
    [closeModal]
  );

  useEffect(() => {
    const { current: el } = modalRef;
    if (!el) {
      return;
    }
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
