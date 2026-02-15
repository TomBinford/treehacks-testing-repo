"use client";

import { useEffect, useRef, useCallback } from "react";

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
const FRICTION = 0.99;
const BOUNCE_DAMPING = 0.8;
const BALL_COUNT = 10;

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
    color: getRandomColor(),
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

  // Relative velocity in collision normal direction
  const dvn = dvx * nx + dvy * ny;

  // Do not resolve if velocities are separating
  if (dvn > 0) return;

  // Calculate impulse scalar
  const restitution = BOUNCE_DAMPING;
  const impulse =
    (-(1 + restitution) * dvn) / (1 / ball1.mass + 1 / ball2.mass);

  // Apply impulse
  ball1.vx += (impulse * nx) / ball1.mass;
  ball1.vy += (impulse * ny) / ball1.mass;
  ball2.vx -= (impulse * nx) / ball2.mass;
  ball2.vy -= (impulse * ny) / ball2.mass;

  // Separate overlapping balls
  const overlap = ball1.radius + ball2.radius - distance;
  if (overlap > 0) {
    const separationX = (overlap * nx) / 2;
    const separationY = (overlap * ny) / 2;
    ball1.x -= separationX;
    ball1.y -= separationY;
    ball2.x += separationX;
    ball2.y += separationY;
  }
}

export default function BouncingBallsPage() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const ballsRef = useRef<Ball[]>([]);
  const animationRef = useRef<number>(0);

  const initializeBalls = useCallback((width: number, height: number) => {
    ballsRef.current = [];
    for (let i = 0; i < BALL_COUNT; i++) {
      ballsRef.current.push(createBall(width, height));
    }
  }, []);

  const updateBalls = useCallback((width: number, height: number) => {
    const balls = ballsRef.current;

    for (const ball of balls) {
      // Apply gravity
      ball.vy += GRAVITY;

      // Apply friction
      ball.vx *= FRICTION;
      ball.vy *= FRICTION;

      // Update position
      ball.x += ball.vx;
      ball.y += ball.vy;

      // Wall collisions
      // Right wall
      if (ball.x + ball.radius > width) {
        ball.x = width - ball.radius;
        ball.vx *= -BOUNCE_DAMPING;
      }
      // Left wall
      if (ball.x - ball.radius < 0) {
        ball.x = ball.radius;
        ball.vx *= -BOUNCE_DAMPING;
      }
      // Bottom wall
      if (ball.y + ball.radius > height) {
        ball.y = height - ball.radius;
        ball.vy *= -BOUNCE_DAMPING;

        // Stop tiny bounces
        if (Math.abs(ball.vy) < 0.5) {
          ball.vy = 0;
        }
      }
      // Top wall
      if (ball.y - ball.radius < 0) {
        ball.y = ball.radius;
        ball.vy *= -BOUNCE_DAMPING;
      }
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

      // Draw ball
      ctx.beginPath();
      ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
      ctx.fillStyle = ball.color;
      ctx.fill();

      // Draw highlight
      ctx.beginPath();
      ctx.arc(
        ball.x - ball.radius * 0.3,
        ball.y - ball.radius * 0.3,
        ball.radius * 0.2,
        0,
        Math.PI * 2
      );
      ctx.fillStyle = "rgba(255, 255, 255, 0.6)";
      ctx.fill();
    }
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      if (ballsRef.current.length === 0) {
        initializeBalls(canvas.width, canvas.height);
      }
    };

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw background gradient
      const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
      gradient.addColorStop(0, "#1a1a2e");
      gradient.addColorStop(1, "#16213e");
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      updateBalls(canvas.width, canvas.height);
      drawBalls(ctx);

      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      cancelAnimationFrame(animationRef.current);
    };
  }, [initializeBalls, updateBalls, drawBalls]);

  const handleReset = () => {
    const canvas = canvasRef.current;
    if (canvas) {
      initializeBalls(canvas.width, canvas.height);
    }
  };

  const handleAddBall = () => {
    const canvas = canvasRef.current;
    if (canvas) {
      ballsRef.current.push(createBall(canvas.width, canvas.height));
    }
  };

  return (
    <div className="relative w-full h-screen overflow-hidden">
      <canvas ref={canvasRef} className="block" />
      <div className="absolute top-4 left-4 flex flex-col gap-2">
        <h1 className="text-white text-2xl font-bold mb-2 drop-shadow-lg">
          2D Bouncing Ball Simulation
        </h1>
        <p className="text-white/70 text-sm mb-4 drop-shadow">
          Balls bounce off walls and each other with gravity
        </p>
        <div className="flex gap-2">
          <button
            onClick={handleReset}
            className="px-4 py-2 bg-white/20 hover:bg-white/30 text-white rounded-lg backdrop-blur-sm transition-colors"
          >
            Reset
          </button>
          <button
            onClick={handleAddBall}
            className="px-4 py-2 bg-white/20 hover:bg-white/30 text-white rounded-lg backdrop-blur-sm transition-colors"
          >
            Add Ball
          </button>
        </div>
      </div>
    </div>
  );
}
