"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import styles from "./page.module.css"; // Assuming you have a CSS module at this path
import { NextPage } from "next";
import {
  addHousingData,
  isInDirectoryAlready,
  deleteDataFromDirectory,
} from "../../lib/utils/process";
import { getUserSession, signout } from "../../lib/utils/auth";
import { useRouter } from "next/navigation";
import DirectoryOverrideModal from "../../components/directory-override-modal/directory-override-modal";
import LoadingSpinner from "../../components/loading-spinner/loading-spinner";
import { getUserData, getUserHousingSearchProfile } from "@/lib/utils/data";

type UserHousingSearchProfile =
  | Database["public"]["Tables"]["housing_search_profiles"]["Row"]
  | null;

const MyForm: NextPage = () => {
  const [housingType, setHousingType] = useState("");
  const [moveIn, setMoveIn] = useState("");
  const [housemates, setHousemates] = useState("");
  const [contactMethod, setContactMethod] = useState("");
  const [link, setLink] = useState("");
  const [phone, setPhone] = useState("");
  const [description, setDescription] = useState("");
  const [isFormValid, setIsFormValid] = useState(false);
  const [isModalActive, setIsModalActive] = useState(false);
  const router = useRouter();
  const phoneRegex =
    /^(\+\d{1,2}\s?)?1?\-?\.?\s?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}$/;
  const urlRegex =
    /^(https?:\/\/)?((([a-z\d]([a-z\d-]*[a-z\d])*)\.)+[a-z]{2,}|((\d{1,3}\.){3}\d{1,3}))(\:\d+)?(\/[-a-z\d%_.~+]*)*(\?[;&a-z\d%_.~+=-]*)?(\#[-a-z\d_]*)?$/i;
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const [visitedFields, setVisitedFields] = useState<Set<string>>(new Set());
  const [isLoading, setIsLoading] = useState(true);
  const [workingProfileData, setWorkingProfileData] =
    useState<UserHousingSearchProfile>(null);

  // useEffect(() => {
  //   let directoryData = null;
  //   if (typeof window !== "undefined") {
  //     // check if window is defined (it won't be during server-side rendering)
  //     const urlParams = new URLSearchParams(window.location.search);
  //     const data = urlParams.get("data");
  //     if (data) {
  //       directoryData = JSON.parse(decodeURIComponent(data));
  //       setDescription(directoryData.prefHousemateDetails);
  //       if (directoryData.prefHousingType === 1) {
  //         setHousingType("lease");
  //       } else if (directoryData.prefHousingType === 2) {
  //         setHousingType("short");
  //       } else {
  //         return;
  //       }

  //       if (directoryData.prefMoveIn) {
  //         if (directoryData.prefMoveIn === 1) {
  //           setMoveIn("ASAP");
  //         } else if (directoryData.prefMoveIn === 2) {
  //           setMoveIn("3months");
  //         } else if (directoryData.prefMoveIn === 3) {
  //           setMoveIn("over3months");
  //         }
  //       }

  //       if (directoryData.prefHousemateCount) {
  //         if (directoryData.prefHousemateCount === 1) {
  //           setHousemates("1-2");
  //         } else if (directoryData.prefHousemateCount === 2) {
  //           setHousemates("3-5");
  //         } else if (directoryData.prefHousemateCount === 3) {
  //           setHousemates("6-12");
  //         } else if (directoryData.prefHousemateCount === 4) {
  //           setHousemates("12+");
  //         }
  //       }

  //       if (directoryData.link) {
  //         setLink(directoryData.link);
  //       }

  //       if (directoryData.prefContactMethod) {
  //         if (directoryData.prefContactMethod.includes("@")) {
  //           setContactMethod("email");
  //         } else if (phoneRegex.test(directoryData.prefContactMethod)) {
  //           setContactMethod("phone");
  //           setPhone(directoryData.prefContactMethod);
  //         } else if (directoryData.prefContactMethod.includes("twitter")) {
  //           setContactMethod("twitter");
  //         }
  //       }
  //     }
  //   }
  // }, []);

  useEffect(() => {
    async function pullProfileData() {
      const userData = await getUserData();
      if (!userData) {
        await signout();
        router.replace("/");
        return;
      }

      const userSearchProfile = await getUserHousingSearchProfile(
        userData.user_id
      );
      if (userSearchProfile) {
        setWorkingProfileData(userSearchProfile);
        setDescription(userSearchProfile.pref_housemate_details || "");
      }
      setIsLoading(false);
    }
    pullProfileData();
  }, [router]);

  const handleOptionClick = (
    setOption: React.Dispatch<React.SetStateAction<string>>,
    value: string
  ) => {
    setOption((prev: string) => (prev === value ? "" : value));
  };

  const handleLinkClick = async (e: React.MouseEvent) => {
    const session = await getUserSession();
    // Create some logic that checks if an upload is already in the directory
    setIsLoading(true);
    const isDataPresentAlready = await isInDirectoryAlready(session!.userID);
    setIsLoading(false);
    if (isDataPresentAlready && isFormValid) {
      setIsModalActive(true);
    } else {
      if (!isFormValid) {
        e.preventDefault();
      } else {
        e.preventDefault();
        setIsLoading(true);
        await handleSubmit();
        setIsLoading(false);
      }
    }
  };
  const handleSubmit = async () => {
    try {
      const session = await getUserSession();
      if (session?.userID) {
        await addHousingData(
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
      }
      router.push("/directory");
    } catch (error) {
      alert("You are not logged in");
      // Optionally show an error message to the user
    }
  };

  const handleDeletion = async () => {
    try {
      const session = await getUserSession();
      await deleteDataFromDirectory(session!.userID);
    } catch {
      alert("You are not logged in");
      throw new Error("Couldnt delete from directory");
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

      if (typeof field === "undefined") {
        setFocusedField(null); // or however you want to handle this case
      } else {
        setFocusedField(field);
      }

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

  function handleBlur(field: string) {
    setVisitedFields((prev) => new Set([...prev, field]));
  }

  useEffect(() => {
    if (
      description &&
      housingType &&
      moveIn &&
      housemates &&
      contactMethod &&
      link &&
      // ((contactMethod === "phone" && phoneRegex.test(phone)) ||
      //   contactMethod !== "phone")
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
    isModalActive,
  ]);

  return (
    <div className={styles.container}>
      {isLoading && <LoadingSpinner />}
      <DirectoryOverrideModal
        modalActivity={isModalActive}
        handleSubmit={handleSubmit}
        handleDeletion={handleDeletion}
        setIsModalActive={setIsModalActive}
      />
      <form className={styles.form}>
        <Link href="/directory">Back to directory</Link>
        <h1>Let&#39;s add some information</h1>
        <div
          style={{ height: "1px", backgroundColor: "gray", width: "100%" }}
        />

        <div>
          <label>
            <h2>Introduce yourself. This is what will help you stand out.</h2>
            <p className={styles.maxCharacters}>
              What are you working on? What is important to you? What type of
              environment do you want to live in? What are you interested in?
            </p>
            <div
              style={{
                display: "flex",
                alignItems: "left",
                flexDirection: "column",
              }}
            >
              <textarea
                className={`${styles.textareaStyle} ${
                  visitedFields.has("description") && !description
                    ? styles.inputError
                    : ""
                }`}
                placeholder=""
                onChange={handleInputChange(setDescription, "description")}
                onFocus={() =>
                  setVisitedFields((prev) => new Set([...prev, "description"]))
                }
                onBlur={() => handleBlur("description")}
                autoFocus={true}
                value={workingProfileData?.pref_housemate_details || ""}
              />
              {visitedFields.has("description") && !description && (
                <div className={styles.errorMessage}>
                  This field is required.
                </div>
              )}
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
            1-year lease (easier to find)
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
            Short-term stay (harder to find)
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
            1-2
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
            3-5
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
            6-12
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
            12+
          </div>
        </div>

        <div>
          <label>
            <h2>What&#39;s a link that best describes you?</h2>
            <p className={styles.maxCharacters}>
              Personal website, forum page, blog, Instagram, etc.
            </p>
            <input
              className={`${styles.inputStyle} ${
                visitedFields.has("url") && (!link || !urlRegex.test(link))
                  ? styles.inputError
                  : ""
              }`}
              type="url"
              placeholder="mywebsite.io"
              onChange={handleInputChange(setLink, "url")}
              onFocus={() => setFocusedField("url")}
              onBlur={() => handleBlur("url")}
              value={link}
            />
            {visitedFields.has("url") && (!link || !urlRegex.test(link)) && (
              <div className={styles.errorMessage}>
                {!link
                  ? "This field is required."
                  : "Please enter a valid URL."}
              </div>
            )}
          </label>
        </div>

        {/* <div>
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
                className={`${styles.inputStyle} ${
                  visitedFields.has("phone") &&
                  (!phone || !phoneRegex.test(phone))
                    ? styles.inputError
                    : ""
                }`}
                type="tel"
                placeholder="Phone number"
                onChange={handleInputChange(setPhone, "phone")}
                onFocus={() => setFocusedField("phone")}
                onBlur={() => handleBlur("phone")}
                value={phone}
              />
              {visitedFields.has("phone") &&
                (!phone || !phoneRegex.test(phone)) && (
                  <div className={styles.errorMessage}>
                    {!phone
                      ? "This field is required."
                      : "Please enter a valid phone number."}
                  </div>
                )}
            </label>
          )}
        </div> */}

        <Link
          href="#"
          onClick={(e) => {
            e.preventDefault();
            handleLinkClick(e);
          }}
          className={`${styles.nextButton} ${
            isFormValid ? "" : styles.disabled
          }`}
        >
          Next
        </Link>
      </form>
    </div>
  );
};

export default MyForm;
