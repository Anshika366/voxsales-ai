import React, { useEffect, useRef } from 'react';

export default function AudioVisualizer({ voiceManager, callStatus, isBotSpeaking }) {
  const canvasRef = useRef(null);
  const animRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let phase = 0;

    const draw = () => {
      const w = canvas.width;
      const h = canvas.height;
      ctx.clearRect(0, 0, w, h);

      let frequencies = new Uint8Array(32);
      if (voiceManager && callStatus !== 'idle') {
        frequencies = voiceManager.getFrequencyData();
      }

      let energy = 0;
      for (let i = 0; i < frequencies.length; i++) {
        energy += frequencies[i];
      }
      energy = energy / (frequencies.length * 255);

      const cx = w / 2;
      const cy = h / 2;
      const baseR = 54 + (isBotSpeaking ? Math.sin(phase * 4) * 6 : energy * 18);

      let accentGlow = 'rgba(99, 102, 241, 0.25)';
      let accentCore = '#6366f1';

      if (callStatus === 'listening') {
        accentGlow = 'rgba(16, 185, 129, 0.3)';
        accentCore = '#10b981';
      } else if (callStatus === 'speaking' || isBotSpeaking) {
        accentGlow = 'rgba(139, 92, 246, 0.35)';
        accentCore = '#a855f7';
      } else if (callStatus === 'thinking') {
        accentGlow = 'rgba(236, 72, 153, 0.3)';
        accentCore = '#ec4899';
      }

      for (let r = 3; r >= 1; r--) {
        const rad = baseR + r * 14 + Math.sin(phase * 2 + r) * 4;
        ctx.beginPath();
        ctx.arc(cx, cy, rad, 0, Math.PI * 2);
        ctx.strokeStyle = accentGlow;
        ctx.lineWidth = 1.2;
        ctx.stroke();
      }

      const grad = ctx.createRadialGradient(cx, cy, 5, cx, cy, baseR + 25);
      grad.addColorStop(0, accentCore);
      grad.addColorStop(0.7, accentGlow);
      grad.addColorStop(1, 'rgba(10, 11, 16, 0)');

      ctx.beginPath();
      ctx.arc(cx, cy, baseR + 20, 0, Math.PI * 2);
      ctx.fillStyle = grad;
      ctx.fill();

      ctx.beginPath();
      ctx.arc(cx, cy, baseR - 4, 0, Math.PI * 2);
      ctx.fillStyle = '#0f1118';
      ctx.fill();
      ctx.strokeStyle = accentCore;
      ctx.lineWidth = 1.5;
      ctx.stroke();

      const waveCount = 18;
      const step = (Math.PI * 2) / waveCount;
      for (let i = 0; i < waveCount; i++) {
        const ang = i * step;
        const val = frequencies[i % frequencies.length] || 0;
        const hOffset = (val / 255) * 22 + Math.sin(phase * 3 + i) * (callStatus === 'idle' ? 2 : 5);
        const x1 = cx + Math.cos(ang) * (baseR - 4);
        const y1 = cy + Math.sin(ang) * (baseR - 4);
        const x2 = cx + Math.cos(ang) * (baseR + hOffset);
        const y2 = cy + Math.sin(ang) * (baseR + hOffset);

        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.strokeStyle = accentCore;
        ctx.lineWidth = 2;
        ctx.lineCap = 'round';
        ctx.stroke();
      }

      phase += 0.035;
      animRef.current = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      if (animRef.current) cancelAnimationFrame(animRef.current);
    };
  }, [voiceManager, callStatus, isBotSpeaking]);

  return (
    <div className="relative flex items-center justify-center my-3">
      <canvas
        ref={canvasRef}
        width={240}
        height={240}
        className="w-[200px] h-[200px] sm:w-[220px] sm:h-[220px]"
      />
    </div>
  );
}
