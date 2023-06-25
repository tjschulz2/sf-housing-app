"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import styles from "./navbar.module.css";

const navConfig = [
  {
    path: "/directory",
    title: "Looking for housing",
  },
  {
    path: "/directory/people-organizing",
    title: "Starting a new house",
  },
  {
    path: "/directory/existing-communities",
    title: "Existing spaces",
  },
];

export default function Navbar() {
  const currentPath = usePathname();

  return (
    <div className={styles.sectionButtons}>
      {navConfig.map((tab) => (
        <Link
          key={tab.path}
          href={tab.path}
          className={
            tab.path === currentPath
              ? styles.selectedText
              : styles.unselectedText
          }
        >
          {tab.title}
        </Link>
      ))}
    </div>
  );
}
