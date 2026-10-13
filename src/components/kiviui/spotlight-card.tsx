"use client";

import React from "react";
import { motion, useMotionTemplate, useMotionValue } from "framer-motion";
export interface SpotlightCardProps extends React.ComponentProps<"div"> {
  spotlightColor?: string;
  children?: React.ReactNode;
}

export function SpotlightCard({
  spotlightColor = "183, 166, 255",
  children,
  className,
  style,
  ...props
}: SpotlightCardProps) {
  const spotlightX = useMotionValue(0);
  const spotlightY = useMotionValue(0);
  const backgroundImage = useMotionTemplate`radial-gradient(300px circle at ${spotlightX}px ${spotlightY}px, rgba(${spotlightColor}, 0.15), transparent)`;
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const { left, top } = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - left;
    const y = e.clientY - top;
    spotlightX.set(x);
    spotlightY.set(y);
  };
  return (
    <div
      className={`group relative overflow-hidden ${className ?? ""}`}
      style={style}
      onMouseMove={handleMouseMove}
      {...props}
    >
      <motion.div
        className="pointer-events-none absolute -inset-px rounded-xl opacity-0 transition duration-300 group-hover:opacity-100 group-focus-within:opacity-100"
        style={{ backgroundImage }}
      />
      {children}
    </div>
  );
}

export default SpotlightCard;
