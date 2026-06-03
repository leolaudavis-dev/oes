"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import styles from "./monday.module.css";

type Props = {
  src: string;
  alt: string;
  width: number;
  height: number;
  storageKey: string;
  initial: { x: number; y: number };
};

export default function DraggableSticker({
  src,
  alt,
  width,
  height,
  storageKey,
  initial,
}: Props) {
  const [pos, setPos] = useState(initial);
  const [ready, setReady] = useState(false);
  const drag = useRef<{ dx: number; dy: number } | null>(null);

  // Restore the last placed position.
  useEffect(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      if (saved) setPos(JSON.parse(saved));
    } catch {}
    setReady(true);
  }, [storageKey]);

  // Persist whenever it's moved.
  useEffect(() => {
    if (!ready) return;
    try {
      localStorage.setItem(storageKey, JSON.stringify(pos));
    } catch {}
  }, [pos, ready, storageKey]);

  function onPointerDown(e: React.PointerEvent<HTMLDivElement>) {
    const rect = e.currentTarget.getBoundingClientRect();
    drag.current = { dx: e.clientX - rect.left, dy: e.clientY - rect.top };
    e.currentTarget.setPointerCapture(e.pointerId);
  }
  function onPointerMove(e: React.PointerEvent<HTMLDivElement>) {
    if (!drag.current) return;
    setPos({ x: e.clientX - drag.current.dx, y: e.clientY - drag.current.dy });
  }
  function onPointerUp(e: React.PointerEvent<HTMLDivElement>) {
    if (!drag.current) return;
    drag.current = null;
    e.currentTarget.releasePointerCapture(e.pointerId);
  }

  const p = pos ?? initial;

  return (
    <div
      className={styles.sticker}
      style={{ left: p.x, top: p.y, visibility: ready ? "visible" : "hidden" }}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      role="img"
      aria-label={`${alt} — drag to move`}
    >
      <Image
        className={styles.stickerImg}
        src={src}
        alt={alt}
        width={width}
        height={height}
        draggable={false}
        priority
      />
    </div>
  );
}
