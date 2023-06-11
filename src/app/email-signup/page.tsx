"use client";
import styles from "./page.module.css";
import { NextPage } from "next";
import { useState, useEffect } from 'react';
import { useRouter } from "next/navigation";
import Link from 'next/link';
import { generateAndSendConfirmation } from '../../../lib/utils/confirmation';


const EmailSignup: NextPage = () => {
    const [email, setEmail] = useState('');
    const [isFormValid, setIsFormValid] = useState(false);
    const router = useRouter();
    function handleInputChange(callback: (value: string) => void) {
        return (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
          callback(event.target.value);
        };
      }

    useEffect(() => {
        const emailRegex = /^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/;
        setIsFormValid(emailRegex.test(email));
    }, [email]);
    
    const handleLinkClick = async (e: React.MouseEvent) => {
        if (!isFormValid) {
            e.preventDefault();
        } else {
            // If form is valid, generate and send confirmation code
            e.preventDefault();
            try {
                await generateAndSendConfirmation(email);
                localStorage.setItem('email', email)
                router.push('/confirmation-page')
                // If successful, then navigate to the next page
                //window.location.href = "/next";
            } catch (error) {
                console.error('Failed to send confirmation code:', error);
                // Optionally show an error message to the user
            }
        }
    }

  return (
    <div className={styles.container}>
    <form className={styles.form}>
        <h1>Email confirmation</h1>
        <div style={{ height: '1px', backgroundColor: 'gray', width: '100%' }} />

        <div>
            <label>
                <h2>What&#39;s your email address?</h2>
                <p className={styles.maxCharacters}>We&#39;ll use this to contact you about new people looking for housing + communities.</p>
                <input className={styles.inputStyle} type="email" placeholder="email@address.com" onChange={handleInputChange(setEmail)} />
            </label>
        </div>

        <Link href="#" onClick={(e) => {e.preventDefault(); handleLinkClick(e);}} className={`${styles.nextButton} ${isFormValid ? '' : styles.disabled}`}>
            Next
        </Link>
    </form>
</div>
  );
};

export default EmailSignup;
