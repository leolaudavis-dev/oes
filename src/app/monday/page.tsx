import Link from "next/link";
import styles from "./monday.module.css";
import MondayGallery from "./MondayGallery";
import DraggableSticker from "./DraggableSticker";

export default function MondayPage() {
  return (
    <div className={`${styles.page} monday-page`}>
      <Link href="/" className={styles.back}>
        ← back to scrapbook
      </Link>
      <header className={styles.header}>
        <h1 className={styles.title}>Monday</h1>
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
      <DraggableSticker
        src="/monday/sticker-cupcake-cherry.png"
        alt="blue frosting cupcake with cherry"
        width={106}
        height={122}
        storageKey="monday-cupcake-cherry"
        initial={{ x: 780, y: 150 }}
      />
      <DraggableSticker
        src="/monday/sticker-donut.png"
        alt="green donut with pink drizzle"
        width={102}
        height={93}
        storageKey="monday-donut"
        initial={{ x: 980, y: 360 }}
      />
      <DraggableSticker
        src="/monday/sticker-cupcake-white.png"
        alt="vanilla cupcake with sprinkles"
        width={96}
        height={111}
        storageKey="monday-cupcake-white"
        initial={{ x: 840, y: 540 }}
      />
      <DraggableSticker
        src="/monday/sticker-heart-plate.png"
        alt="heart plate with fork and knife"
        width={188}
        height={120}
        storageKey="monday-heart-plate"
        initial={{ x: 1060, y: 180 }}
      />
      <DraggableSticker
        src="/monday/stars-gif.webp"
        alt="glitter shooting stars"
        width={180}
        height={124}
        storageKey="monday-stars-gif"
        initial={{ x: 900, y: 150 }}
        flipX
        initialRotation={28}
        unoptimized
      />
      <DraggableSticker
        src="/monday/sticker-bow.png"
        alt="pink gift bow"
        width={120}
        height={123}
        storageKey="monday-bow"
        initial={{ x: 660, y: 210 }}
      />
      <DraggableSticker
        src="/monday/sticker-clip.png"
        alt="pink binder clip"
        width={112}
        height={124}
        storageKey="monday-clip"
        initial={{ x: 700, y: 280 }}
      />
      <DraggableSticker
        src="/monday/stickers-corner.png"
        alt="kids' stickers collage"
        width={242}
        height={332}
        storageKey="monday-stickers-clipping"
        initial={{ x: 40, y: 520 }}
      />
      <DraggableSticker
        src="/monday/sticker-heart-plate.png"
        alt="heart plate with fork and knife"
        width={188}
        height={120}
        storageKey="monday-heart-plate-2"
        initial={{ x: 500, y: 700 }}
      />
      <DraggableSticker
        src="/monday/sticker-heart-plate.png"
        alt="heart plate with fork and knife"
        width={188}
        height={120}
        storageKey="monday-heart-plate-3"
        initial={{ x: 880, y: 720 }}
      />
    </div>
  );
}
