"use client";

import { useEffect, useRef } from "react";

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
const RESTITUTION = 0.85;
const BALL_COUNT = 10;

function getRandomColor(): string {
  const colors = [
    "#ef4444", // red
    "#f97316", // orange
    "#eab308", // yellow
    "#22c55e", // green
    "#06b6d4", // cyan
    "#3b82f6", // blue
    "#8b5cf6", // violet
    "#ec4899", // pink
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
    mass: radius * radius, // Mass proportional to area
  };
}

function checkBallCollision(ball1: Ball, ball2: Ball): boolean {
  const dx = ball2.x - ball1.x;
  const dy = ball2.y - ball1.y;
  const distance = Math.sqrt(dx * dx + dy * dy);
  return distance < ball1.radius + ball2.radius;
}

function resolveBallCollision(ball1: Ball, ball2: Ball): void {
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
  if (dvn < 0) return;

  // Calculate impulse
  const impulse = (2 * dvn) / (ball1.mass + ball2.mass);

  // Apply impulse
  ball1.vx -= impulse * ball2.mass * nx * RESTITUTION;
  ball1.vy -= impulse * ball2.mass * ny * RESTITUTION;
  ball2.vx += impulse * ball1.mass * nx * RESTITUTION;
  ball2.vy += impulse * ball1.mass * ny * RESTITUTION;

  // Separate overlapping balls
  const overlap = ball1.radius + ball2.radius - distance;
  if (overlap > 0) {
    const separation = overlap / 2 + 1;
    ball1.x -= nx * separation;
    ball1.y -= ny * separation;
    ball2.x += nx * separation;
    ball2.y += ny * separation;
  }
}

function updateBalls(balls: Ball[], width: number, height: number): void {
  // Update each ball
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
      ball.vx *= -RESTITUTION;
    }
    // Left wall
    if (ball.x - ball.radius < 0) {
      ball.x = ball.radius;
      ball.vx *= -RESTITUTION;
    }
    // Bottom wall
    if (ball.y + ball.radius > height) {
      ball.y = height - ball.radius;
      ball.vy *= -RESTITUTION;
    }
    // Top wall
    if (ball.y - ball.radius < 0) {
      ball.y = ball.radius;
      ball.vy *= -RESTITUTION;
    }
  }

  // Ball-to-ball collisions
  for (let i = 0; i < balls.length; i++) {
    for (let j = i + 1; j < balls.length; j++) {
      if (checkBallCollision(balls[i], balls[j])) {
        resolveBallCollision(balls[i], balls[j]);
      }
    }
  }
}

function drawBalls(ctx: CanvasRenderingContext2D, balls: Ball[]): void {
  for (const ball of balls) {
    // Draw ball shadow
    ctx.beginPath();
    ctx.arc(ball.x + 3, ball.y + 3, ball.radius, 0, Math.PI * 2);
    ctx.fillStyle = "rgba(0, 0, 0, 0.2)";
    ctx.fill();
    ctx.closePath();

    // Draw ball
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
    ctx.fillStyle = ball.color;
    ctx.fill();
    ctx.closePath();

    // Draw highlight
    ctx.beginPath();
    ctx.arc(
      ball.x - ball.radius * 0.3,
      ball.y - ball.radius * 0.3,
      ball.radius * 0.2,
      0,
      Math.PI * 2
    );
    ctx.fillStyle = "rgba(255, 255, 255, 0.5)";
    ctx.fill();
    ctx.closePath();
  }
}

export default function BouncingBalls() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const ballsRef = useRef<Ball[]>([]);
  const animationRef = useRef<number>(0);

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
    
    // Initialize balls
    ballsRef.current = Array.from({ length: BALL_COUNT }, () =>
      createBall(canvas.width, canvas.height)
    );

    const animate = () => {
      if (!ctx || !canvas) return;

      // Clear canvas
      ctx.fillStyle = "#0f172a";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Update and draw
      updateBalls(ballsRef.current, canvas.width, canvas.height);
      drawBalls(ctx, ballsRef.current);

      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    window.addEventListener("resize", resizeCanvas);

    return () => {
      cancelAnimationFrame(animationRef.current);
      window.removeEventListener("resize", resizeCanvas);
    };
  }, []);

  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const radius = 15 + Math.random() * 25;
    const newBall: Ball = {
      x,
      y,
      vx: (Math.random() - 0.5) * 10,
      vy: (Math.random() - 0.5) * 5,
      radius,
      color: getRandomColor(),
      mass: radius * radius,
    };

    ballsRef.current.push(newBall);
  };

  return (
    <div className="relative w-screen h-screen overflow-hidden">
      <canvas
        ref={canvasRef}
        onClick={handleCanvasClick}
        className="block cursor-pointer"
      />
      <div className="absolute top-4 left-4 text-white bg-black/50 px-4 py-2 rounded-lg">
        <h1 className="text-xl font-bold mb-1">2D Bouncing Balls</h1>
        <p className="text-sm text-zinc-300">Click anywhere to add more balls</p>
      </div>
    </div>
  );
}
