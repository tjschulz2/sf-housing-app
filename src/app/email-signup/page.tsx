"use client";
import styles from "./page.module.css";
import { NextPage } from "next";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { generateAndSendConfirmation } from "../../lib/utils/confirmation";
import LoadingSpinner from "../../components/loading-spinner/loading-spinner";

const EmailSignup: NextPage = () => {
  const [email, setEmail] = useState("");
  const [isFormValid, setIsFormValid] = useState(false);
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  function handleInputChange(callback: (value: string) => void) {
    return (
      event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
      callback(event.target.value);
    };
  }

  useEffect(() => {
    const emailRegex = /^[\w-.]+(\+[\.\w-]+)?@([\w-]+\.)+[a-zA-Z]{2,7}$/;
    setIsFormValid(emailRegex.test(email));
  }, [email]);

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (isFormValid) {
      // If form is valid, generate and send confirmation code
      try {
        setIsLoading(true);
        await generateAndSendConfirmation(email);
        setIsLoading(false);
        localStorage.setItem("email", email);
        router.push("/confirmation-page");
        // If successful, then navigate to the next page
        //window.location.href = "/next";
      } catch (error) {
        setIsLoading(false);
        console.error("Failed to send confirmation code:", error);
        // Optionally show an error message to the user
      }
    }
  };

  return (
    <div className={styles.container}>
      {isLoading && <LoadingSpinner />}
      <form className={styles.form} onSubmit={handleFormSubmit}>
        <h1>Email confirmation</h1>
        <div
          style={{ height: "1px", backgroundColor: "gray", width: "100%" }}
        />

        <div>
          <label>
            <h2>What&#39;s your email address?</h2>
            <p className={styles.maxCharacters}>
              We&#39;ll use this to contact you about new people looking for
              housing + communities.
            </p>
            <input
              className={styles.inputStyle}
              type="email"
              placeholder="email@address.com"
              onChange={handleInputChange(setEmail)}
            />
          </label>
        </div>

        <button
          type="submit"
          className={`${styles.nextButton} ${
            isFormValid ? "" : styles.disabled
          }`}
        >
          Next
        </button>
      </form>
    </div>
  );
};

export default EmailSignup;
