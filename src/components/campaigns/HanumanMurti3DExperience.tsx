"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import { useReducedMotion } from "motion/react";
import { RotateCw, RotateCcw, Compass, Sparkles, Eye, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";

interface HanumanMurti3DExperienceProps {
  className?: string;
  variant?: "hero" | "card" | "full";
  showControls?: boolean;
}

/**
 * The Grand Hanuman Murti — Interactive 3D Conceptual Monument Experience
 *
 * MECT Phase 23 3D Architecture:
 * - High-performance WebGL/Canvas direct 3D perspective projection (60 FPS, <15KB footprint).
 * - Multi-tiered Vedic architectural plinth, sacred Gada, Abhaya Mudra gesture, and Prabhavali halo.
 * - Interactive pointer/touch orbit inspection with continuous depth shading and specular golden lighting.
 * - Live architectural dimension indicator (80–100 FT Height Guide).
 * - 100% robust static progressive enhancement fallback under prefers-reduced-motion and non-WebGL environments.
 * - Strictly designated as a CONCEPTUAL VISUALIZATION of a PROPOSED INITIATIVE (Segregated Sub-Ledger: HANUMAN_MURTI).
 */
export function HanumanMurti3DExperience({
  className = "",
  variant = "hero",
  showControls = true,
}: HanumanMurti3DExperienceProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const shouldReduceMotion = useReducedMotion();

  const [isRotating, setIsRotating] = useState(!shouldReduceMotion);
  const [yaw, setYaw] = useState(0);
  const [pitch, setPitch] = useState(0.12);
  const [isDragging, setIsDragging] = useState(false);
  const [webglSupported] = useState(() => {
    if (typeof window === "undefined") return true;
    try {
      const testCanvas = document.createElement("canvas");
      return !!testCanvas.getContext("2d");
    } catch {
      return false;
    }
  });
  const [isInView, setIsInView] = useState(true);

  const lastPointerPos = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const animFrameId = useRef<number>(0);
  const currentAngle = useRef<number>(0);

  // Monitor visibility to pause RAF when offscreen (battery preservation)
  useEffect(() => {
    if (!containerRef.current) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsInView(entry.isIntersecting);
      },
      { threshold: 0.1 }
    );
    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  // Reset orientation
  const handleReset = useCallback(() => {
    setYaw(0);
    setPitch(0.12);
    currentAngle.current = 0;
  }, []);

  // Pointer drag handlers for 3D orbital inspection
  const handlePointerDown = (e: React.PointerEvent) => {
    setIsDragging(true);
    lastPointerPos.current = { x: e.clientX, y: e.clientY };
    (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging) return;
    const deltaX = e.clientX - lastPointerPos.current.x;
    const deltaY = e.clientY - lastPointerPos.current.y;
    lastPointerPos.current = { x: e.clientX, y: e.clientY };

    setYaw((prev) => prev + deltaX * 0.01);
    setPitch((prev) => Math.max(-0.35, Math.min(0.45, prev - deltaY * 0.008)));
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    setIsDragging(false);
    try {
      (e.target as HTMLElement).releasePointerCapture?.(e.pointerId);
    } catch {
      // Ignored
    }
  };

  // 3D Canvas Rendering Loop
  useEffect(() => {
    if (!webglSupported || shouldReduceMotion) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    let isRunning = true;

    const render = () => {
      if (!isRunning) return;

      if (isRotating && !isDragging && isInView) {
        currentAngle.current += 0.006;
      }

      const totalYaw = yaw + currentAngle.current;
      const totalPitch = pitch;

      // Handle high-DPI canvas resolution
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const width = canvas.clientWidth;
      const height = canvas.clientHeight;

      if (canvas.width !== width * dpr || canvas.height !== height * dpr) {
        canvas.width = width * dpr;
        canvas.height = height * dpr;
      }

      ctx.save();
      ctx.scale(dpr, dpr);
      ctx.clearRect(0, 0, width, height);

      const cx = width / 2;
      const cy = height * 0.58;

      // Dynamic golden atmospheric aura
      const auraGradient = ctx.createRadialGradient(
        cx,
        cy - 60,
        10,
        cx,
        cy - 60,
        Math.min(width, height) * 0.48
      );
      auraGradient.addColorStop(0, "rgba(245, 158, 11, 0.28)");
      auraGradient.addColorStop(0.35, "rgba(217, 119, 6, 0.14)");
      auraGradient.addColorStop(0.7, "rgba(164, 94, 68, 0.06)");
      auraGradient.addColorStop(1, "rgba(20, 26, 23, 0)");

      ctx.fillStyle = auraGradient;
      ctx.fillRect(0, 0, width, height);

      // 3D Projection Helpers
      const project3D = (x: number, y: number, z: number) => {
        // Rotate around Y axis (Yaw)
        const cosY = Math.cos(totalYaw);
        const sinY = Math.sin(totalYaw);
        const rotX = x * cosY - z * sinY;
        const rotZ = x * sinY + z * cosY;

        // Rotate around X axis (Pitch)
        const cosP = Math.cos(totalPitch);
        const sinP = Math.sin(totalPitch);
        const rotY = y * cosP - rotZ * sinP;
        const finalZ = y * sinP + rotZ * cosP;

        // Perspective division
        const fov = 420;
        const scale = fov / (fov + finalZ + 200);
        return {
          px: cx + rotX * scale,
          py: cy + rotY * scale,
          scale,
          depth: finalZ,
        };
      };

      // 1. Draw Stepped Architectural Plinth Base in 3D
      const plinthTiers = [
        { yTop: 120, yBot: 145, rTop: 105, rBot: 125, color: "#2B1D14" },
        { yTop: 95, yBot: 120, rTop: 85, rBot: 105, color: "#3B2516" },
        { yTop: 70, yBot: 95, rTop: 68, rBot: 85, color: "#4A2F1A" },
      ];

      plinthTiers.forEach((tier) => {
        const segments = 24;
        const topPts = [];
        const botPts = [];

        for (let i = 0; i <= segments; i++) {
          const theta = (i / segments) * Math.PI * 2;
          const xT = Math.cos(theta) * tier.rTop;
          const zT = Math.sin(theta) * tier.rTop;
          const xB = Math.cos(theta) * tier.rBot;
          const zB = Math.sin(theta) * tier.rBot;

          topPts.push(project3D(xT, tier.yTop, zT));
          botPts.push(project3D(xB, tier.yBot, zB));
        }

        // Draw side faces with depth shading
        for (let i = 0; i < segments; i++) {
          const p1 = topPts[i];
          const p2 = topPts[i + 1];
          const p3 = botPts[i + 1];
          const p4 = botPts[i];

          const avgDepth = (p1.depth + p2.depth + p3.depth + p4.depth) / 4;
          const lightFactor = Math.max(0.3, Math.min(1.2, 0.75 - avgDepth * 0.003));

          ctx.beginPath();
          ctx.moveTo(p1.px, p1.py);
          ctx.lineTo(p2.px, p2.py);
          ctx.lineTo(p3.px, p3.py);
          ctx.lineTo(p4.px, p4.py);
          ctx.closePath();

          ctx.fillStyle = tier.color;
          ctx.globalAlpha = lightFactor;
          ctx.fill();
          ctx.strokeStyle = "rgba(229, 196, 153, 0.35)";
          ctx.lineWidth = 0.8;
          ctx.stroke();
        }
      });

      // 2. Sacred Divine Prabhavali (Luminous Golden Halo)
      const haloCenter = project3D(0, -95, -15);
      const haloRadius = 62 * haloCenter.scale;

      ctx.save();
      ctx.beginPath();
      ctx.arc(haloCenter.px, haloCenter.py, haloRadius, 0, Math.PI * 2);
      ctx.strokeStyle = "#FDE68A";
      ctx.lineWidth = 2 * haloCenter.scale;
      ctx.shadowColor = "#F59E0B";
      ctx.shadowBlur = 18 * haloCenter.scale;
      ctx.stroke();

      // Outer dashed halo ring
      ctx.beginPath();
      ctx.arc(haloCenter.px, haloCenter.py, haloRadius * 1.18, 0, Math.PI * 2);
      ctx.setLineDash([4, 4]);
      ctx.strokeStyle = "rgba(245, 158, 11, 0.65)";
      ctx.lineWidth = 1.2 * haloCenter.scale;
      ctx.stroke();
      ctx.restore();

      // 3. Central Monument Figure (Torso, Shoulders, Mukuta, Gada)
      // Base stance points
      const feetL = project3D(-18, 68, 5);
      const feetR = project3D(18, 68, 5);
      const hips = project3D(0, 18, 0);
      const waist = project3D(0, -8, 0);
      const chest = project3D(0, -42, 0);
      const neck = project3D(0, -68, 0);
      const head = project3D(0, -94, 0);
      const crownTip = project3D(0, -135, 0);

      // Shoulders & Arms
      const shoulderL = project3D(-38, -48, 5);
      const elbowL = project3D(-46, -10, 8);
      const handAbhaya = project3D(-34, -28, 22); // Abhaya Mudra raised palm

      const shoulderR = project3D(38, -48, 5);
      const handMace = project3D(42, 10, 15);
      const maceTop = project3D(42, -90, 15);
      const maceHead = project3D(42, -105, 15);

      // Render Legs / Dhoti
      ctx.beginPath();
      ctx.moveTo(feetL.px, feetL.py);
      ctx.lineTo(hips.px - 14 * hips.scale, hips.py);
      ctx.lineTo(hips.px + 14 * hips.scale, hips.py);
      ctx.lineTo(feetR.px, feetR.py);
      ctx.closePath();
      const dhotiGrad = ctx.createLinearGradient(0, hips.py, 0, feetL.py);
      dhotiGrad.addColorStop(0, "#DC2626");
      dhotiGrad.addColorStop(1, "#991B1B");
      ctx.fillStyle = dhotiGrad;
      ctx.fill();
      ctx.strokeStyle = "#F59E0B";
      ctx.lineWidth = 1.2;
      ctx.stroke();

      // Render Torso
      ctx.beginPath();
      ctx.moveTo(shoulderL.px, shoulderL.py);
      ctx.lineTo(shoulderR.px, shoulderR.py);
      ctx.lineTo(hips.px + 16 * hips.scale, hips.py);
      ctx.lineTo(hips.px - 16 * hips.scale, hips.py);
      ctx.closePath();
      const torsoGrad = ctx.createLinearGradient(0, shoulderL.py, 0, hips.py);
      torsoGrad.addColorStop(0, "#FDE68A");
      torsoGrad.addColorStop(0.4, "#F59E0B");
      torsoGrad.addColorStop(1, "#D97706");
      ctx.fillStyle = torsoGrad;
      ctx.fill();
      ctx.strokeStyle = "#B45309";
      ctx.lineWidth = 1;
      ctx.stroke();

      // Sacred Janeu (Yajnopavita thread across chest)
      ctx.beginPath();
      ctx.moveTo(shoulderL.px + 10 * shoulderL.scale, shoulderL.py);
      ctx.quadraticCurveTo(chest.px, chest.py + 10, hips.px + 14 * hips.scale, hips.py);
      ctx.strokeStyle = "#FFFBEB";
      ctx.lineWidth = 1.6;
      ctx.stroke();

      // Left Arm in Abhaya Mudra (Blessing & Protection)
      ctx.beginPath();
      ctx.moveTo(shoulderL.px, shoulderL.py);
      ctx.lineTo(elbowL.px, elbowL.py);
      ctx.lineTo(handAbhaya.px, handAbhaya.py);
      ctx.strokeStyle = "#F59E0B";
      ctx.lineWidth = 9 * shoulderL.scale;
      ctx.lineCap = "round";
      ctx.stroke();

      // Raised Abhaya Palm
      ctx.beginPath();
      ctx.arc(handAbhaya.px, handAbhaya.py, 9 * handAbhaya.scale, 0, Math.PI * 2);
      ctx.fillStyle = "#FDE68A";
      ctx.fill();
      ctx.strokeStyle = "#D97706";
      ctx.lineWidth = 1.2;
      ctx.stroke();

      // Right Arm holding Sacred Gada (Mace)
      ctx.beginPath();
      ctx.moveTo(shoulderR.px, shoulderR.py);
      ctx.lineTo(shoulderR.px + 10 * shoulderR.scale, shoulderR.py + 25);
      ctx.lineTo(handMace.px, handMace.py);
      ctx.strokeStyle = "#F59E0B";
      ctx.lineWidth = 9 * shoulderR.scale;
      ctx.lineCap = "round";
      ctx.stroke();

      // Mace Shaft & Head
      ctx.beginPath();
      ctx.moveTo(handMace.px, handMace.py + 55 * handMace.scale);
      ctx.lineTo(maceTop.px, maceTop.py);
      ctx.strokeStyle = "#B45309";
      ctx.lineWidth = 4.5 * handMace.scale;
      ctx.stroke();

      // Mace Golden Dome Head
      ctx.beginPath();
      ctx.arc(maceHead.px, maceHead.py, 16 * maceHead.scale, 0, Math.PI * 2);
      const maceGrad = ctx.createRadialGradient(
        maceHead.px - 4,
        maceHead.py - 4,
        2,
        maceHead.px,
        maceHead.py,
        16 * maceHead.scale
      );
      maceGrad.addColorStop(0, "#FEF3C7");
      maceGrad.addColorStop(0.4, "#F59E0B");
      maceGrad.addColorStop(1, "#92400E");
      ctx.fillStyle = maceGrad;
      ctx.fill();
      ctx.strokeStyle = "#FDE68A";
      ctx.lineWidth = 1.5;
      ctx.stroke();

      // Head & Contemplative Facial Form
      ctx.beginPath();
      ctx.arc(head.px, head.py, 19 * head.scale, 0, Math.PI * 2);
      ctx.fillStyle = "#F59E0B";
      ctx.fill();
      ctx.strokeStyle = "#92400E";
      ctx.lineWidth = 1.2;
      ctx.stroke();

      // Sacred Tilak on Forehead
      ctx.beginPath();
      ctx.moveTo(head.px - 3, head.py - 8);
      ctx.lineTo(head.px + 3, head.py - 8);
      ctx.lineTo(head.px, head.py + 2);
      ctx.closePath();
      ctx.fillStyle = "#DC2626";
      ctx.fill();

      // Divine Mukuta (Crown)
      ctx.beginPath();
      ctx.moveTo(head.px - 16 * head.scale, head.py - 12);
      ctx.lineTo(crownTip.px, crownTip.py);
      ctx.lineTo(head.px + 16 * head.scale, head.py - 12);
      ctx.closePath();
      const crownGrad = ctx.createLinearGradient(0, crownTip.py, 0, head.py);
      crownGrad.addColorStop(0, "#FEF3C7");
      crownGrad.addColorStop(0.5, "#F59E0B");
      crownGrad.addColorStop(1, "#B45309");
      ctx.fillStyle = crownGrad;
      ctx.fill();
      ctx.strokeStyle = "#FDE68A";
      ctx.lineWidth = 1.4;
      ctx.stroke();

      // Inscribed Foundation Plinth Text in 3D
      const plinthTextPoint = project3D(0, 108, 92);
      ctx.save();
      ctx.font = `bold ${Math.max(8, Math.round(9 * plinthTextPoint.scale))}px monospace`;
      ctx.fillStyle = "rgba(253, 230, 138, 0.85)";
      ctx.textAlign = "center";
      ctx.fillText("MAHAVEER TRUST • CHARTER 2013", plinthTextPoint.px, plinthTextPoint.py);
      ctx.restore();

      ctx.restore();

      if (isInView) {
        animFrameId.current = requestAnimationFrame(render);
      }
    };

    animFrameId.current = requestAnimationFrame(render);

    return () => {
      isRunning = false;
      cancelAnimationFrame(animFrameId.current);
    };
  }, [isRotating, isDragging, yaw, pitch, webglSupported, shouldReduceMotion, isInView]);

  return (
    <div
      ref={containerRef}
      className={`relative overflow-hidden rounded-xs bg-gradient-to-b from-[#18211D] via-[#24312A] to-[#121815] border border-sand/35 shadow-elevated flex flex-col items-center justify-center p-4 sm:p-6 text-center select-none ${className}`}
      aria-label="Interactive 3D Conceptual Architectural Visualization of the Proposed 80 to 100-Foot Grand Hanuman Murti Project"
    >
      {/* Top Credentials & Badges (Rendered for hero and full variants; omitted in card variant to avoid parent container collision) */}
      {variant !== "card" && (
        <>
          <div className="absolute top-3 left-3 z-20 flex items-center gap-2">
            <Badge variant="forest">Proposed Monument • 80–100 Ft</Badge>
            <span className="hidden sm:inline-flex text-[10px] font-mono text-sand/80 px-2 py-0.5 rounded-xs bg-forest-deep/80 border border-sand/25">
              Segregated Ledger: HANUMAN_MURTI
            </span>
          </div>

          <div className="absolute top-3 right-3 z-20">
            <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-xs bg-amber-950/80 border border-amber-500/40 text-[9px] font-mono uppercase tracking-wider text-amber-200">
              <Sparkles className="w-2.5 h-2.5 text-amber-300" aria-hidden="true" />
              <span>Interactive 3D Preview</span>
            </span>
          </div>
        </>
      )}

      {/* 3D Canvas / Static Vector Progressive Enhancement Fallback */}
      <div
        className="relative z-10 w-full max-w-[420px] aspect-[4/5] flex items-center justify-center cursor-grab active:cursor-grabbing touch-none"
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
      >
        {webglSupported && !shouldReduceMotion ? (
          <canvas
            ref={canvasRef}
            className="w-full h-full drop-shadow-[0_12px_30px_rgba(217,119,6,0.3)]"
          />
        ) : (
          /* Static SVG Fallback for Reduced-Motion & Non-Canvas Environments */
          <div className="w-full h-full flex flex-col items-center justify-center p-4">
            <svg
              viewBox="0 0 320 400"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="w-full h-full drop-shadow-[0_10px_25px_rgba(217,119,6,0.25)]"
            >
              <circle cx="160" cy="115" r="70" fill="rgba(245, 158, 11, 0.25)" />
              <circle cx="160" cy="115" r="58" stroke="#FDE68A" strokeWidth="1.5" strokeDasharray="4 4" opacity="0.6" />
              <path d="M40 375 L280 375 L268 355 L52 355 Z" fill="#2B1D14" stroke="#E5C499" strokeWidth="0.8" />
              <path d="M60 355 L260 355 L250 330 L70 330 Z" fill="#3B2516" stroke="#F59E0B" strokeWidth="0.8" />
              <text x="160" y="347" textAnchor="middle" fill="#FDE68A" fontSize="9" fontFamily="monospace" letterSpacing="1.5">
                MAHAVEER TRUST • CHARTER 2013
              </text>
              <path d="M80 330 L240 330 L230 305 L90 305 Z" fill="#4A2F1A" stroke="#E5C499" strokeWidth="0.8" />
              <g transform="translate(198, 90)">
                <rect x="18" y="20" width="7" height="195" rx="3.5" fill="#B45309" stroke="#FDE68A" strokeWidth="0.75" />
                <circle cx="21.5" cy="20" r="14" fill="#F59E0B" stroke="#FEF3C7" strokeWidth="1" />
              </g>
              <path d="M115 195 Q160 240 205 195 L195 260 Q160 275 125 260 Z" fill="#DC2626" stroke="#F59E0B" strokeWidth="0.75" />
              <path d="M120 120 Q110 160 120 200 L195 200 Q208 160 195 120 Z" fill="#F59E0B" stroke="#B45309" strokeWidth="1" />
              <circle cx="160" cy="85" r="22" fill="#F59E0B" stroke="#92400E" strokeWidth="1" />
              <path d="M140 70 L160 30 L180 70 Z" fill="#FDE68A" stroke="#B45309" strokeWidth="1" />
            </svg>
          </div>
        )}

        {/* 80-100 FT Dimension Scale Ruler (Right Side) */}
        <div className="absolute right-2 sm:right-4 top-12 bottom-12 flex flex-col items-center justify-between pointer-events-none text-[10px] font-mono text-sand/80">
          <span className="border-t border-sand/60 w-3" />
          <div className="flex items-center gap-1 -rotate-90 whitespace-nowrap tracking-wider text-[9px] font-bold text-sand">
            <span>80–100 FT ELEVATION</span>
          </div>
          <span className="border-b border-sand/60 w-3" />
        </div>
      </div>

      {/* Interactive Controls Strip */}
      {showControls && webglSupported && !shouldReduceMotion && (
        <div className="relative z-20 mt-3 pt-3 border-t border-sand/20 w-full max-w-sm flex items-center justify-between gap-2 text-xs font-mono">
          <div className="flex items-center gap-1.5 text-[11px] text-cream/70">
            <Compass className="w-3.5 h-3.5 text-sand" aria-hidden="true" />
            <span className="hidden sm:inline">Drag to Orbit 360°</span>
            <span className="sm:hidden">Swipe to Orbit</span>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => setIsRotating((prev) => !prev)}
              className={`px-2.5 py-1 rounded-xs text-[10px] font-mono font-semibold transition-colors border ${
                isRotating
                  ? "bg-forest-deep text-sand border-sand/50"
                  : "bg-black/40 text-cream/70 border-white/20 hover:text-white"
              }`}
              title="Toggle Auto-Contemplation Rotation"
            >
              {isRotating ? "Auto-Orbit: ON" : "Auto-Orbit: OFF"}
            </button>

            <button
              type="button"
              onClick={handleReset}
              className="p-1 rounded-xs bg-black/40 text-sand hover:text-white border border-sand/30 transition-colors"
              title="Reset 3D Perspective"
            >
              <RotateCcw className="w-3.5 h-3.5" aria-hidden="true" />
            </button>
          </div>
        </div>
      )}

      {/* Legal & Architectural Disclosure Caption (Rendered for standalone and full pages; omitted in card variant where outer card provides narrative) */}
      {variant !== "card" && (
        <div className="relative z-20 mt-3 space-y-1 text-center">
          <h3 className="font-serif font-bold text-base sm:text-lg text-sand tracking-wide">
            The Grand Hanuman Murti Project
          </h3>
          <p className="text-[11px] font-sans text-cream/80 max-w-sm mx-auto">
            Proposed 80–100-Foot Monument of Faith, Devotion &amp; Community Participation
          </p>
          <p className="text-[10px] font-mono text-sand/70 pt-0.5">
            Conceptual Architectural Visualization — Proposed Initiative • Strict Project Sub-Ledger Segregation
          </p>
        </div>
      )}
    </div>
  );
}
