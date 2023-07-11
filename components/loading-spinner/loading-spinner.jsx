import styles from "./loading-spinner.module.css";

export default function LoadingSpinner() {
  return (
    <div className={styles.overlay}>
      <div className={styles.spinner}></div>
    </div>
  );
}
