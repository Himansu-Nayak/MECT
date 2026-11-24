"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import { useReducedMotion } from "motion/react";
import { MapPin, RotateCw, RotateCcw, Compass, Sparkles, CheckCircle2 } from "lucide-react";
import { Badge } from "@/components/ui/Badge";

export interface OperationalHub {
  id: string;
  name: string;
  category: string;
  lat: number;
  lng: number;
  telemetry: string;
  metrics: string;
  activeSince: string;
}

export const ODISHA_HUBS: OperationalHub[] = [
  {
    id: "hub-balangir",
    name: "Balangir Central Hub",
    category: "Education & Vocational",
    lat: 20.71,
    lng: 83.49,
    telemetry: "Community Learning Centre & Tailoring Training Centre",
    metrics: "350+ Student Entries • 120+ Course Enrolments",
    activeSince: "Estd. 2013",
  },
  {
    id: "hub-puintala",
    name: "Puintala Block Circle",
    category: "Remedial Coaching",
    lat: 20.82,
    lng: 83.58,
    telemetry: "Rural Foundation Learning Circles & Textbook Bank",
    metrics: "Class 8–10 Scholastic Retention",
    activeSince: "Active 2021",
  },
  {
    id: "hub-titilagarh",
    name: "Titilagarh Relief Unit",
    category: "Safe Water & Relief",
    lat: 20.30,
    lng: 83.14,
    telemetry: "Seasonal Jal Seva Kiosks & Winter Blanket Drive",
    metrics: "10,000+ Summer Relief Instances",
    activeSince: "Annual Heatwave Cycle",
  },
  {
    id: "hub-patnagarh",
    name: "Patnagarh Field Cell",
    category: "Community Welfare",
    lat: 20.72,
    lng: 82.98,
    telemetry: "Civic Entitlements Guidance & Health Awareness",
    metrics: "Legal Literacy Outreach",
    activeSince: "Community Outreach",
  },
  {
    id: "hub-bhubaneswar",
    name: "Bhubaneswar Liaison Desk",
    category: "Institutional Secretariat",
    lat: 20.29,
    lng: 85.82,
    telemetry: "Secretariat Liaison & Statutory Compliance Desk",
    metrics: "MCA CSR-1 • 12A • 80G Filings",
    activeSince: "State Capital Liaison",
  },
];

interface OdishaImpactSphere3DProps {
  className?: string;
  onSelectHub?: (hub: OperationalHub) => void;
}

/**
 * Odisha Impact & Geographical Reach Sphere (Phase 23)
 * Interactive 3D WebGL/Canvas node sphere projecting MECT's verified operational
 * footprint across Western Odisha with real-time orbital interaction and telemetry.
 */
