"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import styles from "./friday.module.css";

const NAMES = ["amelia", "alexa", "Blue Shades", "isaiah", "miles", "nora"];

// Names that lead to their own page.
const NAME_ROUTES: Record<string, string> = {
  "Blue Shades": "/blue-shades",
  miles: "/miles",
  isaiah: "/isaiah",
};

export default function NameMenu() {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<string | null>(null);
  const ref = useRef<HTMLDivElement>(null);
  const router = useRouter();

  // Close on outside click or Escape.
  useEffect(() => {
    if (!open) return;
    function onPointer(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", onPointer);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onPointer);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div className={styles.menuWrap} ref={ref}>
      <button
        type="button"
        className={styles.menuTrigger}
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={() => setOpen((o) => !o)}
      >
        <span>{selected ?? "select a name"}</span>
        <span className={styles.menuChevron} data-open={open} aria-hidden>
          ▾
        </span>
      </button>

      {open && (
        <ul className={styles.menuList} role="listbox">
          {NAMES.map((name) => (
            <li key={name}>
              <button
                type="button"
                role="option"
                aria-selected={selected === name}
                className={styles.menuItem}
                data-selected={selected === name}
                onClick={() => {
                  setOpen(false);
                  const route = NAME_ROUTES[name];
                  if (route) {
                    router.push(route);
                    return;
                  }
                  setSelected(name);
                }}
              >
                {name}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
