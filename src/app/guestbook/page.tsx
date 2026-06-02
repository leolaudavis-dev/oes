"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { getCaretCoordinates } from "./caret";
import styles from "./guestbook.module.css";

type GuestEntry = {
  id: string;
  name: string;
  message: string;
  createdAt: string;
};

export default function GuestbookPage() {
  const [entries, setEntries] = useState<GuestEntry[]>([]);
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [writing, setWriting] = useState(false);
  const [erasing, setErasing] = useState(false);
  const [pen, setPen] = useState({ x: 0, y: 0, shown: false });
  const writeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Move the pen's nib to the text caret.
  function positionPen(el: HTMLTextAreaElement | HTMLInputElement) {
    const rect = el.getBoundingClientRect();
    const caret = getCaretCoordinates(el, el.selectionEnd ?? el.value.length);
    const x = rect.left + caret.left - el.scrollLeft;
    const y = rect.top + caret.top - el.scrollTop;
    setPen({ x, y, shown: true });
  }

  // Flag "writing" or "erasing" (flips the pen) for the duration of activity.
  function setActivity(mode: "write" | "erase") {
    setWriting(mode === "write");
    setErasing(mode === "erase");
    if (writeTimer.current) clearTimeout(writeTimer.current);
    writeTimer.current = setTimeout(() => {
      setWriting(false);
      setErasing(false);
    }, 400);
  }

  // onChange fires for both typing and deletion — compare lengths to tell apart.
  function handleChange(
    el: HTMLTextAreaElement | HTMLInputElement,
    prevValue: string
  ) {
    positionPen(el);
    setActivity(el.value.length < prevValue.length ? "erase" : "write");
  }

  useEffect(() => {
    return () => {
      if (writeTimer.current) clearTimeout(writeTimer.current);
    };
  }, []);

  useEffect(() => {
    let active = true;
    fetch("/api/guestbook")
      .then((res) => res.json())
      .then((data) => {
        if (active) setEntries(data.entries ?? []);
      })
      .catch(() => {
        if (active) setError("Could not load the guestbook.");
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (!message.trim() || submitting) return;
    setSubmitting(true);
    setError(null);

    try {
      const res = await fetch("/api/guestbook", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, message }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error ?? "Something went wrong.");
      }
      const { entry } = await res.json();
      setEntries((prev) => [entry, ...prev]);
      setName("");
      setMessage("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setSubmitting(false);
    }
  }

  function formatDate(iso: string) {
    const d = new Date(iso);
    return d.toLocaleDateString(undefined, {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  }

  return (
    <div className={styles.page}>
      {/* Monster pen — its nib hovers at the caret and wiggles as you write */}
      <div
        className={styles.pen}
        data-writing={writing}
        data-erasing={erasing}
        data-shown={pen.shown}
        style={{ left: pen.x, top: pen.y }}
        aria-hidden
      >
        <div className={styles.penInner}>
          <Image
            src="/monsterpen2.png"
            alt=""
            width={150}
            height={107}
            priority
          />
        </div>
      </div>

      <header className={styles.header}>
        <Link href="/" className={styles.back}>
          ← back to scrapbook
        </Link>
        <h1 className={styles.title}>Guestbook</h1>
        <p className={styles.subtitle}>~ sign your name & leave a note ♡ ~</p>
      </header>

      <form className={styles.form} onSubmit={handleSubmit}>
        <span className={styles.tape} aria-hidden />
        <label className={styles.field}>
          <span className={styles.label}>your name</span>
          <input
            className={styles.input}
            type="text"
            value={name}
            maxLength={60}
            placeholder="anonymous"
            onChange={(e) => {
              const prev = name;
              setName(e.target.value);
              handleChange(e.currentTarget, prev);
            }}
            onFocus={(e) => positionPen(e.currentTarget)}
            onClick={(e) => positionPen(e.currentTarget)}
            onKeyUp={(e) => positionPen(e.currentTarget)}
            onBlur={() => setPen((p) => ({ ...p, shown: false }))}
          />
        </label>
        <label className={styles.field}>
          <span className={styles.label}>your message</span>
          <textarea
            className={styles.textarea}
            value={message}
            maxLength={500}
            rows={3}
            placeholder="say hi!"
            onChange={(e) => {
              const prev = message;
              setMessage(e.target.value);
              handleChange(e.currentTarget, prev);
            }}
            onFocus={(e) => positionPen(e.currentTarget)}
            onClick={(e) => positionPen(e.currentTarget)}
            onKeyUp={(e) => positionPen(e.currentTarget)}
            onScroll={(e) => positionPen(e.currentTarget)}
            onBlur={() => setPen((p) => ({ ...p, shown: false }))}
            required
          />
        </label>
        {error && <p className={styles.error}>{error}</p>}
        <button
          className={styles.submit}
          type="submit"
          disabled={submitting || !message.trim()}
        >
          {submitting ? "signing…" : "sign the guestbook ♡"}
        </button>
      </form>

      <div className={styles.entries}>
        {loading ? (
          <p className={styles.empty}>loading entries…</p>
        ) : entries.length === 0 ? (
          <p className={styles.empty}>
            no entries yet — be the first to sign! ✿
          </p>
        ) : (
          entries.map((entry, i) => (
            <figure
              key={entry.id}
              className={styles.entry}
              data-tilt={i % 2 === 0 ? "left" : "right"}
            >
              <span className={styles.pin} aria-hidden />
              <blockquote className={styles.message}>{entry.message}</blockquote>
              <figcaption className={styles.meta}>
                — {entry.name}
                <span className={styles.date}>{formatDate(entry.createdAt)}</span>
              </figcaption>
            </figure>
          ))
        )}
      </div>
    </div>
  );
}
