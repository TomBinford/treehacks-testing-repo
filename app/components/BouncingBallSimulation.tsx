'use client';

import { useRef, useEffect, useState, useCallback } from 'react';

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
const BOUNCE_DAMPING = 0.8;

const generateRandomColor = (): string => {
  const colors = [
    '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7',
    '#DDA0DD', '#98D8C8', '#F7DC6F', '#BB8FCE', '#85C1E9'
  ];
  return colors[Math.floor(Math.random() * colors.length)];
};

export default function BouncingBallSimulation() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const ballsRef = useRef<Ball[]>([]);
  const animationRef = useRef<number>(0);
  const nextIdRef = useRef<number>(1);
  const [ballCount, setBallCount] = useState(0);

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
      color: generateRandomColor(),
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

  const clearAllBalls = useCallback(() => {
    ballsRef.current = [];
    setBallCount(0);
  }, []);

  const handleCanvasClick = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    addBall(x, y);
  }, [addBall]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resizeCanvas = () => {
      const container = canvas.parentElement;
      if (container) {
        canvas.width = container.clientWidth;
        canvas.height = container.clientHeight;
      }
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

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
      }
    };

    const drawBall = (ball: Ball) => {
      ctx.beginPath();
      ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
      ctx.fillStyle = ball.color;
      ctx.fill();
      ctx.closePath();

      // Add a subtle shadow/3D effect
      ctx.beginPath();
      ctx.arc(ball.x - ball.radius * 0.3, ball.y - ball.radius * 0.3, ball.radius * 0.2, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
      ctx.fill();
      ctx.closePath();
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw background grid
      ctx.strokeStyle = 'rgba(100, 100, 100, 0.1)';
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

      // Update and draw all balls
      for (const ball of ballsRef.current) {
        updateBall(ball);
        drawBall(ball);
      }

      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      cancelAnimationFrame(animationRef.current);
    };
  }, []);

  return (
    <div className="flex flex-col h-screen w-full bg-gray-900">
      <header className="flex items-center justify-between p-4 bg-gray-800 shadow-lg">
        <h1 className="text-2xl font-bold text-white">Bouncing Ball Simulation</h1>
        <div className="flex items-center gap-4">
          <span className="text-gray-300">Balls: {ballCount}</span>
          <button
            onClick={() => addBall()}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
          >
            Add Ball
          </button>
          <button
            onClick={removeBall}
            disabled={ballCount === 0}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Remove Ball
          </button>
          <button
            onClick={clearAllBalls}
            disabled={ballCount === 0}
            className="px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Clear All
          </button>
        </div>
      </header>
      <div className="flex-1 relative">
        <canvas
          ref={canvasRef}
          onClick={handleCanvasClick}
          className="absolute inset-0 cursor-crosshair"
        />
        {ballCount === 0 && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <p className="text-gray-500 text-lg">Click anywhere to add a ball, or use the buttons above</p>
          </div>
        )}
      </div>
    </div>
  );
}
