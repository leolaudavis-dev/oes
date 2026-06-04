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
  flipX?: boolean;
  initialRotation?: number;
  unoptimized?: boolean;
};

// Shared across all Monday stickers: the most recently grabbed sticker stacks
// on top of the others.
const BASE_Z = 500;
let topZ = BASE_Z;

type DragState = { mode: "move" | "rotate" | "resize"; dx?: number; dy?: number };

export default function DraggableSticker({
  src,
  alt,
  width,
  height,
  storageKey,
  initial,
  flipX,
  initialRotation = 0,
  unoptimized,
}: Props) {
  const [pos, setPos] = useState(initial);
  const [scale, setScale] = useState(1);
  const [rotation, setRotation] = useState(initialRotation);
  const [z, setZ] = useState(BASE_Z);
  const [ready, setReady] = useState(false);
  const [selected, setSelected] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const drag = useRef<DragState | null>(null);

  // Restore saved position / scale / rotation / stacking order.
  useEffect(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        const p = JSON.parse(saved);
        if (typeof p?.x === "number" && typeof p?.y === "number")
          setPos({ x: p.x, y: p.y });
        if (typeof p?.scale === "number") setScale(p.scale);
        if (typeof p?.rotation === "number") setRotation(p.rotation);
        if (typeof p?.z === "number") {
          setZ(p.z);
          topZ = Math.max(topZ, p.z);
        }
      }
    } catch {}
    setReady(true);
  }, [storageKey]);

  // Persist everything whenever it changes.
  useEffect(() => {
    if (!ready) return;
    try {
      localStorage.setItem(
        storageKey,
        JSON.stringify({ ...pos, z, scale, rotation })
      );
    } catch {}
  }, [pos, z, scale, rotation, ready, storageKey]);

  // Click outside to deselect (hides the handles).
  useEffect(() => {
    function onDocDown(e: PointerEvent) {
      if (rootRef.current && !rootRef.current.contains(e.target as Node))
        setSelected(false);
    }
    document.addEventListener("pointerdown", onDocDown);
    return () => document.removeEventListener("pointerdown", onDocDown);
  }, []);

  function bringToFront() {
    topZ += 1;
    setZ(topZ);
  }

  function startMove(e: React.PointerEvent) {
    setSelected(true);
    bringToFront();
    const cur = pos ?? initial;
    drag.current = { mode: "move", dx: e.clientX - cur.x, dy: e.clientY - cur.y };
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
  }
  function startRotate(e: React.PointerEvent) {
    e.stopPropagation();
    bringToFront();
    drag.current = { mode: "rotate" };
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
  }
  function startResize(e: React.PointerEvent) {
    e.stopPropagation();
    bringToFront();
    drag.current = { mode: "resize" };
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
  }
  function onMove(e: React.PointerEvent) {
    const d = drag.current;
    if (!d) return;
    const cur = pos ?? initial;
    // The sticker's center stays fixed under rotate/scale (transform-origin center).
    const cx = cur.x + width / 2;
    const cy = cur.y + height / 2;
    if (d.mode === "move") {
      setPos({ x: e.clientX - (d.dx ?? 0), y: e.clientY - (d.dy ?? 0) });
    } else if (d.mode === "rotate") {
      setRotation((Math.atan2(e.clientY - cy, e.clientX - cx) * 180) / Math.PI + 90);
    } else if (d.mode === "resize") {
      const dist = Math.hypot(e.clientX - cx, e.clientY - cy);
      const base = Math.hypot(width / 2, height / 2);
      setScale(Math.max(0.3, Math.min(4, dist / base)));
    }
  }
  function onUp(e: React.PointerEvent) {
    if (!drag.current) return;
    drag.current = null;
    try {
      (e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId);
    } catch {}
  }

  const p = pos ?? initial;
  const transform = `rotate(${rotation}deg) scale(${scale})${flipX ? " scaleX(-1)" : ""}`;
  const inv = 1 / scale; // keep handles a constant on-screen size

  return (
    <div
      ref={rootRef}
      className={styles.sticker}
      data-selected={selected}
      style={{
        left: p.x,
        top: p.y,
        width,
        height,
        zIndex: z,
        transform,
        visibility: ready ? "visible" : "hidden",
      }}
      onPointerDown={startMove}
      onPointerMove={onMove}
      onPointerUp={onUp}
      role="img"
      aria-label={`${alt} — drag to move, handles to resize and rotate`}
    >
      <Image
        className={styles.stickerImg}
        src={src}
        alt={alt}
        width={width}
        height={height}
        draggable={false}
        priority
        unoptimized={unoptimized}
      />
      {selected && (
        <>
          <span
            className={styles.rotateHandle}
            style={{ top: `${-32 * inv}px`, transform: `translateX(-50%) scale(${inv})` }}
            onPointerDown={startRotate}
            onPointerMove={onMove}
            onPointerUp={onUp}
            aria-hidden
          />
          <span
            className={styles.resizeHandle}
            style={{
              right: `${-9 * inv}px`,
              bottom: `${-9 * inv}px`,
              transform: `scale(${inv})`,
            }}
            onPointerDown={startResize}
            onPointerMove={onMove}
            onPointerUp={onUp}
            aria-hidden
          />
        </>
      )}
    </div>
  );
}
