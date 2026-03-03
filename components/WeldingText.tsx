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

interface LetterRegion {
  xMin: number;
  xMax: number;
  yMin: number;
  yMax: number;
  line: number;
  path: { x: number; y: number }[];
}

const FONT_URL =
  "https://fonts.googleapis.com/css2?family=Playfair+Display:wght@900&display=swap";

function ensureFont() {
  if (typeof document === "undefined") return;
  if (document.querySelector(`link[href="${FONT_URL}"]`)) return;
  const link = document.createElement("link");
  link.rel = "stylesheet";
  link.href = FONT_URL;
  document.head.appendChild(link);
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
    const containerW = rect.width;
    const containerH = rect.height;
    // Canvas is much larger than container to catch flying sparks
    const W = window.innerWidth * 1.5;
    const H = window.innerHeight * 1.5;
    // Offset so the text area maps to the right spot
    const offsetX = window.innerWidth * 0.25;
    const offsetY = window.innerHeight * 0.5;
    canvas.width = W * dpr;
    canvas.height = H * dpr;
    canvas.style.width = `${W}px`;
    canvas.style.height = `${H}px`;
    ctx.scale(dpr, dpr);

    const vw = window.innerWidth / 100;
    const mainSize = Math.min(Math.max(48, 8 * vw), 96);
    const fontFamily = `"Playfair Display", Georgia, "Times New Roman", serif`;
    const font = `900 ${mainSize}px ${fontFamily}`;
    const centerX = offsetX + containerW / 2;
    const line1Y = offsetY;
    const line2Y = offsetY + mainSize * 1.05;

    // Measure individual character positions for each line
    function measureLetters(text: string, yOffset: number, lineIdx: number): LetterRegion[] {
      const tmpCtx = document.createElement("canvas").getContext("2d")!;
      tmpCtx.font = font;
      tmpCtx.letterSpacing = "2px";
      const fullWidth = tmpCtx.measureText(text).width;
      const startX = centerX - fullWidth / 2;

      const regions: LetterRegion[] = [];
      let curX = startX;
      for (const char of text) {
        const charW = tmpCtx.measureText(char).width;
        if (char !== " ") {
          regions.push({
            xMin: curX,
            xMax: curX + charW,
            yMin: yOffset,
            yMax: yOffset + mainSize * 1.1,
            line: lineIdx,
            path: [],
          });
        }
        curX += charW;
      }
      return regions;
    }

    // Get edge pixels for a full line of text, then assign to letter regions
    function getEdgePixelsForLine(
      text: string,
      yOffset: number,
      regions: LetterRegion[]
    ) {
      const offCanvas = document.createElement("canvas");
      offCanvas.width = W * dpr;
      offCanvas.height = H * dpr;
      const offCtx = offCanvas.getContext("2d")!;
      offCtx.scale(dpr, dpr);
      offCtx.font = font;
      offCtx.letterSpacing = "2px";
      offCtx.textAlign = "center";
      offCtx.textBaseline = "top";
      offCtx.fillStyle = "#fff";
      offCtx.fillText(text, centerX, yOffset);

      const imgData = offCtx.getImageData(0, 0, offCanvas.width, offCanvas.height);
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
              const px = x / dpr;
              const py = y / dpr;
              // Assign to correct letter region
              for (const r of regions) {
                if (px >= r.xMin - 2 && px <= r.xMax + 2 && py >= r.yMin - 2 && py <= r.yMax + 2) {
                  r.path.push({ x: px, y: py });
                  break;
                }
              }
            }
          }
        }
      }

      // Sort each letter's path: top-to-bottom, left-to-right (like writing)
      for (const r of regions) {
        r.path.sort((a, b) => {
          const colA = Math.round(a.x / 2);
          const colB = Math.round(b.x / 2);
          if (colA !== colB) return colA - colB;
          return a.y - b.y;
        });
        // Thin out to representative points
        const thinned: { x: number; y: number }[] = [];
        const cols = new Map<number, { x: number; y: number }[]>();
        for (const p of r.path) {
          const col = Math.round(p.x);
          if (!cols.has(col)) cols.set(col, []);
          cols.get(col)!.push(p);
        }
        const sortedCols = [...cols.entries()].sort((a, b) => a[0] - b[0]);
        for (const [, group] of sortedCols) {
          thinned.push(group[Math.floor(group.length / 2)]);
        }
        r.path = thinned;
      }
    }

    const letters1 = measureLetters("LOW'S CUSTOM", line1Y, 0);
    const letters2 = measureLetters("STAINLESS", line2Y, 1);
    getEdgePixelsForLine("LOW'S CUSTOM", line1Y, letters1);
    getEdgePixelsForLine("STAINLESS", line2Y, letters2);

    const allLetters = [...letters1, ...letters2].filter(l => l.path.length > 0);

    // Build a flat path with letter boundaries for the reveal system
    // Each letter gets equal time
    const totalLetters = allLetters.length;
    if (totalLetters === 0) {
      setAnimationDone(true);
      return;
    }

    // Build cumulative index map: for each letter, track start index into allPoints
    const allPoints: { x: number; y: number; letterIdx: number }[] = [];
    const letterStartIdx: number[] = [];
    for (let li = 0; li < allLetters.length; li++) {
      letterStartIdx.push(allPoints.length);
      for (const p of allLetters[li].path) {
        allPoints.push({ ...p, letterIdx: li });
      }
    }

    const DURATION = 14000; // 14 seconds — slow deliberate per letter
    const sparks: Spark[] = [];
    let startTime: number | null = null;

    // Track which letters are fully revealed
    const letterRevealed = new Array(totalLetters).fill(false);

    function spawnSparks(x: number, y: number, count: number) {
      for (let i = 0; i < count; i++) {
        const angle = Math.random() * Math.PI * 2;
        // Insane speed — sparks fly across the entire page
        const speed = 2 + Math.random() * 12;
        const life = 40 + Math.random() * 80;
        sparks.push({
          x, y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed - Math.random() * 8,
          life, maxLife: life,
          size: 1 + Math.random() * 4,
          brightness: 0.6 + Math.random() * 0.4,
        });
      }
      // Extra shower burst — downward spray like real welding
      for (let i = 0; i < Math.floor(count * 0.6); i++) {
        const angle = Math.PI * 0.3 + Math.random() * Math.PI * 0.4; // downward arc
        const speed = 3 + Math.random() * 10;
        const life = 50 + Math.random() * 70;
        sparks.push({
          x, y,
          vx: Math.cos(angle) * speed * (Math.random() > 0.5 ? 1 : -1),
          vy: Math.abs(Math.sin(angle)) * speed,
          life, maxLife: life,
          size: 0.5 + Math.random() * 3,
          brightness: 0.5 + Math.random() * 0.5,
        });
      }
      // Occasional huge bright streakers that fly far
      if (Math.random() > 0.5) {
        for (let i = 0; i < 3; i++) {
          const angle = Math.random() * Math.PI * 2;
          const speed = 8 + Math.random() * 15;
          const life = 60 + Math.random() * 100;
          sparks.push({
            x, y,
            vx: Math.cos(angle) * speed,
            vy: Math.sin(angle) * speed - Math.random() * 5,
            life, maxLife: life,
            size: 2 + Math.random() * 5,
            brightness: 0.9 + Math.random() * 0.1,
          });
        }
      }
    }

    function updateSparks() {
      for (let i = sparks.length - 1; i >= 0; i--) {
        const s = sparks[i];
        s.x += s.vx;
        s.y += s.vy;
        s.vy += 0.08; // lighter gravity so they fly further
        s.vx *= 0.995; // slight air resistance
        s.life--;
        if (s.life <= 0) sparks.splice(i, 1);
      }
    }

    function drawSparks(c: CanvasRenderingContext2D) {
      for (const s of sparks) {
        const alpha = (s.life / s.maxLife) * s.brightness;
        const t = 1 - s.life / s.maxLife;
        let r: number, g: number, b: number;
        if (t < 0.1) { r = 255; g = 255; b = 255; }
        else if (t < 0.3) { r = 255; g = 230 - t * 100; b = 120 - t * 120; }
        else if (t < 0.6) { r = 255; g = 180 - t * 150; b = 0; }
        else { r = 200; g = Math.max(0, 100 - t * 100); b = 0; }
        c.globalAlpha = alpha;
        c.fillStyle = `rgb(${r},${Math.max(0, g)},${Math.max(0, b)})`;
        c.shadowColor = `rgba(255, 170, 0, ${alpha * 0.8})`;
        c.shadowBlur = s.size * 6;
        // Draw spark with a motion trail
        const trail = Math.min(s.size * 2, 6);
        c.beginPath();
        c.moveTo(s.x - s.vx * trail * 0.3, s.y - s.vy * trail * 0.3);
        c.lineTo(s.x, s.y);
        c.lineWidth = s.size * (s.life / s.maxLife);
        c.strokeStyle = c.fillStyle;
        c.stroke();
        // Bright head
        c.beginPath();
        c.arc(s.x, s.y, s.size * (s.life / s.maxLife) * 0.8, 0, Math.PI * 2);
        c.fill();
      }
      c.shadowBlur = 0;
      c.globalAlpha = 1;
    }

    // Reveal canvas for white text
    const revealCanvas = document.createElement("canvas");
    revealCanvas.width = W * dpr;
    revealCanvas.height = H * dpr;
    const revealCtx = revealCanvas.getContext("2d")!;
    revealCtx.scale(dpr, dpr);

    function frame(timestamp: number) {
      if (!ctx) return;
      if (!startTime) startTime = timestamp;
      const elapsed = timestamp - startTime;
      const rawProgress = Math.min(elapsed / DURATION, 1);

      ctx.clearRect(0, 0, W, H);

      // Draw full text in very dark black (barely visible)
      ctx.font = font;
      ctx.letterSpacing = "2px";
      ctx.textAlign = "center";
      ctx.textBaseline = "top";
      ctx.fillStyle = "#0a0a0a";
      ctx.fillText("LOW'S CUSTOM", centerX, line1Y);
      ctx.fillText("STAINLESS", centerX, line2Y);

      // Figure out which letter we're on and progress within it
      const currentLetterFloat = rawProgress * totalLetters;
      const currentLetterIdx = Math.min(Math.floor(currentLetterFloat), totalLetters - 1);
      const withinLetterProgress = currentLetterFloat - currentLetterIdx;

      // Mark fully completed letters
      for (let i = 0; i < currentLetterIdx; i++) {
        letterRevealed[i] = true;
      }

      // Draw white text for revealed letters using per-letter clip rects
      revealCtx.clearRect(0, 0, W, H);

      for (let li = 0; li < allLetters.length; li++) {
        const letter = allLetters[li];
        let clipXMax: number;

        if (li < currentLetterIdx) {
          // Fully revealed
          clipXMax = letter.xMax + 5;
        } else if (li === currentLetterIdx) {
          // Partially revealed — clip based on progress within this letter
          const path = letter.path;
          if (path.length === 0) continue;
          const pathIdx = Math.min(Math.floor(withinLetterProgress * path.length), path.length - 1);
          clipXMax = path[pathIdx].x + 5;
        } else {
          continue; // Not yet reached
        }

        revealCtx.save();
        revealCtx.beginPath();
        revealCtx.rect(letter.xMin - 3, letter.yMin - 3, clipXMax - letter.xMin + 6, letter.yMax - letter.yMin + 6);
        revealCtx.clip();
        revealCtx.font = font;
        revealCtx.letterSpacing = "2px";
        revealCtx.textAlign = "center";
        revealCtx.textBaseline = "top";
        revealCtx.fillStyle = "#ffffff";
        if (letter.line === 0) {
          revealCtx.fillText("LOW'S CUSTOM", centerX, line1Y);
        } else {
          revealCtx.fillText("STAINLESS", centerX, line2Y);
        }
        revealCtx.restore();
      }

      ctx.drawImage(revealCanvas, 0, 0, W * dpr, H * dpr, 0, 0, W, H);

      // Weld point on current letter
      if (rawProgress < 1) {
        const letter = allLetters[currentLetterIdx];
        const path = letter.path;
        if (path.length > 0) {
          const pathIdx = Math.min(Math.floor(withinLetterProgress * path.length), path.length - 1);
          const pt = path[pathIdx];

          // MASSIVE arc welder glow
          const flash = Math.random() > 0.6 ? 2.0 : 1.2;
          const glowRadius = (25 + Math.random() * 20) * flash;
          const gradient = ctx.createRadialGradient(
            pt.x, pt.y, 0,
            pt.x, pt.y, glowRadius
          );
          gradient.addColorStop(0, `rgba(255, 255, 255, ${1.0})`);
          gradient.addColorStop(0.15, `rgba(255, 240, 200, ${0.8 * flash})`);
          gradient.addColorStop(0.4, `rgba(200, 169, 81, ${0.4 * flash})`);
          gradient.addColorStop(1, "rgba(255, 100, 0, 0)");

          ctx.globalCompositeOperation = "lighter";
          ctx.fillStyle = gradient;
          ctx.beginPath();
          ctx.arc(pt.x, pt.y, glowRadius, 0, Math.PI * 2);
          ctx.fill();

          // Second wider ambient glow
          const ambient = ctx.createRadialGradient(
            pt.x, pt.y, 0,
            pt.x, pt.y, glowRadius * 2.5
          );
          ambient.addColorStop(0, `rgba(255, 170, 50, ${0.15 * flash})`);
          ambient.addColorStop(1, "rgba(255, 100, 0, 0)");
          ctx.fillStyle = ambient;
          ctx.beginPath();
          ctx.arc(pt.x, pt.y, glowRadius * 2.5, 0, Math.PI * 2);
          ctx.fill();

          // White-hot core
          ctx.fillStyle = "#fff";
          ctx.shadowColor = "#fff";
          ctx.shadowBlur = 30;
          ctx.beginPath();
          ctx.arc(pt.x, pt.y, 4, 0, Math.PI * 2);
          ctx.fill();
          ctx.shadowBlur = 0;

          // TONS of sparks — 15-35 per frame
          spawnSparks(pt.x, pt.y, 15 + Math.floor(Math.random() * 20));
          drawSparks(ctx);
          ctx.globalCompositeOperation = "source-over";
        }
      }

      updateSparks();

      if (rawProgress >= 1 && sparks.length === 0) {
        setAnimationDone(true);
        return;
      }

      animFrameRef.current = requestAnimationFrame(frame);
    }

    animFrameRef.current = requestAnimationFrame(frame);
  }, []);

  useEffect(() => {
    ensureFont();
    document.fonts.ready.then(() => {
      animate();
    });
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
        minHeight: `calc(clamp(48px, 8vw, 96px) * 2.3)`,
        marginBottom: "24px",
        textAlign: "center",
        overflow: "visible",
      }}
    >
      {!animationDone && (
        <canvas
          ref={canvasRef}
          style={{
            position: "absolute",
            top: "-50vh",
            left: "-25vw",
            width: "150vw",
            height: "150vh",
            pointerEvents: "none",
          }}
        />
      )}

      <h1
        style={{
          fontFamily: `"Playfair Display", Georgia, "Times New Roman", serif`,
          fontSize: `clamp(48px, 8vw, 96px)`,
          fontWeight: 900,
          lineHeight: 1.05,
          letterSpacing: "2px",
          textTransform: "uppercase",
          margin: 0,
          color: "#fff",
          textAlign: "center",
          opacity: animationDone ? 1 : 0,
          transition: "opacity 0.3s ease",
        }}
      >
        LOW&apos;S CUSTOM
        <br />
        STAINLESS
      </h1>
    </div>
  );
}
