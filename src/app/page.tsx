import styles from './page.module.css'
import { NextPage } from "next";
import FrameComponent from '../../components/frame-component';

const MacBookPro168: NextPage = () => {
  return (
    <div className={styles.macbookPro168}>
      <FrameComponent />
    </div>
  );
};

export default MacBookPro168;