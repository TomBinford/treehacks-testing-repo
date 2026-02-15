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
const BOUNCE_DAMPING = 0.8;

function getRandomColor(): string {
  return COLORS[Math.floor(Math.random() * COLORS.length)];
}

function createBall(id: number, canvasWidth: number, canvasHeight: number): Ball {
  const radius = 20 + Math.random() * 30;
  return {
    id,
    x: radius + Math.random() * (canvasWidth - 2 * radius),
    y: radius + Math.random() * (canvasHeight / 2),
    vx: (Math.random() - 0.5) * 10,
    vy: (Math.random() - 0.5) * 5,
    radius,
    color: getRandomColor(),
  };
}

export default function BouncingBalls() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const ballsRef = useRef<Ball[]>([]);
  const nextIdRef = useRef(0);
  const animationRef = useRef<number>(0);
  const [ballCount, setBallCount] = useState(0);

  const addBall = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const newBall = createBall(nextIdRef.current++, canvas.width, canvas.height);
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
      const ball = createBall(nextIdRef.current++, canvas.width, canvas.height);
      ballsRef.current.push(ball);
    }
    setBallCount(ballsRef.current.length);

    const updateBall = (ball: Ball) => {
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

        // Add some random horizontal movement when hitting the floor
        if (Math.abs(ball.vy) < 2) {
          ball.vx += (Math.random() - 0.5) * 2;
        }
      }
    };

    const drawBall = (ball: Ball) => {
      // Draw shadow
      ctx.beginPath();
      ctx.arc(ball.x + 4, ball.y + 4, ball.radius, 0, Math.PI * 2);
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
      gradient.addColorStop(0, "#ffffff");
      gradient.addColorStop(0.3, ball.color);
      gradient.addColorStop(1, ball.color);

      ctx.beginPath();
      ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
      ctx.fillStyle = gradient;
      ctx.fill();

      // Add outline
      ctx.strokeStyle = "rgba(0, 0, 0, 0.3)";
      ctx.lineWidth = 2;
      ctx.stroke();
    };

    const animate = () => {
      // Clear canvas with gradient background
      const bgGradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
      bgGradient.addColorStop(0, "#1a1a2e");
      bgGradient.addColorStop(1, "#16213e");
      ctx.fillStyle = bgGradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Update and draw all balls
      ballsRef.current.forEach((ball) => {
        updateBall(ball);
        drawBall(ball);
      });

      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      cancelAnimationFrame(animationRef.current);
    };
  }, []);

  return (
    <div className="relative w-full h-screen overflow-hidden">
      <canvas ref={canvasRef} className="absolute inset-0" />
      
      {/* Control Panel */}
      <div className="absolute top-4 left-1/2 transform -translate-x-1/2 flex items-center gap-4 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-full px-6 py-3 shadow-lg">
        <button
          onClick={removeBall}
          className="w-10 h-10 flex items-center justify-center bg-red-500 hover:bg-red-600 text-white rounded-full text-2xl font-bold transition-colors shadow-md"
          title="Remove ball"
        >
          −
        </button>
        
        <div className="px-4 py-1 bg-gray-100 dark:bg-gray-700 rounded-full min-w-[80px] text-center">
          <span className="text-lg font-semibold text-gray-800 dark:text-gray-200">
            {ballCount} {ballCount === 1 ? "ball" : "balls"}
          </span>
        </div>
        
        <button
          onClick={addBall}
          className="w-10 h-10 flex items-center justify-center bg-green-500 hover:bg-green-600 text-white rounded-full text-2xl font-bold transition-colors shadow-md"
          title="Add ball"
        >
          +
        </button>
        
        <button
          onClick={clearBalls}
          className="ml-2 px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-full text-sm font-medium transition-colors shadow-md"
          title="Clear all balls"
        >
          Clear
        </button>
      </div>

      {/* Instructions */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-white/70 text-sm text-center">
        Use the buttons above to add or remove bouncing balls
      </div>
    </div>
  );
}
