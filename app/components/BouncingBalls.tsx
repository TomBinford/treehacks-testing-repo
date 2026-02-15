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
  "#ef4444", // red
  "#f97316", // orange
  "#eab308", // yellow
  "#22c55e", // green
  "#3b82f6", // blue
  "#8b5cf6", // violet
  "#ec4899", // pink
  "#14b8a6", // teal
];

const GRAVITY = 0.5;
const FRICTION = 0.99;
const BOUNCE_DAMPING = 0.8;

function getRandomColor(): string {
  return COLORS[Math.floor(Math.random() * COLORS.length)];
}

function getRandomVelocity(): number {
  return (Math.random() - 0.5) * 10;
}

export default function BouncingBalls() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const ballsRef = useRef<Ball[]>([]);
  const animationRef = useRef<number | null>(null);
  const nextIdRef = useRef(1);
  const [ballCount, setBallCount] = useState(0);

  const addBall = useCallback((x?: number, y?: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const newBall: Ball = {
      id: nextIdRef.current++,
      x: x ?? Math.random() * canvas.width,
      y: y ?? Math.random() * (canvas.height / 2),
      vx: getRandomVelocity(),
      vy: getRandomVelocity(),
      radius: 15 + Math.random() * 20,
      color: getRandomColor(),
    };

    ballsRef.current.push(newBall);
    setBallCount(ballsRef.current.length);
  }, []);

  const removeBall = useCallback(() => {
    if (ballsRef.current.length > 0) {
      ballsRef.current.pop();
      setBallCount(ballsRef.current.length);
    }
  }, []);

  const clearBalls = useCallback(() => {
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

      addBall(x, y);
    },
    [addBall]
  );

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Set canvas size
    const resizeCanvas = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    // Animation loop
    const animate = () => {
      ctx.fillStyle = "#1a1a2e";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      for (const ball of ballsRef.current) {
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
          ball.vx *= -BOUNCE_DAMPING;
        } else if (ball.x + ball.radius > canvas.width) {
          ball.x = canvas.width - ball.radius;
          ball.vx *= -BOUNCE_DAMPING;
        }

        // Bounce off floor and ceiling
        if (ball.y - ball.radius < 0) {
          ball.y = ball.radius;
          ball.vy *= -BOUNCE_DAMPING;
        } else if (ball.y + ball.radius > canvas.height) {
          ball.y = canvas.height - ball.radius;
          ball.vy *= -BOUNCE_DAMPING;
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
        gradient.addColorStop(0, "white");
        gradient.addColorStop(0.3, ball.color);
        gradient.addColorStop(1, "#000000");

        ctx.beginPath();
        ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
        ctx.fillStyle = gradient;
        ctx.fill();
        ctx.closePath();
      }

      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  return (
    <div className="flex flex-col h-screen w-full bg-gray-900">
      {/* Controls */}
      <div className="flex items-center justify-center gap-4 p-4 bg-gray-800 border-b border-gray-700">
        <button
          onClick={() => addBall()}
          className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition-colors"
        >
          Add Ball
        </button>
        <button
          onClick={removeBall}
          disabled={ballCount === 0}
          className="px-4 py-2 bg-red-600 hover:bg-red-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-medium rounded-lg transition-colors"
        >
          Remove Ball
        </button>
        <button
          onClick={clearBalls}
          disabled={ballCount === 0}
          className="px-4 py-2 bg-yellow-600 hover:bg-yellow-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-medium rounded-lg transition-colors"
        >
          Clear All
        </button>
        <span className="text-white font-medium ml-4">
          Balls: {ballCount}
        </span>
      </div>

      {/* Canvas */}
      <div className="flex-1 relative">
        <canvas
          ref={canvasRef}
          onClick={handleCanvasClick}
          className="w-full h-full cursor-crosshair"
        />
        {ballCount === 0 && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <p className="text-gray-400 text-lg">
              Click anywhere on the canvas or press &quot;Add Ball&quot; to start!
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
