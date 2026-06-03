import Link from "next/link";
import styles from "./monday.module.css";
import MondayGallery from "./MondayGallery";
import DraggableSticker from "./DraggableSticker";

export default function MondayPage() {
  return (
    <div className={`${styles.page} monday-page`}>
      <header className={styles.header}>
        <Link href="/" className={styles.back}>
          ← back to scrapbook
        </Link>
        <h1 className={styles.title}>Monday</h1>
        <p className={styles.subtitle}>~ after school art club ~</p>
      </header>

      <MondayGallery />

      <DraggableSticker
        src="/monday/hand-sticker.png"
        alt="hand sticker"
        width={160}
        height={138}
        storageKey="monday-hand-sticker-pos"
        initial={{ x: 130, y: 340 }}
      />
      <DraggableSticker
        src="/monday/star-sticker.png"
        alt="glitter star sticker"
        width={120}
        height={119}
        storageKey="monday-star-sticker-1"
        initial={{ x: 540, y: 150 }}
      />
      <DraggableSticker
        src="/monday/star-sticker.png"
        alt="glitter star sticker"
        width={96}
        height={95}
        storageKey="monday-star-sticker-2"
        initial={{ x: 300, y: 560 }}
      />
    </div>
  );
}
