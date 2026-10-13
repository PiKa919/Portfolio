"use client";

import { motion, type HTMLMotionProps } from "framer-motion";

export interface AnimatedButtonProps extends Omit<HTMLMotionProps<"a">, "children" | "href"> {
  text: string;
  hoverText: string;
  className?: string;
  href: string;
}

export function AnimatedButton({ text, hoverText, className = "", href, ...props }: AnimatedButtonProps) {
  return <motion.a href={href} className={`kivi-animated-button group relative inline-flex overflow-hidden rounded-full px-6 py-3 font-medium ${className}`} initial="initial" whileHover="hover" whileTap={{ scale: 0.98 }} {...props}>
    <span className="invisible block" aria-hidden="true">{text.length > hoverText.length ? text : hoverText}</span>
    <motion.span className="absolute inset-0 flex items-center justify-center" variants={{ initial: { y: 0, opacity: 1, filter: "blur(0px)" }, hover: { y: "-100%", opacity: 0, filter: "blur(4px)", transition: { duration: 0.3, ease: [0.23, 1, 0.32, 1] } } }}>{text}</motion.span>
    <motion.span className="absolute inset-0 flex items-center justify-center" variants={{ initial: { y: "100%", opacity: 0, filter: "blur(4px)" }, hover: { y: 0, opacity: 1, filter: "blur(0px)", transition: { duration: 0.3, ease: [0.23, 1, 0.32, 1] } } }}>{hoverText}</motion.span>
  </motion.a>;
}

export default AnimatedButton;
