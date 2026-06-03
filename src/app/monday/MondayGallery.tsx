"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import styles from "./monday.module.css";

type Item = {
  src: string;
  caption: string;
};

const ITEMS: Item[] = [
  { src: "/monday/pineapple.png", caption: "i am a pineapple!" },
  { src: "/monday/scan3.png", caption: "you are amazing ♡" },
  { src: "/monday/scan2.png", caption: "mr. squarepants" },
  { src: "/monday/scan5.png", caption: "i do not need to change" },
  { src: "/monday/scan1.png", caption: "the little guys" },
  { src: "/monday/scan4.png", caption: "odds & ends" },
  { src: "/monday/stickers2.png", caption: "sticker sheet" },
  { src: "/monday/stickers.png", caption: "more stickers" },
  { src: "/monday/iggycandy.png", caption: "fall treats" },
  { src: "/monday/fallstickers.png", caption: "pumpkin patch" },
];

export default function MondayGallery() {
  const [current, setCurrent] = useState(0);
  const [open, setOpen] = useState<number | null>(null);
  const isOpen = open !== null;
  const last = ITEMS.length - 1;

  const stepCarousel = useCallback(
    (delta: number) => setCurrent((i) => (i + delta + ITEMS.length) % ITEMS.length),
    []
  );
  const close = useCallback(() => setOpen(null), []);
  const stepLightbox = useCallback(
    (delta: number) =>
      setOpen((o) => (o === null ? o : (o + delta + ITEMS.length) % ITEMS.length)),
    []
  );

  // Arrow keys drive the carousel; once the lightbox is open it takes over.
  useEffect(() => {
    if (isOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") stepCarousel(1);
      else if (e.key === "ArrowLeft") stepCarousel(-1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isOpen, stepCarousel]);

  // Lightbox keyboard controls + body scroll lock.
  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      else if (e.key === "ArrowRight") stepLightbox(1);
      else if (e.key === "ArrowLeft") stepLightbox(-1);
    };
    window.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [isOpen, close, stepLightbox]);

  const item = ITEMS[current];
  const lit = open === null ? null : ITEMS[open];

  return (
    <>
      <div className={styles.carousel}>
        <figure className={styles.carItem}>
          <button
            className={styles.openBtn}
            type="button"
            onClick={() => setOpen(current)}
            aria-label={`Open full view: ${item.caption}`}
          >
            <div className={styles.frame}>
              <div className={styles.photo}>
                <Image
                  className={styles.photoImg}
                  src={item.src}
                  alt={item.caption}
                  fill
                  sizes="(max-width: 600px) 80vw, 520px"
                  priority
                />
              </div>
            </div>
          </button>
          <figcaption className={styles.caption}>{item.caption}</figcaption>
          <span className={styles.carCounter}>
            {current + 1} / {ITEMS.length}
          </span>
        </figure>
      </div>

      {lit && (
        <div
          className={styles.lightbox}
          role="dialog"
          aria-modal="true"
          aria-label={lit.caption}
          onClick={close}
        >
          <button
            className={styles.lbClose}
            type="button"
            onClick={close}
            aria-label="Close"
          >
            ×
          </button>
          <button
            className={`${styles.lbNav} ${styles.lbPrev}`}
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              stepLightbox(-1);
            }}
            aria-label="Previous photo"
          >
            ‹
          </button>

          <figure className={styles.lbInner} onClick={(e) => e.stopPropagation()}>
            <div className={styles.lbImgWrap}>
              <Image
                className={styles.lbImg}
                src={lit.src}
                alt={lit.caption}
                fill
                sizes="92vw"
                priority
              />
            </div>
            <figcaption className={styles.lbCaption}>{lit.caption}</figcaption>
          </figure>

          <button
            className={`${styles.lbNav} ${styles.lbNext}`}
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              stepLightbox(1);
            }}
            aria-label="Next photo"
          >
            ›
          </button>
        </div>
      )}
    </>
  );
}
