"use client";

import { useReducedMotion } from "framer-motion";
import { Terminal, type CommandEntry } from "@/components/kiviui/terminal";

const flow: CommandEntry[] = [
  { cmd: "document batch received", output: <span className="terminal-good">durable job record created</span>, outputDelay: 120 },
  { cmd: "isolated inference completed", output: <span className="terminal-good">versioned detections ready for comparison</span>, outputDelay: 120 },
  { cmd: "frozen evaluation checked", output: <span className="terminal-accent">release decision: review required</span>, outputDelay: 120 },
];

export function ForgeSightTerminal() {
  const reducedMotion = useReducedMotion();
  return <Terminal className="portfolio-terminal" height={230} width="100%" commands={flow} delay={120} typeSpeed={reducedMotion ? 0 : 13} enableSound={false} cursorStyle="underscore" />;
}
