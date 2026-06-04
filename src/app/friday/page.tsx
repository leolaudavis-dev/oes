import Image from "next/image";
import Link from "next/link";
import styles from "./friday.module.css";
import DraggableSticker from "../DraggableSticker";

const COVERS: { src: string; alt: string; href?: string }[] = [
  {
    src: "/friday/covers/see-my-vision.png",
    alt: "See My Vision — Nora & Alexa",
    href: "/alexa-nora",
  },
  {
    src: "/friday/covers/blue-shades-glitch.png",
    alt: "Rosie and Luna are Blue Shades",
    href: "/blue-shades",
  },
  {
    src: "/friday/covers/be-yourself.png",
    alt: "Be Yourself — Amelia Reeves",
    href: "/amelia",
  },
  {
    src: "/friday/covers/futures-of-dance-zipdown.png",
    alt: "Futures of Dance — Zip Up",
    href: "/isaiah",
  },
  {
    src: "/friday/covers/miles-grieser.png",
    alt: "Miles Grieser — The Even Funner Tracks",
    href: "/miles",
  },
];

export default function FridayPage() {
  return (
    <div className={`${styles.page} friday-page`}>
      <DraggableSticker
        src="/friday/note-corner.png"
        alt="rhinestone music note"
        width={200}
        height={175}
        initialX={300}
        initialY={180}
        rotate={-6}
      />

      <div className={styles.topLeft}>
        <Link href="/" className={styles.back}>
          ← back to scrapbook
        </Link>
      </div>

      <div className={styles.covers}>
        {COVERS.map((cover) => {
          const img = (
            <Image
              className={styles.coverImg}
              src={cover.src}
              alt={cover.alt}
              width={500}
              height={500}
              sizes="(max-width: 600px) 90vw, (max-width: 900px) 45vw, 260px"
            />
          );
          return cover.href ? (
            <Link key={cover.src} href={cover.href} className={styles.cover}>
              {img}
            </Link>
          ) : (
            <div key={cover.src} className={styles.cover}>
              {img}
            </div>
          );
        })}
      </div>
    </div>
  );
}
