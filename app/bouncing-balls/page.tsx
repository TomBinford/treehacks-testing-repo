"use client";

import { useEffect, useRef, useState, useCallback } from "react";

interface Ball {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  mass: number;
  color: string;
}

const GRAVITY = 0.5;
const FRICTION = 0.99;
const RESTITUTION = 0.8;

function getRandomColor(): string {
  const colors = [
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
    mass: radius * radius,
    color: getRandomColor(),
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

  // Relative velocity in collision normal direction
  const dvn = dvx * nx + dvy * ny;

  // Do not resolve if velocities are separating
  if (dvn > 0) return;

  // Calculate impulse scalar
  const impulse =
    (-(1 + RESTITUTION) * dvn) / (1 / ball1.mass + 1 / ball2.mass);

  // Apply impulse to velocities
  ball1.vx += (impulse / ball1.mass) * nx;
  ball1.vy += (impulse / ball1.mass) * ny;
  ball2.vx -= (impulse / ball2.mass) * nx;
  ball2.vy -= (impulse / ball2.mass) * ny;

  // Separate overlapping balls
  const overlap = ball1.radius + ball2.radius - distance;
  const separationX = (overlap / 2) * nx;
  const separationY = (overlap / 2) * ny;
  ball1.x -= separationX;
  ball1.y -= separationY;
  ball2.x += separationX;
  ball2.y += separationY;
}

function updateBall(ball: Ball, canvasWidth: number, canvasHeight: number): void {
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
    ball.vx = -ball.vx * RESTITUTION;
  } else if (ball.x + ball.radius > canvasWidth) {
    ball.x = canvasWidth - ball.radius;
    ball.vx = -ball.vx * RESTITUTION;
  }

  // Bounce off floor and ceiling
  if (ball.y - ball.radius < 0) {
    ball.y = ball.radius;
    ball.vy = -ball.vy * RESTITUTION;
  } else if (ball.y + ball.radius > canvasHeight) {
    ball.y = canvasHeight - ball.radius;
    ball.vy = -ball.vy * RESTITUTION;
  }
}

function drawBall(ctx: CanvasRenderingContext2D, ball: Ball): void {
  ctx.beginPath();
  ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
  ctx.fillStyle = ball.color;
  ctx.fill();
  ctx.closePath();

  // Add a subtle gradient/shine effect
  const gradient = ctx.createRadialGradient(
    ball.x - ball.radius * 0.3,
    ball.y - ball.radius * 0.3,
    0,
    ball.x,
    ball.y,
    ball.radius
  );
  gradient.addColorStop(0, "rgba(255, 255, 255, 0.4)");
  gradient.addColorStop(1, "rgba(255, 255, 255, 0)");
  ctx.beginPath();
  ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
  ctx.fillStyle = gradient;
  ctx.fill();
  ctx.closePath();
}

export default function BouncingBallsPage() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const ballsRef = useRef<Ball[]>([]);
  const animationIdRef = useRef<number>(0);
  const [ballCount, setBallCount] = useState(10);

  const initializeBalls = useCallback((count: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    ballsRef.current = Array.from({ length: count }, () =>
      createBall(canvas.width, canvas.height)
    );
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const animate = () => {
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      // Clear canvas
      ctx.fillStyle = "#1a1a2e";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const balls = ballsRef.current;

      // Update physics
      for (let i = 0; i < balls.length; i++) {
        updateBall(balls[i], canvas.width, canvas.height);
      }

      // Check collisions
      for (let i = 0; i < balls.length; i++) {
        for (let j = i + 1; j < balls.length; j++) {
          if (detectCollision(balls[i], balls[j])) {
            resolveCollision(balls[i], balls[j]);
          }
        }
      }

      // Draw balls
      for (const ball of balls) {
        drawBall(ctx, ball);
      }

      animationIdRef.current = requestAnimationFrame(animate);
    };

    // Set canvas size
    const resizeCanvas = () => {
      canvas.width = Math.min(window.innerWidth - 40, 900);
      canvas.height = Math.min(window.innerHeight - 200, 600);
      initializeBalls(ballCount);
    };

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    // Start animation
    animate();

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      cancelAnimationFrame(animationIdRef.current);
    };
  }, [ballCount, initializeBalls]);

  const handleAddBall = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    ballsRef.current.push(createBall(canvas.width, canvas.height));
    setBallCount(ballsRef.current.length);
  };

  const handleRemoveBall = () => {
    if (ballsRef.current.length > 1) {
      ballsRef.current.pop();
      setBallCount(ballsRef.current.length);
    }
  };

  const handleReset = () => {
    initializeBalls(10);
    setBallCount(10);
  };

  return (
    <div className="flex min-h-screen flex-col items-center bg-gray-900 p-5">
      <h1 className="mb-6 text-3xl font-bold text-white">
        2D Bouncing Ball Simulation
      </h1>

      <div className="mb-4 flex gap-4">
        <button
          onClick={handleAddBall}
          className="rounded-lg bg-green-600 px-4 py-2 font-semibold text-white transition-colors hover:bg-green-700"
        >
          Add Ball
        </button>
        <button
          onClick={handleRemoveBall}
          className="rounded-lg bg-red-600 px-4 py-2 font-semibold text-white transition-colors hover:bg-red-700"
        >
          Remove Ball
        </button>
        <button
          onClick={handleReset}
          className="rounded-lg bg-blue-600 px-4 py-2 font-semibold text-white transition-colors hover:bg-blue-700"
        >
          Reset
        </button>
      </div>

      <p className="mb-4 text-gray-300">Balls: {ballCount}</p>

      <canvas
        ref={canvasRef}
        className="rounded-lg border-2 border-gray-700 shadow-2xl"
      />

      <div className="mt-6 max-w-md text-center text-gray-400">
        <p>
          Balls bounce off each other and the walls, affected by gravity and
          friction. Use the buttons to add or remove balls.
        </p>
      </div>
    </div>
  );
}
