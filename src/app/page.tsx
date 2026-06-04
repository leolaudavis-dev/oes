"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import DraggableSticker from "./DraggableSticker";
import styles from "./page.module.css";

// Days that have their own scrapbook page.
const DAY_ROUTES: Record<string, string> = {
  "Stickers, oh my!": "/monday",
  "Skating!": "/skating",
  "Digital Design": "/thursday",
  "Beat Makers": "/friday",
  Guestbook: "/guestbook",
};

const WEEKDAYS = [
  "Stickers, oh my!",
  "Skating!",
  "Digital Design",
  "Beat Makers",
  "Guestbook",
];

// Frutiger Aero floating bubbles — fixed positions so SSR/CSR markup matches.
const BUBBLES = [
  { left: "6%", size: "46px", duration: "13s", delay: "0s" },
  { left: "18%", size: "26px", duration: "10s", delay: "2.5s" },
  { left: "33%", size: "62px", duration: "16s", delay: "1s" },
  { left: "47%", size: "34px", duration: "11s", delay: "4s" },
  { left: "61%", size: "52px", duration: "15s", delay: "0.5s" },
  { left: "74%", size: "22px", duration: "9s", delay: "3s" },
  { left: "86%", size: "44px", duration: "14s", delay: "1.8s" },
  { left: "93%", size: "30px", duration: "12s", delay: "5s" },
];

