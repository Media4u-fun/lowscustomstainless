"use client";

import { useEffect, useRef, useState, useCallback } from "react";

interface Spark {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  size: number;
  brightness: number;
}

export default function WeldingText() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [animationDone, setAnimationDone] = useState(false);
  const animFrameRef = useRef<number>(0);

  const animate = useCallback(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) {
      setAnimationDone(true);
      return;
    }

    const dpr = window.devicePixelRatio || 1;
    const rect = container.getBoundingClientRect();
    const W = rect.width;
    const H = rect.height;
    canvas.width = W * dpr;
    canvas.height = H * dpr;
    canvas.style.width = `${W}px`;
    canvas.style.height = `${H}px`;
    ctx.scale(dpr, dpr);

    const vw = window.innerWidth / 100;
    const mainSize = Math.min(Math.max(48, 8 * vw), 96);
    const font = `900 ${mainSize}px "Inter", "Helvetica Neue", Arial, sans-serif`;
    const centerX = W / 2;

    // Get text edge pixels via offscreen canvas (centered)
    function getTextPixels(
      text: string,
      fontSize: number,
      color: string,
      yOffset: number
    ): { x: number; y: number }[] {
      const offCanvas = document.createElement("canvas");
      offCanvas.width = W * dpr;
      offCanvas.height = H * dpr;
      const offCtx = offCanvas.getContext("2d")!;
      offCtx.scale(dpr, dpr);
      offCtx.font = `900 ${fontSize}px "Inter", "Helvetica Neue", Arial, sans-serif`;
      offCtx.letterSpacing = "-2px";
      offCtx.textAlign = "center";
      offCtx.textBaseline = "top";
      offCtx.fillStyle = color;
      offCtx.fillText(text, centerX, yOffset);

      const imgData = offCtx.getImageData(0, 0, offCanvas.width, offCanvas.height);
      const pixels: { x: number; y: number }[] = [];
      const step = Math.max(1, Math.round(2 * dpr));

      for (let y = 0; y < offCanvas.height; y += step) {
        for (let x = 0; x < offCanvas.width; x += step) {
          const i = (y * offCanvas.width + x) * 4;
          if (imgData.data[i + 3] > 128) {
            let isEdge = false;
            for (const [dx, dy] of [[-step, 0], [step, 0], [0, -step], [0, step]]) {
              const nx = x + dx;
              const ny = y + dy;
              if (nx < 0 || ny < 0 || nx >= offCanvas.width || ny >= offCanvas.height) {
                isEdge = true;
                break;
              }
              const ni = (ny * offCanvas.width + nx) * 4;
              if (imgData.data[ni + 3] <= 128) {
                isEdge = true;
                break;
              }
            }
            if (isEdge) {
              pixels.push({ x: x / dpr, y: y / dpr });
            }
          }
        }
      }
      return pixels;
    }

    const line1Y = 0;
    const line2Y = mainSize * 1.0;

    const edgePixels1 = getTextPixels("LOW'S CUSTOM", mainSize, "#fff", line1Y);
    const edgePixels2 = getTextPixels("STAINLESS", mainSize, "#8a8a8a", line2Y);

    // Sort edge pixels left-to-right
    edgePixels1.sort((a, b) => a.x - b.x || a.y - b.y);
    edgePixels2.sort((a, b) => a.x - b.x || a.y - b.y);

    function buildPath(pixels: { x: number; y: number }[]): { x: number; y: number }[] {
      if (pixels.length === 0) return [];
      const cols = new Map<number, { x: number; y: number }[]>();
      for (const p of pixels) {
        const col = Math.round(p.x);
        if (!cols.has(col)) cols.set(col, []);
        cols.get(col)!.push(p);
      }
      const sorted = [...cols.entries()].sort((a, b) => a[0] - b[0]);
      const path: { x: number; y: number }[] = [];
      for (const [, group] of sorted) {
        const mid = group[Math.floor(group.length / 2)];
        path.push(mid);
      }
      return path;
    }

    const path1 = buildPath(edgePixels1);
    const path2 = buildPath(edgePixels2);
    const allPaths = [...path1, ...path2];

    if (allPaths.length === 0) {
      setAnimationDone(true);
      return;
    }

    const DURATION = 3000;
    const sparks: Spark[] = [];
    let startTime: number | null = null;
    const revealCanvas = document.createElement("canvas");
    revealCanvas.width = W * dpr;
    revealCanvas.height = H * dpr;
    const revealCtx = revealCanvas.getContext("2d")!;
    revealCtx.scale(dpr, dpr);

    function spawnSparks(x: number, y: number, count: number) {
      for (let i = 0; i < count; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = 1 + Math.random() * 4;
        const life = 15 + Math.random() * 25;
        sparks.push({
          x, y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed - Math.random() * 2,
          life, maxLife: life,
          size: 0.5 + Math.random() * 2,
          brightness: 0.5 + Math.random() * 0.5,
        });
      }
    }

    function updateSparks() {
      for (let i = sparks.length - 1; i >= 0; i--) {
        const s = sparks[i];
        s.x += s.vx;
        s.y += s.vy;
        s.vy += 0.15;
        s.life--;
        if (s.life <= 0) sparks.splice(i, 1);
      }
    }

    function drawSparks(c: CanvasRenderingContext2D) {
      for (const s of sparks) {
        const alpha = (s.life / s.maxLife) * s.brightness;
        const t = 1 - s.life / s.maxLife;
        let r: number, g: number, b: number;
        if (t < 0.2) { r = 255; g = 255; b = 255; }
        else if (t < 0.5) { r = 255; g = 200 - t * 100; b = 80 - t * 80; }
        else { r = 200; g = 150 - t * 100; b = 0; }
        c.globalAlpha = alpha;
        c.fillStyle = `rgb(${r},${Math.max(0, g)},${Math.max(0, b)})`;
        c.shadowColor = `rgba(255, 170, 0, ${alpha * 0.5})`;
        c.shadowBlur = s.size * 3;
        c.beginPath();
        c.arc(s.x, s.y, s.size * (s.life / s.maxLife), 0, Math.PI * 2);
        c.fill();
      }
      c.shadowBlur = 0;
      c.globalAlpha = 1;
    }

    function frame(timestamp: number) {
      if (!ctx) return;
      if (!startTime) startTime = timestamp;
      const elapsed = timestamp - startTime;
      const progress = Math.min(elapsed / DURATION, 1);

      ctx.clearRect(0, 0, W, H);

      const totalIdx = Math.floor(progress * allPaths.length);
      const currentPoint = allPaths[Math.min(totalIdx, allPaths.length - 1)];

      revealCtx.clearRect(0, 0, W, H);

      // Line 1 reveal
      const line1Progress = path1.length > 0 ? Math.min(totalIdx / path1.length, 1) : 1;
      if (line1Progress > 0) {
        const revealX1 = line1Progress >= 1 ? W : path1[Math.min(Math.floor(line1Progress * path1.length), path1.length - 1)].x + 20;
        revealCtx.save();
        revealCtx.beginPath();
        revealCtx.rect(0, 0, revealX1, mainSize * 1.1);
        revealCtx.clip();
        revealCtx.font = font;
        revealCtx.letterSpacing = "-2px";
        revealCtx.textAlign = "center";
        revealCtx.textBaseline = "top";
        revealCtx.fillStyle = "#ffffff";
        revealCtx.fillText("LOW'S CUSTOM", centerX, line1Y);
        revealCtx.restore();
      }

      // Line 2 reveal
      const line2StartIdx = path1.length;
      const line2Progress = totalIdx > line2StartIdx
        ? Math.min((totalIdx - line2StartIdx) / Math.max(path2.length, 1), 1)
        : 0;
      if (line2Progress > 0) {
        const revealX2 = line2Progress >= 1 ? W : path2[Math.min(Math.floor(line2Progress * path2.length), path2.length - 1)].x + 20;
        revealCtx.save();
        revealCtx.beginPath();
        revealCtx.rect(0, mainSize * 0.95, revealX2, mainSize * 1.2);
        revealCtx.clip();
        revealCtx.font = font;
        revealCtx.letterSpacing = "-2px";
        revealCtx.textAlign = "center";
        revealCtx.textBaseline = "top";
        revealCtx.fillStyle = "#8a8a8a";
        revealCtx.fillText("STAINLESS", centerX, line2Y);
        revealCtx.restore();
      }

      ctx.drawImage(revealCanvas, 0, 0, W * dpr, H * dpr, 0, 0, W, H);

      if (progress < 1) {
        const flash = Math.random() > 0.7 ? 1.5 : 1;
        const glowRadius = (15 + Math.random() * 10) * flash;
        const gradient = ctx.createRadialGradient(
          currentPoint.x, currentPoint.y, 0,
          currentPoint.x, currentPoint.y, glowRadius
        );
        gradient.addColorStop(0, `rgba(255, 255, 255, ${0.9 * flash})`);
        gradient.addColorStop(0.3, `rgba(200, 169, 81, ${0.4 * flash})`);
        gradient.addColorStop(1, "rgba(255, 170, 0, 0)");

        ctx.globalCompositeOperation = "lighter";
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(currentPoint.x, currentPoint.y, glowRadius, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = "#fff";
        ctx.shadowColor = "#fff";
        ctx.shadowBlur = 20;
        ctx.beginPath();
        ctx.arc(currentPoint.x, currentPoint.y, 3, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;

        spawnSparks(currentPoint.x, currentPoint.y, 5 + Math.floor(Math.random() * 10));
        drawSparks(ctx);
        ctx.globalCompositeOperation = "source-over";
      }

      updateSparks();

      if (progress >= 1 && sparks.length === 0) {
        setAnimationDone(true);
        return;
      }

      animFrameRef.current = requestAnimationFrame(frame);
    }

    animFrameRef.current = requestAnimationFrame(frame);
  }, []);

  useEffect(() => {
    animate();
    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [animate]);

  useEffect(() => {
    const handleResize = () => {
      setAnimationDone(false);
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
      setTimeout(() => animate(), 100);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [animate]);

  return (
    <div
      ref={containerRef}
      style={{
        position: "relative",
        minHeight: `calc(clamp(48px, 8vw, 96px) * 2.2)`,
        marginBottom: "24px",
        textAlign: "center",
      }}
    >
      {!animationDone && (
        <canvas
          ref={canvasRef}
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
          }}
        />
      )}

      <h1
        style={{
          fontSize: `clamp(48px, 8vw, 96px)`,
          fontWeight: 900,
          lineHeight: 1,
          letterSpacing: "-2px",
          margin: 0,
          color: "#fff",
          textAlign: "center",
          opacity: animationDone ? 1 : 0,
          transition: "opacity 0.3s ease",
        }}
      >
        LOW&apos;S CUSTOM
        <br />
        <span style={{ color: "#8a8a8a" }}>STAINLESS</span>
      </h1>
    </div>
  );
}
