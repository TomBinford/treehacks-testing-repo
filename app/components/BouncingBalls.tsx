"use client";

import { useRef, useEffect, useState, useCallback } from "react";

interface Ball {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  color: string;
}

const COLORS = [
  "#FF6B6B",
  "#4ECDC4",
  "#45B7D1",
  "#96CEB4",
  "#FFEAA7",
  "#DDA0DD",
  "#98D8C8",
  "#F7DC6F",
  "#BB8FCE",
  "#85C1E9",
];

const GRAVITY = 0.5;
const FRICTION = 0.99;
const BOUNCE_DAMPING = 0.8;

export default function BouncingBalls() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const ballsRef = useRef<Ball[]>([]);
  const animationRef = useRef<number>(0);
  const nextIdRef = useRef(1);
  const [ballCount, setBallCount] = useState(0);

  const createBall = useCallback((x?: number, y?: number): Ball => {
    const canvas = canvasRef.current;
    const radius = Math.random() * 20 + 15;
    return {
      id: nextIdRef.current++,
      x: x ?? Math.random() * ((canvas?.width ?? 800) - radius * 2) + radius,
      y: y ?? radius + Math.random() * 100,
      vx: (Math.random() - 0.5) * 10,
      vy: (Math.random() - 0.5) * 5,
      radius,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
    };
  }, []);

  const addBall = useCallback(() => {
    ballsRef.current.push(createBall());
    setBallCount(ballsRef.current.length);
  }, [createBall]);

  const removeBall = useCallback(() => {
    if (ballsRef.current.length > 0) {
      ballsRef.current.pop();
      setBallCount(ballsRef.current.length);
    }
  }, []);

  const clearAllBalls = useCallback(() => {
    ballsRef.current = [];
    setBallCount(0);
  }, []);

  const handleCanvasClick = useCallback(
    (e: React.MouseEvent<HTMLCanvasElement>) => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      ballsRef.current.push(createBall(x, y));
      setBallCount(ballsRef.current.length);
    },
    [createBall]
  );

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resizeCanvas = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    // Add initial balls
    for (let i = 0; i < 3; i++) {
      ballsRef.current.push(createBall());
    }
    setBallCount(ballsRef.current.length);

    const animate = () => {
      ctx.fillStyle = "#1a1a2e";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ballsRef.current.forEach((ball) => {
        // Apply gravity
        ball.vy += GRAVITY;

        // Apply friction
        ball.vx *= FRICTION;
        ball.vy *= FRICTION;

        // Update position
        ball.x += ball.vx;
        ball.y += ball.vy;

        // Bounce off walls
        if (ball.x - ball.radius < 0) {
          ball.x = ball.radius;
          ball.vx = -ball.vx * BOUNCE_DAMPING;
        } else if (ball.x + ball.radius > canvas.width) {
          ball.x = canvas.width - ball.radius;
          ball.vx = -ball.vx * BOUNCE_DAMPING;
        }

        // Bounce off floor and ceiling
        if (ball.y - ball.radius < 0) {
          ball.y = ball.radius;
          ball.vy = -ball.vy * BOUNCE_DAMPING;
        } else if (ball.y + ball.radius > canvas.height) {
          ball.y = canvas.height - ball.radius;
          ball.vy = -ball.vy * BOUNCE_DAMPING;

          // Add some random horizontal velocity when hitting the floor
          if (Math.abs(ball.vy) < 1) {
            ball.vx += (Math.random() - 0.5) * 2;
          }
        }

        // Draw ball with gradient for 3D effect
        const gradient = ctx.createRadialGradient(
          ball.x - ball.radius * 0.3,
          ball.y - ball.radius * 0.3,
          ball.radius * 0.1,
          ball.x,
          ball.y,
          ball.radius
        );
        gradient.addColorStop(0, "#ffffff");
        gradient.addColorStop(0.3, ball.color);
        gradient.addColorStop(1, shadeColor(ball.color, -30));

        ctx.beginPath();
        ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
        ctx.fillStyle = gradient;
        ctx.fill();

        // Draw shadow
        ctx.beginPath();
        ctx.ellipse(
          ball.x,
          canvas.height - 5,
          ball.radius * 0.8,
          ball.radius * 0.2,
          0,
          0,
          Math.PI * 2
        );
        ctx.fillStyle = "rgba(0, 0, 0, 0.3)";
        ctx.fill();
      });

      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      cancelAnimationFrame(animationRef.current);
    };
  }, [createBall]);

  return (
    <div className="flex flex-col h-screen w-full bg-gray-900">
      <div className="flex items-center justify-between p-4 bg-gray-800 border-b border-gray-700">
        <h1 className="text-2xl font-bold text-white">
          🎱 Bouncing Ball Simulation
        </h1>
        <div className="flex items-center gap-4">
          <span className="text-gray-300">Balls: {ballCount}</span>
          <button
            onClick={addBall}
            className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors"
          >
            + Add Ball
          </button>
          <button
            onClick={removeBall}
            disabled={ballCount === 0}
            className="px-4 py-2 bg-red-600 hover:bg-red-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white rounded-lg font-medium transition-colors"
          >
            − Remove Ball
          </button>
          <button
            onClick={clearAllBalls}
            disabled={ballCount === 0}
            className="px-4 py-2 bg-gray-600 hover:bg-gray-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white rounded-lg font-medium transition-colors"
          >
            Clear All
          </button>
        </div>
      </div>
      <div className="flex-1 p-4">
        <canvas
          ref={canvasRef}
          onClick={handleCanvasClick}
          className="w-full h-full rounded-lg cursor-crosshair"
          style={{ display: "block" }}
        />
      </div>
      <div className="p-2 bg-gray-800 text-center text-gray-400 text-sm">
        Click anywhere on the canvas to add a ball at that position
      </div>
    </div>
  );
}

// Helper function to shade a color
function shadeColor(color: string, percent: number): string {
  const num = parseInt(color.replace("#", ""), 16);
  const amt = Math.round(2.55 * percent);
  const R = (num >> 16) + amt;
  const G = ((num >> 8) & 0x00ff) + amt;
  const B = (num & 0x0000ff) + amt;
  return (
    "#" +
    (
      0x1000000 +
      (R < 255 ? (R < 1 ? 0 : R) : 255) * 0x10000 +
      (G < 255 ? (G < 1 ? 0 : G) : 255) * 0x100 +
      (B < 255 ? (B < 1 ? 0 : B) : 255)
    )
      .toString(16)
      .slice(1)
  );
}
