import Image from "next/image";
import Link from "next/link";
import styles from "./thursday.module.css";

type Item = {
  src: string;
  caption: string;
  tilt: "left" | "right";
};

const ITEMS: Item[] = [
  { src: "/thursday/ohtani.png", caption: "shohei ohtani", tilt: "left" },
  { src: "/thursday/mookie-betts.png", caption: "mookie betts", tilt: "right" },
  { src: "/thursday/seals.png", caption: "pool party seals", tilt: "left" },
  { src: "/thursday/ai-animals.png", caption: "magic forest", tilt: "right" },
  { src: "/thursday/hot-dog.png", caption: "hot dog!", tilt: "left" },
  { src: "/thursday/p38-lightning.png", caption: "the fork-tailed devil", tilt: "right" },
  { src: "/thursday/all-american.png", caption: "all american", tilt: "left" },
  { src: "/thursday/all-american-poster.png", caption: "all american poster", tilt: "right" },
  { src: "/thursday/other-nations.png", caption: "other nations", tilt: "left" },
];

export default function ThursdayPage() {
  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <Link href="/" className={styles.back}>
          ← back to scrapbook
        </Link>
        <h1 className={styles.title}>Thursday</h1>
        <p className={styles.subtitle}>~ after school media club ~</p>
      </header>

      <figure className={styles.videoCard} data-tilt="left">
        <span className={styles.tape} aria-hidden />
        <video className={styles.video} controls playsInline preload="metadata">
          <source src="/thursday/taxi.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
        <figcaption>taxi 🚕 (now playing)</figcaption>
      </figure>

      <div className={styles.gallery}>
        {ITEMS.map((item) => (
          <figure
            key={item.src}
            className={styles.polaroid}
            data-tilt={item.tilt}
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
