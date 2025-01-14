import { useState } from "react";
import styles from "./home-page-component.module.css";

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
      <a
        href="https://solarissf.com"
        className="
          flex flex-row items-center space-x-3 
          hover:bg-[#E7E8D9] hover:text-[#005B41] 
          px-3 py-4 transition-all duration-300
          -my-5 // Negative margin to extend to top and bottom
        "
      >
        <img
          className="w-7 h-9"
          src="/solaris_ai_logo.png"
          alt="Solaris logo"
        />
        <span className={styles.branding}>SOLARIS</span>
      </a>
      <div className="md:hidden">
        <button
          onClick={toggleMenu}
          className="
            text-[#1D462F]
            hover:text-[#005B41]
            focus:outline-none
          "
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M4 6h16M4 12h16M4 18h16"
            ></path>
          </svg>
        </button>
      </div>
      <nav className="hidden md:flex md:items-center md:space-x-6">
        {/* <ul className="md:flex md:space-x-6">
          {[
            { name: 'List a rental', link: 'https://airtable.com/appurOWXAegMj76UY/pagI9io5qFhw7F264/form' }
          ].map((item) => (
            <li key={item.name}>
              <a 
                href={item.link}
                className="
                  font-noto-serif text-[#1D462F] font-semibold 
                  hover:bg-[#E7E8D9] hover:text-[#005B41] 
                  px-3 py-1 rounded-lg transition-all duration-300
                  inline-block
                "
              >
                {item.name}
              </a>
            </li>
          ))}
        </ul> */}
      </nav>
      {isOpen && (
        <div
          className="
          absolute top-full left-0 w-full bg-[#FEFBEB] border-t border-black border-opacity-10
          md:hidden z-50
        "
        >
          <nav>
            <ul className="flex flex-col items-center space-y-4 py-4">
              {[
                {
                  name: "Solaris AI",
                  link: "https://www.solarissf.com/solaris-ai/root",
                },
                { name: "DirectorySF", link: "https://directorysf.com" },
                {
                  name: "Email",
                  link: "mailto:thomas@solarissf.com?subject=Let%27s%20talk%20Solaris",
                },
                { name: "Twitter", link: "https://x.com/solarissociety" },
              ].map((item) => (
                <li key={item.name}>
                  <a
                    href={item.link}
                    className="
                      font-noto-serif text-[#1D462F] font-semibold 
                      hover:bg-[#E7E8D9] hover:text-[#005B41] 
                      px-3 py-1 rounded-lg transition-all duration-300
                      inline-block
                    "
                  >
                    {item.name}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      )}
    </header>
  );
}
