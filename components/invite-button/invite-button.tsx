"use client";
import { useState, useEffect } from 'react';
import Modal from '../modal/modal';
import { supabase } from '../../lib/supabaseClient';
import { getUserSession } from '../../lib/utils/auth';
import styles from './invite-button.module.css'

const referralBaseLink = 'https://directorysf.com/?referralCode=';

const InviteButton = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [referralLink, setReferralLink] = useState('');
  const [isSuper, setIsSuper] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      const session = await getUserSession();

      if (session && session.twitterID) {
        const { data, error } = await supabase
          .from('users')
          .select('user_id, is_super')
          .eq('twitter_id', session.twitterID);

        if (error) console.error('Error fetching user:', error);

        if (data && data.length > 0) {
          const user = data[0];
          setIsSuper(user.is_super !== null ? user.is_super : false);
        }
      }
    };

    fetchUserData();
  }, []);

  const generateReferralCode = async () => {
    try {
      const { data: userData } = await supabase
        .from('users')
        .select('*')
        .eq('is_super', isSuper);

      if (userData && userData.length > 0) {
        const user = userData[0];
        let referralCode;
        let newReferralLink;

        // Fetch existing referral from the referrals table
        const { data: referralData } = await supabase
          .from('referrals')
          .select('*')
          .eq('originator_id', user.user_id)
          .order('created_at', { ascending: false })
          .limit(1);

        // If user is a super user and the usage limit has not been reached, use the existing referral code
        if (  user.is_super &&
          referralData &&
          referralData.length > 0 &&
          referralData[0] &&
          (referralData[0].usage_limit || 1) > (referralData[0]?.usage_count || 0)) {
          referralCode = referralData[0].referral_id;
          newReferralLink = `${referralBaseLink}${referralCode}`;
        } else {
          // Generate a new referral code for the user
          referralCode = Math.floor(Math.random() * 1000000000000000);
          newReferralLink = `${referralBaseLink}${referralCode}`;

          // Insert a new record into the `referrals` table
          const { error: insertError } = await supabase.from('referrals').insert([
            {
              referral_id: referralCode,
              originator_id: user.user_id,
              usage_limit: isSuper ? 500 : 1,
              usage_count: 0,
            },
          ]);

          if (insertError) throw insertError;
        }

        setReferralLink(newReferralLink);
      }
    } catch (error) {
      console.error('Failed to generate referral code:', error);
    }
  };

  const openModal = async () => {
    await generateReferralCode();
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(referralLink);
      alert('Referral link copied to clipboard!');
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  return (
    <>
      <a className={styles.inviteButton} onClick={openModal}>Invite a friend</a>
      <Modal closeModal={closeModal} isOpen={isOpen}>
      <div
          style={{
            position: "relative",
            marginBottom: "16px",
            marginLeft: "16px",
            marginRight: "16px",
          }}
        >
          <button
            onClick={closeModal}
            style={{ position: "absolute", top: 0, right: 0 }}
          >
            x
          </button>
          <h2>Invite a friend</h2>
          <p style={{ color: "grey" }}>
            {isSuper ? (`You have 500 invitations with this link. Only refer people you know, trust, or think would be a good fit for
            this directory. Referring randoms will get your referral link
            reversed.`) : (`Only refer people you know, trust, or think would be a good fit for
            this directory. Referring randoms will get your referral link
            reversed.`)}
          </p>
          <div className={styles.referralClipboard} onClick={copyToClipboard}>
            <img style={{ marginRight: "8px" }} src="/link.svg" />
            {referralLink}
          </div>
        </div>
      </Modal>
    </>
  );
};

export default InviteButton;
