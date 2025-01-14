import React, { useState, useEffect, useRef } from "react";
import styles from "./dropdown.module.css";
import { FiChevronDown } from "react-icons/fi";
import Link from "next/link";
import { getDataFromDirectory } from "../../lib/utils/process";
import { getUserSession } from "../../lib/utils/auth";
import { useRouter } from "next/navigation";
import UserProfileImage from "../user-profile-image";
import { createClient } from "@/utils/supabase/client";

type User = {
  twitterAvatarUrl: string;
};

type DropdownProps = {
  user: User;
};

const Dropdown = ({ userAvatarURL }: { userAvatarURL: string }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  let higherResImageUrl = userAvatarURL?.replace("_normal", "_400x400");
  const toggleDropdown = () => setIsOpen(!isOpen);
  const supabase = createClient();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleSubmit = async () => {
    const session = await getUserSession();
    const directoryData = await getDataFromDirectory(session!.userID);
    if (directoryData?.directoryType === "organizer_profiles") {
      router.push(
        `/organizer-form?data=${encodeURIComponent(
          JSON.stringify(directoryData)
        )}`
      );
    } else {
      alert("You do not have a live listing.");
    }
  };

  async function handleSignout() {
    await supabase.auth.signOut();
    router.push("/");
  }

  return (
    <div
      className={styles.container}
      ref={dropdownRef}
      onClick={toggleDropdown}
    >
      <div className={styles.itemsContainer}>
        <UserProfileImage src={higherResImageUrl} size="medium-dynamic" />
        <FiChevronDown className={styles.icon} />
      </div>
      {isOpen && (
        <div className={styles.dropdownMenu}>
          {/* <Link href="/settings" className={styles.button}>
            Settings
          </Link> */}
          {/* <a onClick={handleSubmit} className={styles.button}>
            Edit my listing
          </a> */}
          {/* <Link href="/logout" className={styles.button}>
            Sign out
          </Link> */}
          <span
            className={styles.button}
            onClick={async () => await handleSignout()}
          >
            {" "}
            Sign out
          </span>
        </div>
      )}
    </div>
  );
};

export default Dropdown;
