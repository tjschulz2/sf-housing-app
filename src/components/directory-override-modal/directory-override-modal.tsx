"use client";
import Modal from "../modal/modal";
import styles from './directory-override-modal.module.css'

interface DirectoryOverrideModalProps {
  modalActivity: boolean;
  handleSubmit: () => void;
  handleDeletion: () => void;
  setIsModalActive: (isActive: boolean) => void;
}

export default function DirectoryOverrideModal({ modalActivity, handleSubmit, handleDeletion, setIsModalActive }: DirectoryOverrideModalProps) {
  const closeModal = () => {
    setIsModalActive(false);
  };

  const handleYes = async () => {
    await handleDeletion();
    await handleSubmit();
    setIsModalActive(false);
  };

  return (
    <>
      <Modal closeModal={closeModal} isOpen={modalActivity}>
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
          <h2>Are you sure?</h2>
          <p style={{ color: "grey", marginBottom: '24px' }}>
            It looks like you already have live data in the directory. Uploading new data will remove what you currently have. Are you sure you want to do this?
          </p>
          <a className={styles.yesBtn} onClick={handleYes}>Yes</a>
          <a className={styles.noBtn} onClick={closeModal}>No</a>
        </div>
      </Modal>
    </>
  );
}
