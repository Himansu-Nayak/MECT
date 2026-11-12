// motion: owner = Anime.js
"use client";

import React, { useEffect, useRef } from "react";
import { animate, createDrawable, createTimeline, stagger } from "animejs";
import { canAnimate, withScope } from "@/lib/anime";

export type PillarIllustrationId =
  | "education"
  | "women-empowerment"
  | "water"
  | "hunger-relief"
  | "community-welfare";

/**
 * M4.1 — Education book illustration (`createDrawable`)
 */
export function EducationBookIllustration() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || !canAnimate()) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries.some((e) => e.isIntersecting)) return;
        observer.disconnect();
        withScope(ref, () => {
          const paths = el.querySelectorAll(".edu-draw");
          if (paths.length) {
            animate(createDrawable(paths), {
              draw: ["0 0", "0 1"],
              duration: 900,
              delay: stagger(120),
              ease: "outCubic",
            });
          }
        });
      },
      { threshold: 0.3 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} aria-hidden="true" className="w-16 h-16 shrink-0">
      <svg viewBox="0 0 64 64" fill="none" className="w-full h-full">
        <path
          d="M8 16 C18 12, 28 14, 32 20 C36 14, 46 12, 56 16 L56 48 C46 44, 36 46, 32 52 C28 46, 18 44, 8 48 Z"
          stroke="#1D2924"
          strokeWidth="2.2"
          strokeLinejoin="round"
          className="edu-draw"
        />
        <path
          d="M32 20 L32 52"
          stroke="#A45E44"
          strokeWidth="2"
          strokeLinecap="round"
          className="edu-draw"
        />
        <path
          d="M14 25 L26 24 M14 33 L26 32 M38 24 L50 25 M38 32 L50 33"
          stroke="#A45E44"
          strokeWidth="1.8"
          strokeLinecap="round"
          className="edu-draw"
        />
      </svg>
    </div>
  );
}

/**
 * M4.2 — Women Empowerment stitch illustration (`createDrawable`)
 */
export function WomenStitchIllustration() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || !canAnimate()) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries.some((e) => e.isIntersecting)) return;
        observer.disconnect();
        withScope(ref, () => {
          const seam = el.querySelectorAll(".stitch-draw");
          if (seam.length) {
            animate(createDrawable(seam), {
              draw: ["0 0", "0 1"],
              duration: 1000,
              delay: stagger(100),
              ease: "outCubic",
            });
          }
        });
      },
      { threshold: 0.3 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} aria-hidden="true" className="w-16 h-16 shrink-0">
      <svg viewBox="0 0 64 64" fill="none" className="w-full h-full">
        <path
          d="M10 44 Q 24 20, 38 38 T 56 20"
          stroke="#A45E44"
          strokeWidth="2.2"
          strokeDasharray="4 4"
          strokeLinecap="round"
          className="stitch-draw"
        />
        <path
          d="M46 12 L54 20 L40 34"
          stroke="#1D2924"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="stitch-draw"
        />
        <circle cx="52" cy="14" r="2.2" fill="#A45E44" />
      </svg>
    </div>
  );
}

/**
 * M4.3 — Safe Water droplet & fill rise (`transform` scaleY + translateY)
 */
export function SafeWaterDropletIllustration() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || !canAnimate()) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries.some((e) => e.isIntersecting)) return;
        observer.disconnect();
        withScope(ref, () => {
          animate(".water-drop", {
            translateY: [-8, 0],
            opacity: [0.3, 1],
            duration: 700,
            ease: "outCubic",
          });
          animate(".water-fill", {
            scaleY: [0.25, 1],
            duration: 900,
            delay: 150,
            ease: "outCubic",
          });
        });
      },
      { threshold: 0.3 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} aria-hidden="true" className="w-16 h-16 shrink-0">
      <svg viewBox="0 0 64 64" fill="none" className="w-full h-full">
        <clipPath id="mect-droplet-clip">
          <path d="M32 10 C32 10, 16 29, 16 40 A16 16 0 0 0 48 40 C48 29, 32 10, 32 10 Z" />
        </clipPath>
        <g clipPath="url(#mect-droplet-clip)">
          <rect
            x="14"
            y="30"
            width="36"
            height="28"
            fill="#A45E44"
            fillOpacity="0.28"
            className="water-fill"
            style={{ transformOrigin: "32px 56px" }}
          />
        </g>
        <path
          d="M32 10 C32 10, 16 29, 16 40 A16 16 0 0 0 48 40 C48 29, 32 10, 32 10 Z"
          stroke="#1D2924"
          strokeWidth="2.2"
          strokeLinejoin="round"
          className="water-drop"
        />
      </svg>
    </div>
  );
}