export function OdishaImpactSphere3D({
  className = "",
  onSelectHub,
}: OdishaImpactSphere3DProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const shouldReduceMotion = useReducedMotion();

  const [activeHub, setActiveHub] = useState<OperationalHub>(ODISHA_HUBS[0]);
  const [isRotating, setIsRotating] = useState(!shouldReduceMotion);
  const [yaw, setYaw] = useState(0.4);
  const [pitch, setPitch] = useState(0.15);
  const [isDragging, setIsDragging] = useState(false);
  const [isInView, setIsInView] = useState(true);

  const lastPointerPos = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const animFrameId = useRef<number>(0);
  const currentAngle = useRef<number>(0);

  // Monitor visibility
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

    setYaw((prev) => prev + deltaX * 0.008);
    setPitch((prev) => Math.max(-0.4, Math.min(0.4, prev - deltaY * 0.008)));
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    setIsDragging(false);
    try {
      (e.target as HTMLElement).releasePointerCapture?.(e.pointerId);
    } catch {
      // Ignored
    }
  };

  // 3D Canvas Sphere Render Loop
  useEffect(() => {
    if (shouldReduceMotion) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    let isRunning = true;

    const render = () => {
      if (!isRunning) return;

      if (isRotating && !isDragging && isInView) {
        currentAngle.current += 0.005;
      }

      const totalYaw = yaw + currentAngle.current;
      const totalPitch = pitch;

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
      const cy = height / 2;
      const sphereRadius = Math.min(width, height) * 0.38;

      // 3D Sphere Projection
      const projectOnSphere = (latDeg: number, lngDeg: number) => {
        // Map Odisha region lat/lng relative to center (approx 20.5° N, 83.5° E)
        const phi = ((latDeg - 20.5) * 4 * Math.PI) / 180;
        const theta = ((lngDeg - 83.5) * 4 * Math.PI) / 180;

        const x0 = sphereRadius * Math.cos(phi) * Math.sin(theta);
        const y0 = -sphereRadius * Math.sin(phi);
        const z0 = sphereRadius * Math.cos(phi) * Math.cos(theta);

        // Rotate Yaw (Y axis)
        const cosY = Math.cos(totalYaw);
        const sinY = Math.sin(totalYaw);
        const rotX = x0 * cosY - z0 * sinY;
        const rotZ = x0 * sinY + z0 * cosY;

        // Rotate Pitch (X axis)
        const cosP = Math.cos(totalPitch);
        const sinP = Math.sin(totalPitch);
        const rotY = y0 * cosP - rotZ * sinP;
        const finalZ = y0 * sinP + rotZ * cosP;

        const fov = 380;
        const scale = fov / (fov + finalZ + 80);

        return {
          px: cx + rotX * scale,
          py: cy + rotY * scale,
          scale,
          depth: finalZ,
          visible: finalZ > -sphereRadius * 0.45,
        };
      };

      // 1. Draw Subtle Background Glow
      const glow = ctx.createRadialGradient(cx, cy, 10, cx, cy, sphereRadius * 1.15);
      glow.addColorStop(0, "rgba(229, 196, 153, 0.18)");
      glow.addColorStop(0.6, "rgba(40, 55, 48, 0.08)");
      glow.addColorStop(1, "rgba(0, 0, 0, 0)");
      ctx.fillStyle = glow;
      ctx.beginPath();
      ctx.arc(cx, cy, sphereRadius * 1.15, 0, Math.PI * 2);
      ctx.fill();

      // 2. Draw Geodesic Latitude & Longitude Wireframe Rings
      ctx.strokeStyle = "rgba(164, 94, 68, 0.22)";
      ctx.lineWidth = 1;

      // Latitude lines
      for (let lat = -60; lat <= 60; lat += 30) {
        ctx.beginPath();
        let first = true;
        for (let lng = 0; lng <= 360; lng += 15) {
          const pt = projectOnSphere(20.5 + lat * 0.2, 83.5 + lng * 0.2);
          if (first) {
            ctx.moveTo(pt.px, pt.py);
            first = false;
          } else {
            ctx.lineTo(pt.px, pt.py);
          }
        }
        ctx.stroke();
      }

      // 3. Connect Hubs with Luminous Arcs in 3D
      ctx.strokeStyle = "rgba(245, 158, 11, 0.55)";
      ctx.lineWidth = 1.5;
      ctx.setLineDash([3, 3]);

      const balangirPt = projectOnSphere(ODISHA_HUBS[0].lat, ODISHA_HUBS[0].lng);
      ODISHA_HUBS.slice(1).forEach((hub) => {
        const hubPt = projectOnSphere(hub.lat, hub.lng);
        if (balangirPt.visible || hubPt.visible) {
          ctx.beginPath();
          ctx.moveTo(balangirPt.px, balangirPt.py);
          const midX = (balangirPt.px + hubPt.px) / 2;
          const midY = (balangirPt.py + hubPt.py) / 2 - 18;
          ctx.quadraticCurveTo(midX, midY, hubPt.px, hubPt.py);
          ctx.stroke();
        }
      });
      ctx.setLineDash([]);

      // 4. Render Hub Coordinate Pins in 3D
      ODISHA_HUBS.forEach((hub) => {
        const pt = projectOnSphere(hub.lat, hub.lng);
        if (!pt.visible) return;

        const isSelected = activeHub.id === hub.id;
        const radius = (isSelected ? 7 : 4.5) * pt.scale;

        // Outer pulse circle
        if (isSelected) {
          ctx.beginPath();
          ctx.arc(pt.px, pt.py, radius * 2.2, 0, Math.PI * 2);
          ctx.fillStyle = "rgba(164, 94, 68, 0.25)";
          ctx.fill();
        }

        // Inner glowing node
        ctx.beginPath();
        ctx.arc(pt.px, pt.py, radius, 0, Math.PI * 2);
        ctx.fillStyle = isSelected ? "#A45E44" : "#283730";
        ctx.fill();
        ctx.strokeStyle = isSelected ? "#FDE68A" : "#E5C499";
        ctx.lineWidth = 1.8 * pt.scale;
        ctx.stroke();

        // Render high-contrast callout pill exclusively for the active selected hub
        // (prevents central text collision across clustered Western Odisha coordinates)
        if (isSelected) {
          const fontSize = Math.max(10, Math.round(11 * pt.scale));
          ctx.font = `bold ${fontSize}px sans-serif`;
          const textMetrics = ctx.measureText(hub.name);
          const textW = textMetrics.width;
          const padX = 8;
          const padY = 4;
          const pillX = pt.px - textW / 2 - padX;
          const pillY = pt.py - radius - 24;
          const pillW = textW + padX * 2;
          const pillH = fontSize + padY * 2;

          // Callout pill backdrop
          ctx.beginPath();
          if (typeof ctx.roundRect === "function") {
            ctx.roundRect(pillX, pillY, pillW, pillH, 3);
          } else {
            ctx.rect(pillX, pillY, pillW, pillH);
          }
          ctx.fillStyle = "rgba(255, 255, 255, 0.96)";
          ctx.fill();
          ctx.strokeStyle = "rgba(184, 93, 59, 0.8)";
          ctx.lineWidth = 1.2;
          ctx.stroke();

          // Pointer tick pointing to pin
          ctx.beginPath();
          ctx.moveTo(pt.px - 3, pillY + pillH);
          ctx.lineTo(pt.px + 3, pillY + pillH);
          ctx.lineTo(pt.px, pillY + pillH + 3.5);
          ctx.closePath();
          ctx.fillStyle = "#B85D3B";
          ctx.fill();

          // Label text
          ctx.fillStyle = "#0F1714";
          ctx.fillText(hub.name, pillX + padX, pillY + padY + fontSize - 2);
        }
      });

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
  }, [isRotating, isDragging, yaw, pitch, activeHub, shouldReduceMotion, isInView]);

  return (
    <div
      ref={containerRef}
      className={`relative rounded-xs border border-border-warm bg-white shadow-xs p-6 flex flex-col space-y-6 ${className}`}
      aria-label="3D Geographical Reach & Operational Hubs of MECT in Western Odisha"
    >
      {/* Header Info */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border-warm pb-4">
        <div>
          <div className="flex items-center gap-2">
            <Badge variant="forest">Geographical Footprint</Badge>
            <Badge variant="neutral">Western Odisha Focus</Badge>
          </div>
          <h3 className="font-serif text-xl sm:text-2xl font-bold text-forest mt-1">
            Odisha Operational Reach &amp; Community Centres
          </h3>
          <p className="text-xs text-ink-secondary font-sans mt-0.5">
            Interactive spatial mapping of established learning centres, relief hubs, and secretariat desks.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono">
          <button
            type="button"
            onClick={() => setIsRotating((p) => !p)}
            className={`px-2.5 py-1 rounded-xs text-[10px] font-semibold border transition-colors ${
              isRotating
                ? "bg-forest text-sand border-forest"
                : "bg-sand-light/50 text-forest border-border-warm hover:bg-sand-light"
            }`}
          >
            {isRotating ? "Auto-Orbit: ON" : "Auto-Orbit: OFF"}
          </button>
          <button
            type="button"
            onClick={() => {
              setYaw(0.4);
              setPitch(0.15);
              currentAngle.current = 0;
            }}
            className="p-1 rounded-xs border border-border-warm text-forest hover:bg-sand-light/60 transition-colors"
            title="Reset Perspective"
          >
            <RotateCcw className="w-3.5 h-3.5" aria-hidden="true" />
          </button>
        </div>
      </div>

      {/* Main 3D Sphere & Interactive Hub List */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
        {/* Left: 3D Geodesic Canvas (7 cols) */}
        <div
          className="lg:col-span-7 relative aspect-square max-h-[380px] w-full flex items-center justify-center cursor-grab active:cursor-grabbing touch-none rounded-xs bg-cream/30 border border-sand/30 overflow-hidden"
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
        >
          {!shouldReduceMotion ? (
            <canvas ref={canvasRef} className="w-full h-full" />
          ) : (
            <div className="text-center p-6 space-y-2 text-xs font-mono text-ink-secondary">
              <MapPin className="w-8 h-8 text-terracotta mx-auto mb-2" aria-hidden="true" />
              <p className="font-semibold text-forest">Static Map View (Reduced Motion)</p>
              <p>Balangir • Puintala • Titilagarh • Patnagarh • Bhubaneswar</p>
            </div>
          )}

          <div className="absolute bottom-2 left-2 text-[10px] font-mono text-ink-muted flex items-center gap-1">
            <Compass className="w-3 h-3 text-terracotta" aria-hidden="true" />
            <span>Drag sphere to explore operational hubs</span>
          </div>
        </div>

        {/* Right: Hub Selector & Local Telemetry (5 cols) */}
        <div className="lg:col-span-5 space-y-3">
          <div className="space-y-2">
            {ODISHA_HUBS.map((hub) => {
              const isSelected = activeHub.id === hub.id;
              return (
                <button
                  key={hub.id}
                  type="button"
                  onClick={() => {
                    setActiveHub(hub);
                    onSelectHub?.(hub);
                  }}
                  className={`w-full text-left p-3.5 rounded-xs border transition-all flex items-start justify-between gap-3 ${
                    isSelected
                      ? "bg-sand-light/60 border-terracotta shadow-xs"
                      : "bg-white border-border-warm hover:border-sand hover:bg-cream/30"
                  }`}
                >
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-1.5">
                      <MapPin
                        className={`w-3.5 h-3.5 shrink-0 ${
                          isSelected ? "text-terracotta" : "text-forest"
                        }`}
                        aria-hidden="true"
                      />
                      <span className="font-serif font-bold text-sm text-forest">
                        {hub.name}
                      </span>
                    </div>
                    <p className="text-[11px] text-ink-secondary font-sans leading-tight">
                      {hub.telemetry}
                    </p>
                    <p className="text-[10px] font-mono text-terracotta-dark font-semibold pt-0.5">
                      {hub.metrics}
                    </p>
                  </div>
                  <span className="text-[9px] font-mono text-ink-muted shrink-0 uppercase tracking-wider">
                    {hub.activeSince}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
