import React, { useState, useEffect, useRef } from "react";
import styles from "./dropdown.module.css";
import { FiChevronDown } from "react-icons/fi";
import Link from "next/link";

type User = {
  twitterAvatarUrl: string;
};

type DropdownProps = {
  user: User;
};

const Dropdown: React.FC<DropdownProps> = ({ user }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const twitterImageUrl = user.twitterAvatarUrl
  let higherResImageUrl = twitterImageUrl.replace('_normal', '_400x400');

  const toggleDropdown = () => setIsOpen(!isOpen);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className={styles.container} ref={dropdownRef} onClick={toggleDropdown}>
        <div className={styles.itemsContainer}>
            <img src={higherResImageUrl} className={styles.avatar} alt="Profile" />
            <FiChevronDown className={styles.icon} />
        </div>
      {isOpen && (
        <div className={styles.dropdownMenu}>
            <Link href="/settings" className={styles.button}>Settings</Link>
            <Link href="/logout" className={styles.button}>Sign out</Link>
        </div>
      )}
    </div>
  );
};

export default Dropdown;