/**
 * M4.4 — Food Security plate & steam (`stagger`)
 */
export function FoodSecurityPlateIllustration() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || !canAnimate()) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries.some((e) => e.isIntersecting)) return;
        observer.disconnect();
        withScope(ref, () => {
          animate(".steam-wisp", {
            translateY: [6, 0],
            opacity: [0.2, 1],
            duration: 650,
            delay: stagger(140),
            ease: "outCubic",
          });
        });
      },
      { threshold: 0.3 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} aria-hidden="true" className="w-16 h-16 shrink-0">
      <svg viewBox="0 0 64 64" fill="none" className="w-full h-full">
        <path
          d="M22 24 C20 19, 24 15, 22 10"
          stroke="#A45E44"
          strokeWidth="2"
          strokeLinecap="round"
          className="steam-wisp"
        />
        <path
          d="M32 22 C30 17, 34 13, 32 8"
          stroke="#A45E44"
          strokeWidth="2"
          strokeLinecap="round"
          className="steam-wisp"
        />
        <path
          d="M42 24 C40 19, 44 15, 42 10"
          stroke="#A45E44"
          strokeWidth="2"
          strokeLinecap="round"
          className="steam-wisp"
        />
        <path
          d="M12 36 A20 14 0 0 0 52 36 Z"
          stroke="#1D2924"
          strokeWidth="2.2"
          strokeLinejoin="round"
        />
        <path
          d="M18 52 L46 52"
          stroke="#1D2924"
          strokeWidth="2.2"
          strokeLinecap="round"
        />
      </svg>
    </div>
  );
}

/**
 * M4.5 — Community Welfare house outline (`createTimeline`)
 */
export function CommunityWelfareHouseIllustration() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || !canAnimate()) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries.some((e) => e.isIntersecting)) return;
        observer.disconnect();
        withScope(ref, () => {
          const roof = el.querySelector(".house-roof");
          const walls = el.querySelector(".house-walls");
          const door = el.querySelector(".house-door");
          if (!roof || !walls || !door) return;

          const tl = createTimeline({ defaults: { ease: "outCubic" } });
          tl.add(createDrawable(roof), { draw: ["0 0", "0 1"], duration: 450 })
            .add(
              createDrawable(walls),
              { draw: ["0 0", "0 1"], duration: 450 },
              "-=150"
            )
            .add(
              createDrawable(door),
              { draw: ["0 0", "0 1"], duration: 350 },
              "-=100"
            );
        });
      },
      { threshold: 0.3 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} aria-hidden="true" className="w-16 h-16 shrink-0">
      <svg viewBox="0 0 64 64" fill="none" className="w-full h-full">
        <path
          d="M10 30 L32 12 L54 30"
          stroke="#A45E44"
          strokeWidth="2.4"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="house-roof"
        />
        <path
          d="M16 28 L16 52 L48 52 L48 28"
          stroke="#1D2924"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="house-walls"
        />
        <path
          d="M27 52 L27 38 L37 38 L37 52"
          stroke="#A45E44"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="house-door"
        />
      </svg>
    </div>
  );
}

export function PillarIllustration({ id }: { id: string }) {
  switch (id) {
    case "education":
      return <EducationBookIllustration />;
    case "women-empowerment":
      return <WomenStitchIllustration />;
    case "water":
      return <SafeWaterDropletIllustration />;
    case "hunger-relief":
      return <FoodSecurityPlateIllustration />;
    default:
      return <CommunityWelfareHouseIllustration />;
  }
}

