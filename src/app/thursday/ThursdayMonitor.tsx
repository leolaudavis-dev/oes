"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import styles from "./thursday.module.css";

type Item = {
  src: string;
  caption: string;
};

const ITEMS: Item[] = [
  { src: "/thursday/ohtani.png", caption: "shohei ohtani" },
  { src: "/thursday/mookie-betts.png", caption: "mookie betts" },
  { src: "/thursday/seals.png", caption: "pool party seals" },
  { src: "/thursday/ai-animals.png", caption: "magic forest" },
  { src: "/thursday/hot-dog.png", caption: "hot dog!" },
  { src: "/thursday/p38-lightning.png", caption: "the fork-tailed devil" },
  { src: "/thursday/all-american.png", caption: "all american" },
  { src: "/thursday/all-american-poster.png", caption: "all american poster" },
  { src: "/thursday/other-nations.png", caption: "other nations" },
];

export default function ThursdayMonitor() {
  const [index, setIndex] = useState(0);
  const len = ITEMS.length;
  const step = useCallback((d: number) => setIndex((i) => (i + d + len) % len), [len]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") step(1);
      else if (e.key === "ArrowLeft") step(-1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [step]);

  const item = ITEMS[index];

  return (
    <div className={styles.monitorWrap}>
      <div className={styles.monitor}>
        {/* photo nestled in the Paint canvas */}
        <div className={styles.screen}>
          <Image
            className={styles.screenImg}
            src={item.src}
            alt={item.caption}
            fill
            sizes="(max-width: 600px) 70vw, 520px"
            priority
          />
        </div>
      </div>

      <div className={styles.monBar}>
        <button
          className={styles.scrBtn}
          type="button"
          onClick={() => step(-1)}
          aria-label="Previous image"
        >
          ‹
        </button>
        <p className={styles.monCaption}>
          {item.caption}
          <span className={styles.monCounter}>
            {" "}
            ({index + 1}/{len})
          </span>
        </p>
        <button
          className={styles.scrBtn}
          type="button"
          onClick={() => step(1)}
          aria-label="Next image"
        >
          ›
        </button>
      </div>
    </div>
  );
}
