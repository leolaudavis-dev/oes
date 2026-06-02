import Image from "next/image";
import Link from "next/link";
import styles from "./monday.module.css";

type Item = {
  src: string;
  caption: string;
  tilt: "left" | "right";
  wide?: boolean;
};

const ITEMS: Item[] = [
  { src: "/monday/pineapple.png", caption: "i am a pineapple!", tilt: "left" },
  { src: "/monday/scan3.png", caption: "you are amazing ♡", tilt: "right" },
  { src: "/monday/scan2.png", caption: "mr. squarepants", tilt: "left" },
  { src: "/monday/scan5.png", caption: "i do not need to change", tilt: "right" },
  { src: "/monday/scan1.png", caption: "the little guys", tilt: "left" },
  { src: "/monday/scan4.png", caption: "odds & ends", tilt: "right" },
  { src: "/monday/stickers2.png", caption: "sticker sheet", tilt: "left", wide: true },
  { src: "/monday/stickers.png", caption: "more stickers", tilt: "right", wide: true },
  { src: "/monday/iggycandy.png", caption: "fall treats", tilt: "left", wide: true },
  { src: "/monday/fallstickers.png", caption: "pumpkin patch", tilt: "right", wide: true },
];

export default function MondayPage() {
  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <Link href="/" className={styles.back}>
          ← back to scrapbook
        </Link>
        <h1 className={styles.title}>Monday</h1>
        <p className={styles.subtitle}>~ after school art club ~</p>
      </header>

      <div className={styles.gallery}>
        {ITEMS.map((item) => (
          <figure
            key={item.src}
            className={styles.polaroid}
            data-tilt={item.tilt}
            data-wide={item.wide ? "true" : undefined}
          >
            <span className={styles.tape} aria-hidden />
            <div className={styles.photo}>
              <Image
                className={styles.photoImg}
                src={item.src}
                alt={item.caption}
                fill
                sizes="(max-width: 600px) 90vw, 320px"
              />
            </div>
            <figcaption>{item.caption}</figcaption>
          </figure>
        ))}
      </div>
    </div>
  );
}
