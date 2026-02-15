"use client";

import { useEffect, useRef, useState, useCallback } from "react";

interface Ball {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  color: string;
  mass: number;
}

const GRAVITY = 0.5;
const DAMPING = 0.98;
const COLLISION_DAMPING = 0.9;

function randomColor(): string {
  const colors = [
    "#ef4444", // red
    "#f97316", // orange
    "#eab308", // yellow
    "#22c55e", // green
    "#3b82f6", // blue
    "#8b5cf6", // violet
    "#ec4899", // pink
    "#06b6d4", // cyan
  ];
  return colors[Math.floor(Math.random() * colors.length)];
}

function createBall(canvasWidth: number, canvasHeight: number): Ball {
  const radius = 15 + Math.random() * 25;
  return {
    x: radius + Math.random() * (canvasWidth - 2 * radius),
    y: radius + Math.random() * (canvasHeight / 2),
    vx: (Math.random() - 0.5) * 10,
    vy: (Math.random() - 0.5) * 5,
    radius,
    color: randomColor(),
    mass: radius * radius,
  };
}

function detectCollision(ball1: Ball, ball2: Ball): boolean {
  const dx = ball2.x - ball1.x;
  const dy = ball2.y - ball1.y;
  const distance = Math.sqrt(dx * dx + dy * dy);
  return distance < ball1.radius + ball2.radius;
}

function resolveCollision(ball1: Ball, ball2: Ball): void {
  const dx = ball2.x - ball1.x;
  const dy = ball2.y - ball1.y;
  const distance = Math.sqrt(dx * dx + dy * dy);

  if (distance === 0) return;

  // Normal vector
  const nx = dx / distance;
  const ny = dy / distance;

  // Relative velocity
  const dvx = ball1.vx - ball2.vx;
  const dvy = ball1.vy - ball2.vy;

  // Relative velocity along normal
  const dvn = dvx * nx + dvy * ny;

  // Don't resolve if velocities are separating
  if (dvn > 0) return;

  // Calculate impulse
  const impulse =
    (2 * dvn * COLLISION_DAMPING) / (ball1.mass + ball2.mass);

  // Apply impulse
  ball1.vx -= impulse * ball2.mass * nx;
  ball1.vy -= impulse * ball2.mass * ny;
  ball2.vx += impulse * ball1.mass * nx;
  ball2.vy += impulse * ball1.mass * ny;

  // Separate overlapping balls
  const overlap = ball1.radius + ball2.radius - distance;
  if (overlap > 0) {
    const separationX = (overlap / 2) * nx;
    const separationY = (overlap / 2) * ny;
    ball1.x -= separationX;
    ball1.y -= separationY;
    ball2.x += separationX;
    ball2.y += separationY;
  }
}

export default function BouncingBallsPage() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const ballsRef = useRef<Ball[]>([]);
  const animationRef = useRef<number | null>(null);
  const [ballCount, setBallCount] = useState(10);

  const initBalls = useCallback((count: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    ballsRef.current = Array.from({ length: count }, () =>
      createBall(canvas.width, canvas.height)
    );
  }, []);

  const updateBalls = useCallback((canvasWidth: number, canvasHeight: number) => {
    const balls = ballsRef.current;

    for (const ball of balls) {
      // Apply gravity
      ball.vy += GRAVITY;

      // Apply velocity
      ball.x += ball.vx;
      ball.y += ball.vy;

      // Wall collisions
      if (ball.x - ball.radius < 0) {
        ball.x = ball.radius;
        ball.vx = -ball.vx * DAMPING;
      } else if (ball.x + ball.radius > canvasWidth) {
        ball.x = canvasWidth - ball.radius;
        ball.vx = -ball.vx * DAMPING;
      }

      if (ball.y - ball.radius < 0) {
        ball.y = ball.radius;
        ball.vy = -ball.vy * DAMPING;
      } else if (ball.y + ball.radius > canvasHeight) {
        ball.y = canvasHeight - ball.radius;
        ball.vy = -ball.vy * DAMPING;
      }

      // Apply horizontal damping
      ball.vx *= 0.999;
    }

    // Ball-to-ball collisions
    for (let i = 0; i < balls.length; i++) {
      for (let j = i + 1; j < balls.length; j++) {
        if (detectCollision(balls[i], balls[j])) {
          resolveCollision(balls[i], balls[j]);
        }
      }
    }
  }, []);

  const drawBalls = useCallback((ctx: CanvasRenderingContext2D) => {
    const balls = ballsRef.current;
    
    for (const ball of balls) {
      // Draw shadow
      ctx.beginPath();
      ctx.arc(ball.x + 3, ball.y + 3, ball.radius, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(0, 0, 0, 0.2)";
      ctx.fill();

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
    }
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resizeCanvas = () => {
      const container = canvas.parentElement;
      if (container) {
        canvas.width = container.clientWidth;
        canvas.height = container.clientHeight;
        if (ballsRef.current.length === 0) {
          initBalls(ballCount);
        }
      }
    };

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      updateBalls(canvas.width, canvas.height);
      drawBalls(ctx);
      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [initBalls, updateBalls, drawBalls, ballCount]);

  const handleAddBall = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    ballsRef.current.push(createBall(canvas.width, canvas.height));
    setBallCount((c) => c + 1);
  };

  const handleReset = () => {
    initBalls(10);
    setBallCount(10);
  };

  return (
    <div className="flex min-h-screen flex-col bg-gray-900">
      <header className="bg-gray-800 px-6 py-4 shadow-lg">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <h1 className="text-2xl font-bold text-white">
            2D Bouncing Ball Simulation
          </h1>
          <div className="flex items-center gap-4">
            <span className="text-gray-300">Balls: {ballCount}</span>
            <button
              onClick={handleAddBall}
              className="rounded-lg bg-blue-600 px-4 py-2 text-white transition-colors hover:bg-blue-700"
            >
              Add Ball
            </button>
            <button
              onClick={handleReset}
              className="rounded-lg bg-gray-600 px-4 py-2 text-white transition-colors hover:bg-gray-700"
            >
              Reset
            </button>
          </div>
        </div>
      </header>
      <main className="relative flex-1">
        <canvas
          ref={canvasRef}
          className="absolute inset-0 h-full w-full bg-gradient-to-b from-gray-800 to-gray-900"
        />
      </main>
    </div>
  );
}
