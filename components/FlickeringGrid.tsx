import React, { useRef, useEffect, useCallback } from "react";
import { cn } from "@/lib/utils";

interface FlickeringGridProps {
  squareSize?: number;
  gridGap?: number;
  flickerChance?: number;
  color?: string;
  width?: number;
  height?: number;
  className?: string;
  maxOpacity?: number;
}

export const FlickeringGrid: React.FC<FlickeringGridProps> = ({
  squareSize = 4,
  gridGap = 6,
  flickerChance = 0.3,
  color = "rgb(0, 0, 0)",
  width,
  height,
  className,
  maxOpacity = 0.3,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameId = useRef<number | undefined>(undefined);
  const gridParams = useRef<any>(undefined);
  const context = useRef<CanvasRenderingContext2D | null>(null);
  const isInView = useRef(false);
  const lastTime = useRef(0);

  // Convert color to rgba
  const getComputedColor = useCallback(() => {
    if (color.startsWith("#")) {
      const hex = color.replace(/^#/, "");
      const bigint = Number.parseInt(hex, 16);
      const r = (bigint >> 16) & 255;
      const g = (bigint >> 8) & 255;
      const b = bigint & 255;
      return `rgba(${r}, ${g}, ${b},`;
    }
    return color.replace("rgb", "rgba").replace(")", ",");
  }, [color]);

  function setupCanvas(canvas: HTMLCanvasElement, w: number, h: number) {
    const dpr = window.devicePixelRatio || 1;
    canvas.width = w * dpr;
    canvas.height = h * dpr;
    canvas.style.width = `${w}px`;
    canvas.style.height = `${h}px`;

    const cols = Math.floor(w / (squareSize + gridGap));
    const rows = Math.floor(h / (squareSize + gridGap));
    const squares = new Float32Array(cols * rows);
    for (let i = 0; i < squares.length; i++) {
      squares[i] = Math.random() * maxOpacity;
    }
    return { cols, rows, squares, dpr };
  }

  function updateSquares(squares: Float32Array, deltaTime: number) {
    for (let i = 0; i < squares.length; i++) {
      if (Math.random() < flickerChance * deltaTime) {
        squares[i] = Math.random() * maxOpacity;
      }
    }
  }

  function drawGrid(
    ctx: CanvasRenderingContext2D,
    w: number,
    h: number,
    cols: number,
    rows: number,
    squares: Float32Array,
    dpr: number
  ) {
    ctx.clearRect(0, 0, w, h);
    ctx.fillStyle = "transparent";
    ctx.fillRect(0, 0, w, h);
    for (let i = 0; i < cols; i++) {
      for (let j = 0; j < rows; j++) {
        const opacity = squares[i * rows + j];
        ctx.fillStyle = `${getComputedColor()}${opacity})`;
        ctx.fillRect(
          i * (squareSize + gridGap) * dpr,
          j * (squareSize + gridGap) * dpr,
          squareSize * dpr,
          squareSize * dpr
        );
      }
    }
  }

  // Resize and setup
  const updateCanvasSize = useCallback(() => {
    const w = width || containerRef.current?.clientWidth || 0;
    const h = height || containerRef.current?.clientHeight || 0;
    if (canvasRef.current) {
      gridParams.current = setupCanvas(canvasRef.current, w, h);
    }
  }, [width, height, squareSize, gridGap, maxOpacity]);

  // Animation
  const animate = useCallback(
    (time: number) => {
      if (!isInView.current || !canvasRef.current || !context.current || !gridParams.current) return;
      const deltaTime = (time - lastTime.current) / 1000;
      lastTime.current = time;
      updateSquares(gridParams.current.squares, deltaTime);
      drawGrid(
        context.current,
        canvasRef.current.width,
        canvasRef.current.height,
        gridParams.current.cols,
        gridParams.current.rows,
        gridParams.current.squares,
        gridParams.current.dpr
      );
      animationFrameId.current = requestAnimationFrame(animate);
    },
    [getComputedColor]
  );

  useEffect(() => {
    if (!canvasRef.current) return;
    context.current = canvasRef.current.getContext("2d");
    updateCanvasSize();

    // Resize observer
    const resizeObserver = new window.ResizeObserver(() => {
      updateCanvasSize();
    });
    if (containerRef.current) resizeObserver.observe(containerRef.current);

    // Intersection observer
    const intersectionObserver = new window.IntersectionObserver(
      ([entry]) => {
        isInView.current = entry.isIntersecting;
        if (isInView.current) {
          lastTime.current = performance.now();
          animationFrameId.current = requestAnimationFrame(animate);
        }
      },
      { threshold: 0 }
    );
    if (canvasRef.current) intersectionObserver.observe(canvasRef.current);

    return () => {
      if (animationFrameId.current) cancelAnimationFrame(animationFrameId.current);
      resizeObserver.disconnect();
      intersectionObserver.disconnect();
    };
    // eslint-disable-next-line
  }, [updateCanvasSize, animate]);

  return (
    <div ref={containerRef} className={cn("w-full h-full absolute inset-0 z-0", className)}>
      <canvas
        ref={canvasRef}
        className="pointer-events-none"
        style={{ width: "100%", height: "100%" }}
      />
    </div>
  );
};
