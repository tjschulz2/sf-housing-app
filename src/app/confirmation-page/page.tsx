"use client";
import styles from "./page.module.css";
import { NextPage } from "next";
import { useState, useEffect } from 'react';
import { useRouter } from "next/navigation";
import Link from 'next/link';
import { checkConfirmationCode } from '../../../lib/utils/confirmation';
import { updateUserContactEmail } from "../../../lib/utils/auth";


const ConfirmationPage: NextPage = () => {
    const [code, setCode] = useState('');
    const [isFormValid, setIsFormValid] = useState(false);
    const router = useRouter();
    const [email, setEmail] = useState('');

    function handleInputChange(callback: (value: string) => void) {
        return (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
          callback(event.target.value);
        };
      }

      useEffect(() => {
        if (typeof window !== "undefined") {
            setEmail(localStorage.getItem('email') || '');
        }
    }, []);

      useEffect(() => {
        const numberRegex = /^\d{4}$/;
        setIsFormValid(numberRegex.test(code));
    }, [code]);
    
    const handleLinkClick = async (e: React.MouseEvent) => {
        if (!isFormValid) {
            e.preventDefault();
        } else {
            // If form is valid, generate and send confirmation code
            e.preventDefault();
            try {
                await checkConfirmationCode(email, Number(code));
                await updateUserContactEmail(email)
                router.push('/directory')
                // If successful, then navigate to the next page
                //window.location.href = "/next";
            } catch (error) {
                alert('Wrong code. Try again.')
                console.error('Bad confirmation code', error);
                // Optionally show an error message to the user
            }
        }
    }

  return (
    <div className={styles.container}>
    <form className={styles.form}>
        <Link href="/email-signup">Back to email page</Link>
        <h1>Confirmation code verification</h1>
        <div style={{ height: '1px', backgroundColor: 'gray', width: '100%' }} />

        <div>
            <label>
                <h2>What&#39;s the four digit code?</h2>
                <p>{`Check ${email} for the confirmation code`}</p>
                <input className={styles.inputStyle} type="number" placeholder="1234" onChange={handleInputChange(setCode)} />
            </label>
        </div>

        <Link className={`${styles.nextButton} ${isFormValid ? '' : styles.disabled}`} href={isFormValid ? "/#" : "#"} onClick={handleLinkClick}>
            Finish
        </Link>
    </form>
</div>
  );
};

export default ConfirmationPage;
