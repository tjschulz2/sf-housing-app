import styles from "./loading-spinner.module.css";

export default function LoadingSpinner({
  overlay = true,
}: {
  overlay?: boolean;
}) {
  if (overlay) {
    return (
      <div className={styles.overlay}>
        <div className={styles.spinner}></div>
      </div>
    );
  } else {
    return (
      <div className="flex justify-center p-4">
        <div className={styles.spinner}></div>
      </div>
    );
  }
}
