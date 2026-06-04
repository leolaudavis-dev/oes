import Image from "next/image";
import Link from "next/link";
import styles from "./skating.module.css";

export default function SkatingPage() {
  return (
    <div className={styles.page}>
      <Link href="/" className={styles.back}>
        ← back to scrapbook
      </Link>

      <header className={styles.header}>
        <h1 className={styles.title}>Skating!</h1>
      </header>

      <div className={styles.hero}>
        <Image
          className={styles.bandaid}
          src="/skating/bandaid.png"
          alt="broken heart bandaid"
          width={560}
          height={385}
          priority
        />
        <p className={styles.construction}>🚧 under construction 🚧</p>
      </div>
    </div>
  );
}
