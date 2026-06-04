"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import styles from "./DraggableSticker.module.css";

// Shared across all stickers: the highest z-index handed out so far, so the
// most recently grabbed sticker always sits on top — but capped below MAX_Z so
// stickers always stay underneath the leopard border (z-index 60).
const BASE_Z = 40;
const MAX_Z = 58;
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
  const [ready, setReady] = useState(false);
  const offset = useRef({ x: 0, y: 0 });
  // Refs mirror the latest pos/z synchronously so saving never reads a stale
  // value from a render that hasn't committed yet (e.g. a quick drag-release).
  const posRef = useRef({ x: initialX, y: initialY });
  const zRef = useRef(BASE_Z);
  const storageKey = `sticker-pos:${src}`;

  function persist() {
    try {
      localStorage.setItem(
        storageKey,
        JSON.stringify({ x: posRef.current.x, y: posRef.current.y, z: zRef.current })
      );
    } catch {
      // ignore unavailable storage
    }
  }

  // Restore a saved position + stacking order on mount (client-only).
  useEffect(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (typeof parsed?.x === "number" && typeof parsed?.y === "number") {
          posRef.current = { x: parsed.x, y: parsed.y };
          setPos({ x: parsed.x, y: parsed.y });
        }
        if (typeof parsed?.z === "number") {
          const zz = Math.min(parsed.z, MAX_Z);
          zRef.current = zz;
          setZ(zz);
          topZ = Math.min(MAX_Z, Math.max(topZ, zz));
        }
      }
    } catch {
      // ignore unavailable/corrupt storage
    }
    setReady(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Persist the moment position / stacking order changes (after the initial
  // restore), so a sticker always stays exactly where it was left.
  useEffect(() => {
    if (!ready) return;
    persist();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pos, z, ready]);

  // Bring this sticker to the front of the stack.
  function bringToFront() {
    topZ = Math.min(MAX_Z, topZ + 1);
    zRef.current = topZ;
    setZ(topZ);
    return topZ;
  }

  function handlePointerDown(e: React.PointerEvent) {
    e.preventDefault();
    bringToFront();
    // Track positions in page (document) coordinates so scroll doesn't drift.
    offset.current = {
      x: e.clientX + window.scrollX - posRef.current.x,
      y: e.clientY + window.scrollY - posRef.current.y,
    };
    setDragging(true);
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  }

  function handlePointerMove(e: React.PointerEvent) {
    if (!dragging) return;
    const next = {
      x: e.clientX + window.scrollX - offset.current.x,
      y: e.clientY + window.scrollY - offset.current.y,
    };
    posRef.current = next;
    setPos(next);
  }

  function handlePointerUp(e: React.PointerEvent) {
    setDragging(false);
    (e.target as HTMLElement).releasePointerCapture(e.pointerId);
    persist();
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
