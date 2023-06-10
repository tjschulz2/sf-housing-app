"use client";
// Import required libraries
import { useState, useEffect } from "react";
import Link from "next/link";
import styles from "./page.module.css"; // Assuming you have a CSS module at this path
import { NextPage } from "next";
import { addOrganizerData } from "../../../lib/utils/process";
import { useRouter } from "next/navigation";
import { getUserSession } from "../../../lib/utils/auth";

const MyForm: NextPage = () => {
  const [housingType, setHousingType] = useState("");
  const [moveIn, setMoveIn] = useState("");
  const [housemates, setHousemates] = useState("");
  const [contactMethod, setContactMethod] = useState("");
  const [link, setLink] = useState("");
  const [phone, setPhone] = useState("");
  const [description, setDescription] = useState("");
  const [isFormValid, setIsFormValid] = useState(false);
  const router = useRouter();
  const phoneRegex =
    /^(\+\d{1,2}\s?)?1?\-?\.?\s?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}$/;
  const urlRegex = /^((http|https):\/\/)?([a-zA-Z0-9_-]+\.)+[a-zA-Z]{2,}$/;

  const handleOptionClick = (
    setOption: React.Dispatch<React.SetStateAction<string>>,
    value: string
  ) => {
    setOption((prev: string) => (prev === value ? "" : value));
  };

  const handleLinkClick = async (e: React.MouseEvent) => {
    if (!isFormValid) {
      e.preventDefault();
    } else {
      // If form is valid, generate and send confirmation code
      e.preventDefault();
      try {
        const session = await getUserSession();
        await addOrganizerData(
          description,
          housingType,
          moveIn,
          housemates,
          link,
          contactMethod,
          session?.userID,
          session?.twitterHandle,
          phone
        );
        router.push("/directory");
      } catch (error) {
        alert("You are not logged in");
        // Optionally show an error message to the user
      }
    }
  };

  function handleInputChange(
    callback: (value: string) => void,
    field?: string
  ) {
    return (
      event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
      let { value } = event.target;

      // Handle phone field
      if (field === "phone") {
        // Allow only digits
        value = value.replace(/[^\d]/g, "");

        // Adding formatting
        if (value.length > 3 && value.length <= 6)
          value = `(${value.slice(0, 3)}) ${value.slice(3)}`;
        else if (value.length > 6)
          value = `(${value.slice(0, 3)}) ${value.slice(3, 6)}-${value.slice(
            6,
            10
          )}`;

        event.target.value = value;
      }
      // Handle URL field
      else if (field === "url" && !urlRegex.test(value)) {
        console.error("Invalid URL");
        setIsFormValid(false);
      }

      callback(value);
    };
  }

  useEffect(() => {
    if (
      description &&
      housingType &&
      moveIn &&
      housemates &&
      contactMethod &&
      ((contactMethod === "phone" && phoneRegex.test(phone)) ||
        contactMethod !== "phone") &&
      urlRegex.test(link)
    ) {
      setIsFormValid(true);
    } else {
      setIsFormValid(false);
    }
  }, [
    description,
    housingType,
    moveIn,
    housemates,
    contactMethod,
    link,
    phone,
  ]);

  return (
    <div className={styles.container}>
      <form className={styles.form}>
        <Link href="/directory/people-organizing">Back to directory</Link>
        <h1>Start a new house or apartment</h1>
        <div
          style={{ height: "1px", backgroundColor: "gray", width: "100%" }}
        />

        <div>
          <label>
            <h2>
              Introduce yourself and share what you want the house to be about.
            </h2>
            <p className={styles.maxCharacters}>
              What should people be interested in doing? What are you working
              on? What type of environment do you want to live in?
            </p>
            <div style={{ display: "flex", alignItems: "center" }}>
              <textarea
                className={styles.textareaStyle}
                placeholder="Building startups...AGI...A focused environment..."
                onChange={handleInputChange(setDescription)}
              />
            </div>
          </label>
        </div>

        <div>
          <h2>What type of housing do you want?</h2>
          <div
            className={styles.options}
            onClick={() => handleOptionClick(setHousingType, "lease")}
          >
            <div
              className={`${styles.option} ${
                housingType === "lease" ? styles.optionSelected : ""
              }`}
            ></div>
            1-year lease (easier to organize, less money)
          </div>
          <div
            className={styles.options}
            onClick={() => handleOptionClick(setHousingType, "short")}
          >
            <div
              className={`${styles.option} ${
                housingType === "short" ? styles.optionSelected : ""
              }`}
            ></div>
            Short-term stay (harder to find, more money)
          </div>
        </div>

        <div>
          <h2>When do you want to move in?</h2>
          <div
            className={styles.options}
            onClick={() => handleOptionClick(setMoveIn, "ASAP")}
          >
            <div
              className={`${styles.option} ${
                moveIn === "ASAP" ? styles.optionSelected : ""
              }`}
            ></div>
            ASAP
          </div>
          <div
            className={styles.options}
            onClick={() => handleOptionClick(setMoveIn, "3months")}
          >
            <div
              className={`${styles.option} ${
                moveIn === "3months" ? styles.optionSelected : ""
              }`}
            ></div>
            &lt;3 months
          </div>
          <div
            className={styles.options}
            onClick={() => handleOptionClick(setMoveIn, "over3months")}
          >
            <div
              className={`${styles.option} ${
                moveIn === "over3months" ? styles.optionSelected : ""
              }`}
            ></div>
            3+ months
          </div>
        </div>

        <div>
          <h2>How many housemates do you want to live with?</h2>
          <div
            className={styles.options}
            onClick={() => handleOptionClick(setHousemates, "1-2")}
          >
            <div
              className={`${styles.option} ${
                housemates === "1-2" ? styles.optionSelected : ""
              }`}
            ></div>
            1-2 (low commitment)
          </div>
          <div
            className={styles.options}
            onClick={() => handleOptionClick(setHousemates, "3-5")}
          >
            <div
              className={`${styles.option} ${
                housemates === "3-5" ? styles.optionSelected : ""
              }`}
            ></div>
            3-5 (medium commitment)
          </div>
          <div
            className={styles.options}
            onClick={() => handleOptionClick(setHousemates, "6-12")}
          >
            <div
              className={`${styles.option} ${
                housemates === "6-12" ? styles.optionSelected : ""
              }`}
            ></div>
            6-12 (high commitment)
          </div>
          <div
            className={styles.options}
            onClick={() => handleOptionClick(setHousemates, "12+")}
          >
            <div
              className={`${styles.option} ${
                housemates === "12+" ? styles.optionSelected : ""
              }`}
            ></div>
            12+ (this isn&#39;t a joke, don&#39;t do this if you are not
            prepared to do this full time)
          </div>
        </div>

        <div>
          <label>
            <h2>What&#39;s a link that best describes you?</h2>
            <p className={styles.maxCharacters}>
              Personal website, forum page, blog, Instagram, etc.
            </p>
            <input
              className={styles.inputStyle}
              type="url"
              placeholder="mywebsite.io"
              onChange={handleInputChange(setLink, "url")}
            />
          </label>
        </div>

        <div>
          <h2>How would you like people to contact you about housing?</h2>
          <div
            className={styles.options}
            onClick={() => handleOptionClick(setContactMethod, "phone")}
          >
            <div
              className={`${styles.option} ${
                contactMethod === "phone" ? styles.optionSelected : ""
              }`}
            ></div>
            Phone number
          </div>
          <div
            className={styles.options}
            onClick={() => handleOptionClick(setContactMethod, "email")}
          >
            <div
              className={`${styles.option} ${
                contactMethod === "email" ? styles.optionSelected : ""
              }`}
            ></div>
            Email address
          </div>
          <div
            className={styles.options}
            onClick={() => handleOptionClick(setContactMethod, "twitter")}
          >
            <div
              className={`${styles.option} ${
                contactMethod === "twitter" ? styles.optionSelected : ""
              }`}
            ></div>
            Twitter DMs (make sure your DMs are on)
          </div>

          {contactMethod === "phone" && (
            <label>
              <input
                className={styles.inputStyle}
                type="tel"
                placeholder="Phone number"
                maxLength={14}
                onChange={handleInputChange(setPhone, "phone")}
              />
            </label>
          )}
        </div>

        <Link
          className={`${styles.nextButton} ${
            isFormValid ? "" : styles.disabled
          }`}
          href={isFormValid ? "/#" : "#"}
          onClick={handleLinkClick}
        >
          Next
        </Link>
      </form>
    </div>
  );
};

export default MyForm;