export default function Home() {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<string | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  // Close the menu when clicking outside or pressing Escape.
  useEffect(() => {
    if (!open) return;

    function handlePointer(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    function handleKey(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }

    document.addEventListener("mousedown", handlePointer);
    document.addEventListener("keydown", handleKey);
    return () => {
      document.removeEventListener("mousedown", handlePointer);
      document.removeEventListener("keydown", handleKey);
    };
  }, [open]);

  return (
    <div className={styles.page}>
      {/* Drag me around! */}
      <DraggableSticker
        src="/oes-glitter2.png"
        alt="OES Athletics"
        width={765}
        height={546}
        initialX={260}
        initialY={150}
        rotate={-8}
        hitScale={0.5}
      />

      {/* Scattered cutesy stickers — drag them anywhere */}
      <DraggableSticker src="/stickers/button.png" alt="flower button" width={86} height={84} initialX={1080} initialY={110} rotate={10} />
      <DraggableSticker src="/stickers/headphones.png" alt="butterfly headphones" width={150} height={107} initialX={1190} initialY={250} rotate={6} />
      <DraggableSticker src="/stickers/camera.png" alt="pastel camera" width={124} height={100} initialX={1210} initialY={520} rotate={-7} />
      <DraggableSticker src="/stickers/auraheart.png" alt="aura heart" width={112} height={112} initialX={330} initialY={540} rotate={4} />
      <DraggableSticker src="/stickers/poodle.png" alt="poodle keychain" width={112} height={138} initialX={70} initialY={330} rotate={-9} />
      <DraggableSticker src="/stickers/fingerheart.png" alt="finger heart" width={96} height={70} initialX={110} initialY={620} rotate={8} />
      <DraggableSticker src="/stickers/cdplayer.png" alt="heart cd player" width={140} height={107} initialX={600} initialY={710} rotate={5} />
      <DraggableSticker src="/stickers/tiger.png" alt="tiger cub" width={118} height={133} initialX={1110} initialY={650} rotate={-6} />
      <DraggableSticker src="/stickers/skates.png" alt="my melody skates" width={150} height={107} initialX={720} initialY={420} rotate={7} />
      <DraggableSticker src="/stickers/desk.png" alt="school desk" width={450} height={321} initialX={430} initialY={760} rotate={-5} hitScale={0.5} />
      <DraggableSticker src="/stickers/okra.png" alt="hedgehog" width={150} height={97} initialX={900} initialY={540} rotate={4} />

      {/* Frutiger Aero bubbles drifting up the page */}
      <div className={styles.bubbles} aria-hidden>
        {BUBBLES.map((b, i) => (
          <span
            key={i}
            className={styles.bubble}
            style={{
              left: b.left,
              width: b.size,
              height: b.size,
              animationDuration: b.duration,
              animationDelay: b.delay,
            }}
          />
        ))}
      </div>

      <aside className={styles.sidebar}>
        <div className={styles.dropdown} ref={menuRef}>
          <span className={styles.tapeTab} aria-hidden />
          <p className={styles.sidebarLabel}>jump to a day ♡</p>
          <button
            type="button"
            className={styles.trigger}
            aria-haspopup="listbox"
            aria-expanded={open}
            onClick={() => setOpen((prev) => !prev)}
          >
            <span>{selected ?? "Select a day"}</span>
            <span className={styles.chevron} data-open={open} aria-hidden>
              ▾
            </span>
          </button>

          {open && (
            <ul className={styles.menu} role="listbox">
              {WEEKDAYS.map((day) => (
                <li key={day}>
                  <button
                    type="button"
                    role="option"
                    aria-selected={selected === day}
                    className={styles.item}
                    data-selected={selected === day}
                    onClick={() => {
                      setOpen(false);
                      const route = DAY_ROUTES[day];
                      if (route) {
                        router.push(route);
                        return;
                      }
                      setSelected(day);
                    }}
                  >
                    {day}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </aside>

      <main className={styles.main}>
        <header className={styles.titleBlock}>
          <span className={styles.tapeLeft} aria-hidden />
          <span className={styles.tapeRight} aria-hidden />
          <h1 className={styles.title}>My After School Scrapbook</h1>
          <p className={styles.subtitle}>~ 2025-2026 school year ~</p>
        </header>

        <div className={styles.collage}>
          <figure className={styles.polaroid} data-tilt="left">
            <div className={styles.photo} data-shade="a">
              <Image
                className={styles.photoImg}
                src="/springblooms.png"
                alt="spring blooms"
                fill
                sizes="190px"
              />
            </div>
            <figcaption>spring blooms</figcaption>
          </figure>

          <figure className={styles.polaroid} data-tilt="right">
            <div className={styles.photo} data-shade="b">
              <Image
                className={styles.photoImg}
                src="/berrysweet.png"
                alt="berry sweet"
                fill
                sizes="190px"
              />
            </div>
            <figcaption>berry sweet</figcaption>
          </figure>

          <div className={styles.sticky} data-tilt="left">
            <span className={styles.pin} aria-hidden />
            <p className={styles.stickyText}>
              {selected
                ? `today feels like a ${selected} ♡`
                : "pick a class from the tab on the left!"}
            </p>
          </div>

          <figure className={styles.polaroid} data-tilt="right">
            <div className={styles.photo} data-shade="c">
              <Image
                className={styles.photoImg}
                src="/shinebright.png"
                alt="shine bright"
                fill
                sizes="190px"
              />
            </div>
            <figcaption>shine bright</figcaption>
          </figure>

          <div className={styles.ticket} data-tilt="left">
            <span className={styles.ticketStub}>★</span>
            <p>this year at a glance</p>
          </div>
        </div>

        <div className={styles.stickers} aria-hidden>
          <span className={styles.stickerHeart}>♥</span>
          <span className={styles.stickerStar}>✿</span>
          <span className={styles.stickerCloud}>☆</span>
        </div>

        {/* Frutiger Aero accent: a glossy droplet */}
        <div className={styles.aeroDroplet} aria-hidden>
          <span className={styles.aeroDropShine} />
        </div>

        <footer className={styles.footer}>
          <span className={styles.footerTape} aria-hidden />
          <Image
            className={styles.logo}
            src="/oespinklogo.png"
            alt="Oregon Episcopal School"
            width={2000}
            height={1426}
            priority
          />
        </footer>
      </main>
    </div>
  );
}
