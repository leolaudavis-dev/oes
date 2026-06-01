"use client";

import { useEffect, useRef, useState } from "react";
import styles from "./page.module.css";

const WEEKDAYS = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

export default function Home() {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<string | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);

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
      <aside className={styles.sidebar}>
        <div className={styles.dropdown} ref={menuRef}>
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
                      setSelected(day);
                      setOpen(false);
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
        <h1>Welcome</h1>
        <p>
          {selected
            ? `You selected ${selected}.`
            : "Pick a weekday from the menu on the left."}
        </p>
      </main>
    </div>
  );
}
