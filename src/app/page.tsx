'use client';
import styles from './page.module.css';
import { NextPage } from 'next';
import { useSearchParams } from 'next/navigation'
import HomePageComponent from '../../components/home-page-component';

const MacBookPro168: NextPage = () => {
  const referralCode = useSearchParams().get('referralCode');
  const normalizedReferralCode = Array.isArray(referralCode) ? referralCode[0] : referralCode;

  return (
    <div className={styles.macbookPro168}>
      <HomePageComponent referralCode={normalizedReferralCode} />
    </div>
  );
};

export default MacBookPro168;