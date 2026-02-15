"use client";

import { useEffect, useRef, useState, useCallback } from "react";

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
  "#FF6B6B", // Red
  "#4ECDC4", // Teal
  "#45B7D1", // Blue
  "#96CEB4", // Green
  "#FFEAA7", // Yellow
  "#DDA0DD", // Plum
  "#98D8C8", // Mint
  "#F7DC6F", // Gold
  "#BB8FCE", // Purple
  "#85C1E9", // Light Blue
];

const GRAVITY = 0.5;
const FRICTION = 0.99;
const BOUNCE = 0.8;

export default function Home() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const ballsRef = useRef<Ball[]>([]);
  const nextIdRef = useRef(0);
  const animationRef = useRef<number>(0);
  const [ballCount, setBallCount] = useState(0);

  const getRandomColor = () => COLORS[Math.floor(Math.random() * COLORS.length)];

  const addBall = useCallback((x?: number, y?: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const newBall: Ball = {
      id: nextIdRef.current++,
      x: x ?? Math.random() * (canvas.width - 60) + 30,
      y: y ?? Math.random() * 100 + 30,
      vx: (Math.random() - 0.5) * 10,
      vy: (Math.random() - 0.5) * 5,
      radius: Math.random() * 20 + 15,
      color: getRandomColor(),
    };

    ballsRef.current = [...ballsRef.current, newBall];
    setBallCount(ballsRef.current.length);
  }, []);

  const removeBall = useCallback(() => {
    if (ballsRef.current.length > 0) {
      ballsRef.current = ballsRef.current.slice(0, -1);
      setBallCount(ballsRef.current.length);
    }
  }, []);

  const clearBalls = useCallback(() => {
    ballsRef.current = [];
    setBallCount(0);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    // Add initial balls
    for (let i = 0; i < 5; i++) {
      addBall();
    }

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
          ball.vx = -ball.vx * BOUNCE;
        }
        if (ball.x + ball.radius > canvas.width) {
          ball.x = canvas.width - ball.radius;
          ball.vx = -ball.vx * BOUNCE;
        }
        if (ball.y - ball.radius < 0) {
          ball.y = ball.radius;
          ball.vy = -ball.vy * BOUNCE;
        }
        if (ball.y + ball.radius > canvas.height) {
          ball.y = canvas.height - ball.radius;
          ball.vy = -ball.vy * BOUNCE;
        }

        // Draw ball with gradient
        const gradient = ctx.createRadialGradient(
          ball.x - ball.radius * 0.3,
          ball.y - ball.radius * 0.3,
          0,
          ball.x,
          ball.y,
          ball.radius
        );
        gradient.addColorStop(0, "white");
        gradient.addColorStop(0.3, ball.color);
        gradient.addColorStop(1, ball.color);

        ctx.beginPath();
        ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
        ctx.fillStyle = gradient;
        ctx.fill();

        // Add shadow
        ctx.shadowColor = "rgba(0, 0, 0, 0.3)";
        ctx.shadowBlur = 10;
        ctx.shadowOffsetX = 5;
        ctx.shadowOffsetY = 5;
      });

      // Reset shadow
      ctx.shadowColor = "transparent";
      ctx.shadowBlur = 0;
      ctx.shadowOffsetX = 0;
      ctx.shadowOffsetY = 0;

      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      cancelAnimationFrame(animationRef.current);
    };
  }, [addBall]);

  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    addBall(x, y);
  };

  return (
    <div className="relative w-screen h-screen overflow-hidden">
      <canvas
        ref={canvasRef}
        onClick={handleCanvasClick}
        className="absolute inset-0 cursor-pointer"
      />

      {/* Control Panel */}
      <div className="absolute top-4 left-4 bg-black/50 backdrop-blur-sm rounded-xl p-4 text-white">
        <h1 className="text-xl font-bold mb-3">🎱 Bouncing Balls</h1>
        <p className="text-sm text-gray-300 mb-3">Balls: {ballCount}</p>
        <p className="text-xs text-gray-400 mb-4">Click anywhere to add a ball</p>
        
        <div className="flex flex-col gap-2">
          <button
            onClick={() => addBall()}
            className="px-4 py-2 bg-green-600 hover:bg-green-700 rounded-lg transition-colors font-medium"
          >
            + Add Ball
          </button>
          <button
            onClick={removeBall}
            disabled={ballCount === 0}
            className="px-4 py-2 bg-red-600 hover:bg-red-700 disabled:bg-gray-600 disabled:cursor-not-allowed rounded-lg transition-colors font-medium"
          >
            − Remove Ball
          </button>
          <button
            onClick={clearBalls}
            disabled={ballCount === 0}
            className="px-4 py-2 bg-gray-600 hover:bg-gray-700 disabled:bg-gray-800 disabled:cursor-not-allowed rounded-lg transition-colors font-medium"
          >
            Clear All
          </button>
        </div>
      </div>
    </div>
  );
}
