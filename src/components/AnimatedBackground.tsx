import { useEffect, useRef } from 'react';

export function AnimatedBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;
    let time = 0;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      time += 0.005;

      // Draw fluid waves
      for (let i = 0; i < 3; i++) {
        ctx.beginPath();
        ctx.moveTo(0, canvas.height);
        
        for (let x = 0; x <= canvas.width; x += 10) {
          // Complex mathematical wave generation reflecting fluid/gradient distortion
          const y = canvas.height * 0.5 + 
            Math.sin(x * 0.003 + time + i) * 100 * Math.sin(time * 0.5) +
            Math.cos(x * 0.002 - time * 1.2 + i * 2) * 50;
            
          ctx.lineTo(x, y + i * 40);
        }

        ctx.lineTo(canvas.width, canvas.height);
        ctx.lineTo(0, canvas.height);
        ctx.closePath();

        // Premium gradients corresponding to Cohere branding (typically deep greens/accents)
        const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
        if (i === 0) {
          gradient.addColorStop(0, 'hsla(153, 40%, 24%, 0.15)');
          gradient.addColorStop(1, 'hsla(153, 60%, 15%, 0.1)');
        } else if (i === 1) {
          gradient.addColorStop(0, 'hsla(153, 30%, 30%, 0.1)');
          gradient.addColorStop(1, 'hsla(16, 65%, 50%, 0.05)');
        } else {
          gradient.addColorStop(0, 'hsla(153, 50%, 20%, 0.1)');
          gradient.addColorStop(1, 'hsla(153, 20%, 10%, 0.15)');
        }

        ctx.fillStyle = gradient;
        ctx.fill();
      }

      animationId = requestAnimationFrame(draw);
    };
    draw();

    // Mouse interactivity to warp waves slightly
    const onMouseMove = (e: MouseEvent) => {
      const mouseX = e.clientX;
      const mouseY = e.clientY;
      // Gently nudge time or offset based on cursor
      time += (mouseX / window.innerWidth) * 0.001;
    };
    window.addEventListener('mousemove', onMouseMove);

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', onMouseMove);
    };
  }, []);

  return <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none z-0" />;
}
