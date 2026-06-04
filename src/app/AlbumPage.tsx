"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import styles from "./AlbumPage.module.css";

export type AlbumTrack = { title: string; file: string };

type Props = {
  artist: string;
  album: string;
  tracks: AlbumTrack[];
  accent?: string;
  cover?: string;
  released?: string;
  about?: string;
  bio?: string;
  tags?: string[];
  audioBase?: string;
  infoAudio?: string;
  infoAudioLabel?: string;
};

function fmt(s?: number) {
  if (s == null || !isFinite(s)) return "--:--";
  const m = Math.floor(s / 60);
  const sec = Math.floor(s % 60);
  return `${m}:${sec.toString().padStart(2, "0")}`;
}

export default function AlbumPage({
  artist,
  album,
  tracks,
  accent = "#1ea0c3",
  cover,
  released,
  about,
  bio,
  tags = [],
  audioBase = "/friday/",
  infoAudio,
  infoAudioLabel,
}: Props) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [current, setCurrent] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [time, setTime] = useState(0);
  const [durations, setDurations] = useState<Record<number, number>>({});
  const [tabOpen, setTabOpen] = useState(false);

  const srcFor = (t: AlbumTrack) => `${audioBase}${encodeURIComponent(t.file)}`;

  // Preload metadata so the tracklist can show durations.
  useEffect(() => {
    tracks.forEach((t, i) => {
      const a = new Audio();
      a.preload = "metadata";
      a.src = srcFor(t);
      a.onloadedmetadata = () =>
        setDurations((d) => ({ ...d, [i]: a.duration }));
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Reflect play state onto the <audio> element when track/playing changes.
  useEffect(() => {
    const a = audioRef.current;
    if (!a) return;
    if (playing) a.play().catch(() => setPlaying(false));
    else a.pause();
  }, [playing, current]);

  function selectTrack(i: number) {
    if (i === current) setPlaying((p) => !p);
    else {
      setCurrent(i);
      setTime(0);
      setPlaying(true);
    }
  }

  function onEnded() {
    if (current < tracks.length - 1) {
      setCurrent(current + 1);
      setTime(0);
      setPlaying(true);
    } else setPlaying(false);
  }

  // Download every track in the album (staggered so the browser allows them).
  function downloadAll() {
    tracks.forEach((t, i) => {
      setTimeout(() => {
        const a = document.createElement("a");
        a.href = srcFor(t);
        a.download = `${t.title}.m4a`;
        document.body.appendChild(a);
        a.click();
        a.remove();
      }, i * 500);
    });
  }

  const hasTracks = tracks.length > 0;
  const dur = durations[current];
  const pct = dur ? (time / dur) * 100 : 0;
  const totalSec = tracks.reduce((sum, _t, i) => sum + (durations[i] || 0), 0);
  const totalMin = Math.round(totalSec / 60);

  return (
    <div
      className={`${styles.page} album-page`}
      style={{ ["--accent" as string]: accent } as React.CSSProperties}
    >
      <Link href="/friday" className={styles.back}>
        ← back to beat makers
      </Link>

      <div className={styles.album}>
        <div className={styles.head}>
          <h1 className={styles.albumTitle}>{album}</h1>
          <p className={styles.artist}>by {artist}</p>
        </div>

        <button
          className={styles.cover}
          type="button"
          style={
            cover
              ? {
                  backgroundImage: `url("${cover}")`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }
              : undefined
          }
          onClick={() => hasTracks && selectTrack(current)}
          aria-label={playing ? "Pause" : "Play"}
        >
          {!cover && (
            <>
              <span className={styles.coverNote} aria-hidden>
                ♪
              </span>
              <span className={styles.coverArtist} aria-hidden>
                {artist}
              </span>
            </>
          )}
        </button>

        {hasTracks ? (
          <>
            <div className={styles.player}>
              <button
                className={styles.playBtn}
                type="button"
                onClick={() => selectTrack(current)}
                aria-label={playing ? "Pause" : "Play"}
              >
                {playing ? "❚❚" : "▶"}
              </button>
              <div className={styles.progressWrap}>
                <div className={styles.nowTitle}>{tracks[current]?.title}</div>
                <div className={styles.progressBar}>
                  <div
                    className={styles.progressFill}
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>
              <div className={styles.time}>
                {fmt(time)} / {fmt(dur)}
              </div>
            </div>

            <audio
              ref={audioRef}
              src={srcFor(tracks[current])}
              onTimeUpdate={(e) => setTime(e.currentTarget.currentTime)}
              onEnded={onEnded}
              onLoadedMetadata={(e) => {
                const d = e.currentTarget.duration;
                setDurations((prev) => ({ ...prev, [current]: d }));
              }}
            />

            <ol className={styles.tracklist}>
              {tracks.map((t, i) => (
                <li
                  key={t.file}
                  className={styles.track}
                  data-active={i === current}
                  onClick={() => selectTrack(i)}
                >
                  <span className={styles.tNum}>{i + 1}</span>
                  <span className={styles.tPlay} aria-hidden>
                    {i === current && playing ? "❚❚" : "▶"}
                  </span>
                  <span className={styles.tTitle}>{t.title}</span>
                  <span className={styles.tTime}>{fmt(durations[i])}</span>
                  <a
                    className={styles.tDownload}
                    href={srcFor(t)}
                    download={`${t.title}.m4a`}
                    onClick={(e) => e.stopPropagation()}
                    aria-label={`Download ${t.title}`}
                    title="download"
                  >
                    ⬇
                  </a>
                </li>
              ))}
            </ol>
          </>
        ) : (
          <p className={styles.empty}>tracks coming soon ♡</p>
        )}

        {hasTracks && (
          <div className={styles.buyCard}>
            <button
              className={styles.downloadBtn}
              type="button"
              onClick={downloadAll}
            >
              ⬇ download {tracks.length === 1 ? "track" : "album"}
            </button>
            <p className={styles.buyMeta}>
              {tracks.length} track{tracks.length === 1 ? "" : "s"}
              {totalSec ? ` · ${totalMin} min` : ""}
            </p>
          </div>
        )}

        {(about || released || tags.length > 0) && (
          <div className={styles.about}>
            {about && <p>{about}</p>}
            {released && <p className={styles.credits}>{released}</p>}
            {tags.length > 0 && (
              <div className={styles.tags}>
                {tags.map((tag) => (
                  <span key={tag} className={styles.tag}>
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Collapsible info tab on the right edge */}
      <aside className={styles.drawer} data-open={tabOpen}>
        <button
          className={styles.drawerHandle}
          type="button"
          onClick={() => setTabOpen((o) => !o)}
          aria-expanded={tabOpen}
          aria-label={tabOpen ? "Close info" : "Open info"}
        >
          {tabOpen ? "› close" : "‹ info"}
        </button>
        <div className={styles.drawerBody}>
          <h2 className={styles.drawerTitle}>
            {bio ? "About the artist" : album}
          </h2>
          <p className={styles.drawerArtist}>by {artist}</p>
          {bio && <p className={styles.drawerBio}>{bio}</p>}
          {infoAudio && (
            <div className={styles.drawerAudioWrap}>
              <p className={styles.drawerLine}>{infoAudioLabel ?? "bonus track"}</p>
              <audio className={styles.drawerAudio} controls preload="none" src={infoAudio}>
                Your browser does not support the audio element.
              </audio>
            </div>
          )}
        </div>
      </aside>
    </div>
  );
}
