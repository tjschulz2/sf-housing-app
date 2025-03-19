import { useState } from "react";
import styles from "./home-page-component.module.css";
import Image from "next/image";
export default function HeaderBar() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <header
      className="
      bg-[#FEFBEB]
      flex justify-between items-center
      px-4 sm:px-10 py-5
      border-b border-black border-opacity-10
      relative
    "
    >
      <span
        className="
          flex flex-row items-center space-x-3 
          px-3 py-4 transition-all duration-300
          -my-5 // Negative margin to extend to top and bottom
        "
      >
        <span className={styles.branding}>DirectorySF</span>
      </span>
      <a href="https://x.com/directorysf" target="_blank">
        <Image
          src="/images/twitter-logo.svg"
          unoptimized={true}
          width={20}
          height={20}
          alt="Twitter icon"
          className="ml-1 overflow-visible filter grayscale hover:grayscale-0 transition-all duration-300"
        />
      </a>
    </header>
  );
}
