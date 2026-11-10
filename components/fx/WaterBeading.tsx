"use client";

import { useEffect, useRef } from "react";

type Drop = { x: number; y: number; r: number; vx: number; vy: number; rolling: boolean; born: number };

/**
 * Hydrophobic paint demo: water beads sit on a glossy black panel.
 * Move the cursor / drag a finger across it and they roll right off.
 * Runs only while visible; static frame for reduced motion.
 */
export function WaterBeading({ className = "", label = "Interactive demo: water beading on ceramic-coated paint" }: { className?: string; label?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext("2d", { alpha: false })!;
    const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
    let W = 0,
      H = 0,
      dpr = 1;
    let drops: Drop[] = [];
    const sprites = new Map<number, HTMLCanvasElement>();
    const pointer = { x: -999, y: -999, px: -999, py: -999, last: 0, active: false };
    let raf = 0,
      running = false;
    const t0 = performance.now();

    const sprite = (r: number) => {
      const key = Math.max(2, Math.round(r));
      let s = sprites.get(key);
      if (s) return s;
      s = document.createElement("canvas");
      const size = Math.ceil(key * 2 + 8) * dpr;
      s.width = s.height = size;
      const g = s.getContext("2d")!;
      g.scale(dpr, dpr);
      const c = key + 4;
      // contact shadow
      g.fillStyle = "rgba(0,0,0,0.55)";
      g.beginPath();
      g.ellipse(c + key * 0.18, c + key * 0.28, key, key * 0.92, 0, 0, Math.PI * 2);
      g.fill();
      // body — refracts the lighter reflection band
      const body = g.createRadialGradient(c - key * 0.25, c - key * 0.3, key * 0.1, c, c, key);
      body.addColorStop(0, "rgba(40,44,52,0.9)");
      body.addColorStop(0.7, "rgba(18,20,24,0.95)");
      body.addColorStop(1, "rgba(120,130,145,0.55)");
      g.fillStyle = body;
      g.beginPath();
      g.arc(c, c, key, 0, Math.PI * 2);
      g.fill();
      // bright caustic on the lower-right rim
      const rim = g.createRadialGradient(c + key * 0.45, c + key * 0.5, 0, c + key * 0.45, c + key * 0.5, key * 0.8);
      rim.addColorStop(0, "rgba(220,235,255,0.55)");
      rim.addColorStop(1, "rgba(220,235,255,0)");
      g.fillStyle = rim;
      g.beginPath();
      g.arc(c, c, key, 0, Math.PI * 2);
      g.fill();
      // specular highlight
      g.fillStyle = "rgba(255,255,255,0.95)";
      g.beginPath();
      g.ellipse(c - key * 0.38, c - key * 0.42, key * 0.26, key * 0.17, -0.6, 0, Math.PI * 2);
      g.fill();
      sprites.set(key, s);
      return s;
    };

    const spawn = (now: number, anywhere = true): Drop => ({
      x: Math.random() * W,
      y: anywhere ? Math.random() * H : Math.random() * H * 0.6,
      r: 2.5 + Math.pow(Math.random(), 2.2) * (W < 600 ? 9 : 12),
      vx: 0,
      vy: 0,
      rolling: false,
      born: now,
    });

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      dpr = Math.min(2, window.devicePixelRatio || 1);
      W = rect.width;
      H = rect.height;
      canvas.width = Math.round(W * dpr);
      canvas.height = Math.round(H * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      sprites.clear();
      const count = Math.round((W * H) / (W < 600 ? 2600 : 2300));
      drops = Array.from({ length: Math.min(count, 170) }, () => spawn(-9999));
    };

    const paintBg = (time: number) => {
      const g = ctx.createLinearGradient(0, 0, W, H);
      g.addColorStop(0, "#060607");
      g.addColorStop(0.5, "#121316");
      g.addColorStop(1, "#050506");
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, W, H);
      // slow reflection band (gloss)
      const bx = ((time / 9000) % 1) * (W * 1.8) - W * 0.4;
      const band = ctx.createLinearGradient(bx - W * 0.25, 0, bx + W * 0.25, H);
      band.addColorStop(0, "rgba(255,255,255,0)");
      band.addColorStop(0.5, "rgba(200,215,255,0.07)");
      band.addColorStop(1, "rgba(255,255,255,0)");
      ctx.fillStyle = band;
      ctx.fillRect(0, 0, W, H);
      // faint IGL-green edge light
      const edge = ctx.createLinearGradient(0, H, 0, H * 0.6);
      edge.addColorStop(0, "rgba(61,174,73,0.10)");
      edge.addColorStop(1, "rgba(61,174,73,0)");
      ctx.fillStyle = edge;
      ctx.fillRect(0, H * 0.6, W, H * 0.4);
    };

    const draw = (now: number) => {
      paintBg(now - t0);
      for (const d of drops) {
        const grow = Math.min(1, (now - d.born) / 500);
        const r = d.r * (d.born < 0 ? 1 : grow);
        if (r < 1) continue;
        const s = sprite(r);
        const size = s.width / dpr;
        // rolling drops stretch along their direction
        if (d.rolling && (Math.abs(d.vy) > 0.5 || Math.abs(d.vx) > 0.5)) {
          ctx.save();
          ctx.translate(d.x, d.y);
          ctx.rotate(Math.atan2(d.vy, d.vx) - Math.PI / 2);
          ctx.scale(0.9, 1 + Math.min(0.45, Math.hypot(d.vx, d.vy) / 18));
          ctx.drawImage(s, -size / 2, -size / 2, size, size);
          ctx.restore();
          // thin wet trail
          ctx.strokeStyle = "rgba(160,175,195,0.07)";
          ctx.lineWidth = r * 0.5;
          ctx.beginPath();
          ctx.moveTo(d.x, d.y);
          ctx.lineTo(d.x - d.vx * 3, d.y - d.vy * 3);
          ctx.stroke();
        } else {
          ctx.drawImage(s, d.x - size / 2, d.y - size / 2, size, size);
        }
      }
    };

    const step = (now: number) => {
      // idle auto-swipe so the demo plays itself
      if (now - pointer.last > 3200) {
        const phase = ((now - pointer.last - 3200) % 4200) / 4200;
        if (phase < 0.5) {
          const p = phase / 0.5;
          pointer.px = pointer.x;
          pointer.py = pointer.y;
          pointer.x = W * (-0.1 + p * 1.2);
          pointer.y = H * (0.3 + Math.sin(p * Math.PI) * 0.25);
          pointer.active = true;
        } else pointer.active = false;
      }
      const R = Math.max(46, Math.min(W, H) * 0.14);
      const pvx = pointer.x - pointer.px,
        pvy = pointer.y - pointer.py;
      for (const d of drops) {
        if (pointer.active) {
          const dx = d.x - pointer.x,
            dy = d.y - pointer.y;
          const dist = Math.hypot(dx, dy);
          if (dist < R + d.r) {
            const f = (1 - dist / (R + d.r)) * 2.4;
            d.vx += (dx / (dist || 1)) * f + pvx * 0.06;
            d.vy += (dy / (dist || 1)) * f + Math.abs(pvy) * 0.04 + 0.6;
            d.rolling = true;
          }
        }
        if (d.rolling) {
          d.vy += 0.16 + d.r * 0.012; // gravity — bigger drops fall faster
          d.vx *= 0.97;
          d.vy *= 0.985;
          d.x += d.vx;
          d.y += d.vy;
        }
      }
      // merge touching drops (that's what beads do)
      for (let i = 0; i < drops.length; i++) {
        const a = drops[i];
        if (!a.rolling) continue;
        for (let j = 0; j < drops.length; j++) {
          if (i === j) continue;
          const b = drops[j];
          if (b.r === 0) continue;
          const dx = a.x - b.x,
            dy = a.y - b.y;
          if (dx * dx + dy * dy < (a.r + b.r) * (a.r + b.r) * 0.55) {
            a.r = Math.min(18, Math.sqrt(a.r * a.r + b.r * b.r));
            a.vy += 0.4;
            b.r = 0;
          }
        }
      }
      // respawn anything gone or merged away
      for (let i = 0; i < drops.length; i++) {
        const d = drops[i];
        if (d.r === 0 || d.y - d.r > H || d.x < -40 || d.x > W + 40) {
          drops[i] = spawn(now + Math.random() * 1600);
        }
      }
    };

    const loop = (now: number) => {
      step(now);
      draw(now);
      raf = requestAnimationFrame(loop);
    };

    const setPointer = (e: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      pointer.px = pointer.active ? pointer.x : e.clientX - rect.left;
      pointer.py = pointer.active ? pointer.y : e.clientY - rect.top;
      pointer.x = e.clientX - rect.left;
      pointer.y = e.clientY - rect.top;
      pointer.active = true;
      pointer.last = performance.now();
    };
    const clear = () => {
      pointer.active = false;
      pointer.last = performance.now();
    };

    resize();
    if (reduce) {
      draw(performance.now() + 99999);
      return;
    }

    const io = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !running) {
        running = true;
        pointer.last = performance.now() - 2600;
        raf = requestAnimationFrame(loop);
      } else if (!entry.isIntersecting && running) {
        running = false;
        cancelAnimationFrame(raf);
      }
    });
    io.observe(canvas);
    const ro = new ResizeObserver(() => {
      resize();
      if (!running) draw(performance.now());
    });
    ro.observe(canvas);
    canvas.addEventListener("pointermove", setPointer);
    canvas.addEventListener("pointerdown", setPointer);
    canvas.addEventListener("pointerleave", clear);
    canvas.addEventListener("pointercancel", clear);
    draw(performance.now());
    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      ro.disconnect();
      canvas.removeEventListener("pointermove", setPointer);
      canvas.removeEventListener("pointerdown", setPointer);
      canvas.removeEventListener("pointerleave", clear);
      canvas.removeEventListener("pointercancel", clear);
    };
  }, []);

  return <canvas ref={canvasRef} role="img" aria-label={label} className={`block h-full w-full touch-pan-y ${className}`} />;
}
