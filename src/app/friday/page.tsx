import Link from "next/link";
import styles from "./friday.module.css";
import NameMenu from "./NameMenu";
import DraggableSticker from "../DraggableSticker";

type Track = {
  title: string;
  file: string;
  tilt: "left" | "right";
};

// Files live in /public/friday — encodeURI handles spaces and special chars.
const TRACKS: Track[] = [
  { title: "squished rainbows!!!!", file: "squished rainbows!!!!.m4a", tilt: "left" },
  { title: "waves", file: "waves - Original.m4a", tilt: "right" },
  { title: "canyons", file: "Canyons.m4a", tilt: "left" },
  { title: "best thing ever", file: "Bestthingever.m4a", tilt: "right" },
  { title: "boop", file: "Boop.m4a", tilt: "left" },
  { title: "awesomeness", file: "AWESOMENESS.m4a", tilt: "right" },
  { title: "7#", file: "7#.m4a", tilt: "left" },
  { title: "sunrise beat", file: "sunrise beat.m4a", tilt: "right" },
  { title: "dark times", file: "dark times.m4a", tilt: "left" },
  { title: "merry christmas", file: "merry christmas.m4a", tilt: "right" },
  { title: "heat wave", file: "heat wave .m4a", tilt: "left" },
  { title: "reserved for dan", file: "reserved for dan.m4a", tilt: "right" },
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
        <NameMenu />
      </div>

      <header className={styles.header}>
        <h1 className={styles.title}>Friday</h1>
        <p className={styles.subtitle}>~ after school music club ~</p>
      </header>

      <div className={styles.tracks}>
        {TRACKS.map((track, i) => (
          <figure
            key={track.file}
            className={styles.card}
            data-tilt={track.tilt}
          >
            <span className={styles.tape} aria-hidden />
            <div className={styles.label}>
              <span className={styles.num}>{i + 1}</span>
              <span className={styles.note} aria-hidden>
                ♫
              </span>
              <figcaption className={styles.trackTitle}>{track.title}</figcaption>
            </div>
            <audio
              className={styles.audio}
              controls
              preload="none"
              src={`/friday/${encodeURIComponent(track.file)}`}
            >
              Your browser does not support the audio element.
            </audio>
          </figure>
        ))}
      </div>
    </div>
  );
}
