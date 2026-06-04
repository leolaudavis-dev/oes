import Link from "next/link";
import styles from "./thursday.module.css";
import ThursdayMonitor from "./ThursdayMonitor";

export default function ThursdayPage() {
  return (
    <div className={`${styles.page} thursday-page`}>
      <Link href="/" className={styles.back}>
        ← back to scrapbook
      </Link>
      <header className={styles.header}>
        <h1 className={styles.title}>Thursday</h1>
      </header>

      <ThursdayMonitor />
    </div>
  );
}
