"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/cn";
import { PauseIcon, PlayIcon } from "../icons";

type Props = {
  src: string;
  poster: string;
  /** Describes what the clip shows (there's no audio). */
  label: string;
  className?: string;
};

/**
 * Short, silent, looping clip. Loads nothing until it scrolls near the screen,
 * plays only while visible, and never autoplays for people who prefer reduced motion.
 * Always has a visible pause/play button.
 */
export function LoopVideo({ src, poster, label, className }: Props) {
  const ref = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);
  const [load, setLoad] = useState(false);
  const userPaused = useRef(false);
  const visible = useRef(false);

  useEffect(() => {
    const v = ref.current;
    if (!v) return;
    const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) userPaused.current = true;
    // Very old browsers: leave the poster up; the play button still loads the clip.
    if (!("IntersectionObserver" in window)) return;
    const near = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setLoad(true);
          near.disconnect();
        }
      },
      { rootMargin: "400px 0px" },
    );
    const seen = new IntersectionObserver(
      ([e]) => {
        visible.current = e.isIntersecting;
        if (e.isIntersecting && !userPaused.current) v.play().catch(() => {});
        if (!e.isIntersecting && !v.paused) v.pause();
      },
      { threshold: 0.35 },
    );
    near.observe(v);
    seen.observe(v);
    return () => {
      near.disconnect();
      seen.disconnect();
    };
  }, []);

  // Once the source is attached, start playing if it's already on screen.
  useEffect(() => {
    const v = ref.current;
    if (load && v && visible.current && !userPaused.current) v.play().catch(() => {});
  }, [load]);

  const toggle = () => {
    const v = ref.current;
    if (!v) return;
    if (v.paused) {
      userPaused.current = false;
      setLoad(true);
      v.play().catch(() => {});
    } else {
      userPaused.current = true;
      v.pause();
    }
  };

  return (
    <div className={cn("relative h-full w-full", className)}>
      <video
        ref={ref}
        className="absolute inset-0 h-full w-full object-cover"
        poster={poster}
        src={load ? src : undefined}
        muted
        loop
        playsInline
        preload="none"
        disablePictureInPicture
        disableRemotePlayback
        aria-label={label}
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
      />
      <button
        type="button"
        onClick={toggle}
        aria-label={playing ? "Pause video" : "Play video"}
        className="absolute right-3 bottom-3 inline-flex h-11 w-11 items-center justify-center rounded-full bg-black/55 text-white ring-1 ring-white/25 backdrop-blur-sm transition hover:bg-black/75"
      >
        {playing ? <PauseIcon size={16} /> : <PlayIcon size={16} />}
      </button>
    </div>
  );
}
