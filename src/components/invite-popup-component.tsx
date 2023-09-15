'use client';
import React, { useState, useEffect } from 'react';
import Popup from 'reactjs-popup';
import 'reactjs-popup/dist/index.css';
import styles from './invite-popup-component.module.css';

const InvitePopup = () => {
    const [isOpen, setIsOpen] = useState(false);
    const closeModal = () => setIsOpen(false);

    const referralLink = "http://yourReferralLink.com";
    
    const copyToClipboard = async () => {
        try {
            await navigator.clipboard.writeText(referralLink);
            alert("Referral link copied to clipboard!");
        } catch (err) {
            console.error('Failed to copy text: ', err);
        }
    }

    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
    }, [isOpen]);

    return (
        <div>
            <a href='#' className={styles.inviteButton} onClick={() => setIsOpen(true)}>Invite a friend</a>
            <Popup open={isOpen} closeOnDocumentClick onClose={closeModal}>
                <div style={{ position: 'relative', marginBottom: '16px', marginLeft: '16px', marginRight: '16px' }}>
                    <button onClick={closeModal} style={{ position: 'absolute', top: 0, right: 0 }}>x</button>
                    <h2>Invite a friend</h2>
                    <p style={{ color: 'grey' }}>Only refer people you know, trust, or think would be a good fit for this directory. Referring randoms will get your referral link reversed.</p>
                    <div className={styles.referralClipboard} onClick={copyToClipboard}>
                        <img style={{ marginRight: '8px' }} src='/link.svg' />
                        {referralLink}
                    </div>
                </div>
            </Popup>
        </div>
    );
}

export default InvitePopup;