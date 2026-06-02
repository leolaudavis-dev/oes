"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import styles from "./DraggableSticker.module.css";

// Shared across all stickers: the highest z-index handed out so far, so the
// most recently grabbed sticker always sits on top.
const BASE_Z = 40;
let topZ = BASE_Z;

type Props = {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  /** Initial position in px from the top-left of the viewport. */
  initialX?: number;
  initialY?: number;
  rotate?: number;
  /** Fraction (0–1) of the sticker that is draggable, centered. Default 1. */
  hitScale?: number;
};

export default function DraggableSticker({
  src,
  alt,
  width = 160,
  height = 160,
  initialX = 120,
  initialY = 160,
  rotate = -8,
  hitScale = 1,
}: Props) {
  const [pos, setPos] = useState({ x: initialX, y: initialY });
  const [z, setZ] = useState(BASE_Z);
  const [dragging, setDragging] = useState(false);
  const offset = useRef({ x: 0, y: 0 });
  const storageKey = `sticker-pos:${src}`;

  // Restore a saved position + stacking order on mount (client-only).
  useEffect(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (typeof parsed?.x === "number" && typeof parsed?.y === "number") {
          setPos({ x: parsed.x, y: parsed.y });
        }
        if (typeof parsed?.z === "number") {
          setZ(parsed.z);
          topZ = Math.max(topZ, parsed.z);
        }
      }
    } catch {
      // ignore unavailable/corrupt storage
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Bring this sticker to the front of the stack.
  function bringToFront() {
    topZ += 1;
    setZ(topZ);
    return topZ;
  }

  function handlePointerDown(e: React.PointerEvent) {
    e.preventDefault();
    bringToFront();
    // Track positions in page (document) coordinates so scroll doesn't drift.
    offset.current = {
      x: e.clientX + window.scrollX - pos.x,
      y: e.clientY + window.scrollY - pos.y,
    };
    setDragging(true);
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  }

  function handlePointerMove(e: React.PointerEvent) {
    if (!dragging) return;
    setPos({
      x: e.clientX + window.scrollX - offset.current.x,
      y: e.clientY + window.scrollY - offset.current.y,
    });
  }

  function handlePointerUp(e: React.PointerEvent) {
    setDragging(false);
    (e.target as HTMLElement).releasePointerCapture(e.pointerId);
    try {
      localStorage.setItem(storageKey, JSON.stringify({ ...pos, z }));
    } catch {
      // ignore unavailable storage
    }
  }

  return (
    <div
      className={styles.sticker}
      data-dragging={dragging}
      style={{
        left: pos.x,
        top: pos.y,
        width,
        zIndex: z,
        transform: `rotate(${rotate}deg)`,
      }}
      role="img"
      aria-label={alt}
    >
      <Image
        className={styles.img}
        src={src}
        alt={alt}
        width={width}
        height={height}
        draggable={false}
        priority
      />
      <div
        className={styles.hit}
        style={{ width: width * hitScale, height: height * hitScale }}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        aria-hidden
      />
    </div>
  );
}
