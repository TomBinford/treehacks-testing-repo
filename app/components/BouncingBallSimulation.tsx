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

const GRAVITY = 0.5;
const FRICTION = 0.99;
const BOUNCE_DAMPENING = 0.8;

const getRandomColor = (): string => {
  const colors = [
    "#ef4444", // red
    "#f97316", // orange
    "#eab308", // yellow
    "#22c55e", // green
    "#3b82f6", // blue
    "#8b5cf6", // purple
    "#ec4899", // pink
    "#14b8a6", // teal
  ];
  return colors[Math.floor(Math.random() * colors.length)];
};

export default function BouncingBallSimulation() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [balls, setBalls] = useState<Ball[]>([]);
  const ballsRef = useRef<Ball[]>([]);
  const nextIdRef = useRef(0);
  const animationRef = useRef<number>(0);

  // Keep ballsRef in sync with balls state
  useEffect(() => {
    ballsRef.current = balls;
  }, [balls]);

  const addBall = useCallback((x?: number, y?: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const newBall: Ball = {
      id: nextIdRef.current++,
      x: x ?? Math.random() * (canvas.width - 60) + 30,
      y: y ?? Math.random() * 100 + 30,
      vx: (Math.random() - 0.5) * 10,
      vy: Math.random() * 5,
      radius: Math.random() * 20 + 15,
      color: getRandomColor(),
    };

    setBalls((prev) => [...prev, newBall]);
  }, []);

  const removeBall = useCallback(() => {
    setBalls((prev) => {
      if (prev.length === 0) return prev;
      return prev.slice(0, -1);
    });
  }, []);

  const clearAllBalls = useCallback(() => {
    setBalls([]);
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

    const resizeCanvas = () => {
      const container = canvas.parentElement;
      if (container) {
        canvas.width = container.clientWidth;
        canvas.height = container.clientHeight;
      }
    };

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    const updatePhysics = () => {
      const currentBalls = ballsRef.current;

      const updatedBalls = currentBalls.map((ball) => {
        let { x, y, vx, vy } = ball;
        const { radius } = ball;

        // Apply gravity
        vy += GRAVITY;

        // Apply friction
        vx *= FRICTION;
        vy *= FRICTION;

        // Update position
        x += vx;
        y += vy;

        // Bounce off walls
        if (x - radius < 0) {
          x = radius;
          vx = -vx * BOUNCE_DAMPENING;
        } else if (x + radius > canvas.width) {
          x = canvas.width - radius;
          vx = -vx * BOUNCE_DAMPENING;
        }

        // Bounce off floor and ceiling
        if (y - radius < 0) {
          y = radius;
          vy = -vy * BOUNCE_DAMPENING;
        } else if (y + radius > canvas.height) {
          y = canvas.height - radius;
          vy = -vy * BOUNCE_DAMPENING;
        }

        return { ...ball, x, y, vx, vy };
      });

      ballsRef.current = updatedBalls;
      setBalls(updatedBalls);
    };

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw background
      ctx.fillStyle = "#1a1a2e";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw grid pattern
      ctx.strokeStyle = "#2a2a4e";
      ctx.lineWidth = 1;
      for (let i = 0; i < canvas.width; i += 50) {
        ctx.beginPath();
        ctx.moveTo(i, 0);
        ctx.lineTo(i, canvas.height);
        ctx.stroke();
      }
      for (let i = 0; i < canvas.height; i += 50) {
        ctx.beginPath();
        ctx.moveTo(0, i);
        ctx.lineTo(canvas.width, i);
        ctx.stroke();
      }

      // Draw balls
      ballsRef.current.forEach((ball) => {
        // Ball shadow
        ctx.beginPath();
        ctx.arc(ball.x + 3, ball.y + 3, ball.radius, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(0, 0, 0, 0.3)";
        ctx.fill();

        // Ball gradient
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

        // Ball body
        ctx.beginPath();
        ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
        ctx.fillStyle = gradient;
        ctx.fill();

        // Ball outline
        ctx.strokeStyle = "rgba(255, 255, 255, 0.3)";
        ctx.lineWidth = 2;
        ctx.stroke();
      });

      updatePhysics();
      animationRef.current = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      cancelAnimationFrame(animationRef.current);
    };
  }, []);

  return (
    <div className="flex flex-col h-screen w-full bg-gray-900">
      {/* Controls */}
      <div className="flex items-center justify-between p-4 bg-gray-800 border-b border-gray-700">
        <div className="flex items-center gap-4">
          <h1 className="text-xl font-bold text-white">Bouncing Ball Simulation</h1>
          <span className="px-3 py-1 bg-gray-700 rounded-full text-sm text-gray-300">
            {balls.length} ball{balls.length !== 1 ? "s" : ""}
          </span>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => addBall()}
            className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors flex items-center gap-2"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
                clipRule="evenodd"
              />
            </svg>
            Add Ball
          </button>
          <button
            onClick={removeBall}
            disabled={balls.length === 0}
            className="px-4 py-2 bg-red-600 hover:bg-red-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white rounded-lg font-medium transition-colors flex items-center gap-2"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
                clipRule="evenodd"
              />
            </svg>
            Remove Ball
          </button>
          <button
            onClick={clearAllBalls}
            disabled={balls.length === 0}
            className="px-4 py-2 bg-gray-600 hover:bg-gray-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white rounded-lg font-medium transition-colors"
          >
            Clear All
          </button>
        </div>
      </div>

      {/* Canvas container */}
      <div className="flex-1 relative">
        <canvas
          ref={canvasRef}
          onClick={handleCanvasClick}
          className="absolute inset-0 cursor-crosshair"
        />
        {balls.length === 0 && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <p className="text-gray-500 text-lg">
              Click anywhere or press &quot;Add Ball&quot; to start
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
