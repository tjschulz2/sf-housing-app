import { useState } from "react";
import styles from "./home-page-component.module.css";
import InviteButton from "../components/invite-button/invite-button";
import Dropdown from "../components/dropdown/dropdown";
import WhiteGloveButton from "../components/whiteglove-button/whiteglove-button";

interface HeaderBarInAppProps {
  userSession: {
    twitterAvatarURL: string;
    // add other fields as necessary
  };
}

export default function HeaderBarInApp({ userSession }: HeaderBarInAppProps) {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <header
      className={`
      bg-[#FEFBEB]
      flex items-center
      px-4 sm:px-10 py-5
      border-b border-black border-opacity-10
      relative
      ${styles.responsiveHeaderPadding}
    `}
    >
      <a
        href="https://solarissf.com"
        className={`
          flex flex-row items-center space-x-3 
          hover:bg-[#E7E8D9] hover:text-[#005B41] 
          px-3 py-4 transition-all duration-300
          -my-5 ${styles.hiddenOnVerySmallScreens} // Negative margin to extend to top and bottom
        `}
      >
        <img
          className="w-7 h-9"
          src="/solaris_ai_logo.png"
          alt="Solaris logo"
        />
        <span className={`${styles.branding} hidden md:block`}>SOLARIS</span>
      </a>
      <h1
        className={`text-3xl font-bold absolute left-1/2 transform -translate-x-1/2 hidden xl:block`}
      >
        DirectorySF
      </h1>
      <div className="ml-auto flex items-center">
        <div className="flex gap-2 md:gap-4">
          <WhiteGloveButton />
          <InviteButton />
        </div>

        <Dropdown userAvatarURL={userSession.twitterAvatarURL} />
      </div>
    </header>
  );
}
