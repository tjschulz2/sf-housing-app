"use client";
// Import required libraries
import { useState, useEffect } from "react";
import Link from "next/link";
import styles from "./page.module.css";
import { NextPage } from "next";
import {
  isInDirectoryAlready,
  deleteDataFromDirectory,
} from "../../lib/utils/process";
import { getUserSession } from "../../lib/utils/auth";
import Modal from "../../components/modal/modal";

const Settings: NextPage = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [buttonStatus, setButtonStatus] = useState(false);

  const handleYes = async () => {
    await removeDirectoryInfo();
  };

  const getDirectoryInfo = async () => {
    const session = await getUserSession();
    const inAlready = await isInDirectoryAlready(session!.userID);
    if (inAlready) {
      setButtonStatus(true);
    }
  };

  const removeDirectoryInfo = async () => {
    const session = await getUserSession();
    await deleteDataFromDirectory(session!.userID);
    closeModal();
    setButtonStatus(false);
    alert("Your listing has been removed from the directory");
  };

  const closeModal = () => {
    setIsOpen(false);
  };

  useEffect(() => {
    const fetchData = async () => {
      await getDirectoryInfo();
    };

    fetchData();
  }, [buttonStatus]);

  return (
    <div className={styles.container}>
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
          <h2>Are you sure?</h2>
          <p style={{ color: "grey", marginBottom: "24px" }}>
            Your listing in the directory will be permanently removed. You will
            need to create a new listing to be seen.
          </p>
          <a className={styles.yesBtn} onClick={handleYes}>
            Yes
          </a>
          <a className={styles.noBtn} onClick={closeModal}>
            No
          </a>
        </div>
      </Modal>
      <div className={styles.form}>
        <Link href="/directory" className="text-blue-900">
          {" "}
          &larr; Back to directory
        </Link>
        <h1 className="text-3xl font-bold">Settings</h1>
        <div
          style={{ height: "1px", backgroundColor: "gray", width: "100%" }}
        />

        <div>
          <h2 className="text-2xl font-bold mb-4">
            Remove listing from directory
          </h2>
          <p className="mb-4">
            Removing your listing from the directory will be permanent.
          </p>
          <div style={{ display: "flex", alignItems: "center" }}>
            <a
              onClick={buttonStatus ? () => setIsOpen(true) : undefined}
              className={buttonStatus ? styles.enabled : styles.disabled}
            >
              Remove my listing
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
