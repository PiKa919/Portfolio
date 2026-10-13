"use client";

import React, {
  useState,
  useEffect,
  useRef,
  ReactNode,
  useCallback,
} from "react";
import { motion, useInView } from "framer-motion";

export interface SoundPackConfig {
  defines: Record<string, [number, number]>;
}

const CHAR_MAPPING: Record<string, string> = {
  a: "30", b: "48", c: "46", d: "32", e: "18", f: "33", g: "34", h: "35", i: "24", j: "36", k: "37", l: "38", m: "50", n: "49", o: "25", p: "26", q: "16", r: "19", s: "31", t: "20", u: "23", v: "47", w: "17", x: "45", y: "22", z: "44",
  "0": "11", "1": "2", "2": "3", "3": "4", "4": "5", "5": "6", "6": "7", "7": "8", "8": "9", "9": "10",
  " ": "57",
  Backspace: "14",
  ".": "51", ",": "39", ";": "39", "'": "40", "[": "26", "]": "27", "\\": "43", "/": "52", "-": "12", "=": "13",
  default: "30",
};

let sharedAudioContext: AudioContext | null = null;

export interface CommandEntry {
  cmd: string;
  output?: ReactNode | ReactNode[];
  outputDelay?: number;
  typeSpeed?: number;
}

interface TerminalProps {
  children?: ReactNode;
  height?: string | number;
  width?: string | number;
  className?: string;
  commands?: string[] | CommandEntry[];
  delay?: number;
  typeSpeed?: number;
  enableSound?: boolean;
  soundUrl?: string;
  soundConfigUrl?: string;
  cursorStyle?: "line" | "block" | "underscore";
  smoothBlink?: boolean;
  loop?: boolean;
  loopDelay?: number;
  backgroundImage?: string;
  backgroundBlur?: number;
  backgroundOpacity?: number;
}

interface TypingAnimationProps {
  children: string;
  delay?: number;
  typeSpeed?: number;
  className?: string;
  playSound?: (char: string, timeOffset?: number) => void;
  cursorStyle?: "line" | "block" | "underscore";
  smoothBlink?: boolean;
}

interface AnimatedSpanProps {
  children: ReactNode;
  delay?: number;
  className?: string;
}

export function Cursor({
  blink = true,
  cursorStyle = "line",
  smoothBlink = false,
  colorClass = "",
}: {
  blink?: boolean;
  cursorStyle?: "line" | "block" | "underscore";
  smoothBlink?: boolean;
  colorClass?: string;
}) {
  const styles = {
    line: { width: "0.1em", height: "1.1em", borderRadius: "10px", verticalAlign: "text-bottom" },
    block: { width: "0.45em", height: "1.1em", borderRadius: "2px", verticalAlign: "text-bottom" },
    underscore: { width: "0.6em", height: "2px", borderRadius: "1px", verticalAlign: "bottom" },
  };

  const currentStyle = styles[cursorStyle];

  return (
    <motion.span
      layout
      aria-hidden
      className={colorClass}
      initial={{ opacity: 1 }}
      animate={{ opacity: blink ? (smoothBlink ? [1, 0, 1] : [1, 1, 0, 0]) : 1 }}
      transition={{
        // @ts-ignore
        opacity: blink
          ? {
            duration: smoothBlink ? 1.2 : 0.8,
            repeat: Infinity,
            ease: smoothBlink ? "easeInOut" : "linear",
            times: smoothBlink ? undefined : [0, 0.5, 0.5, 1],
          }
          : { duration: 0.1 },
        layout: {
          type: "spring",
          bounce: 0,
          duration: 0.15,
        }
      }}
      style={{
        display: "inline-block",
        background: "currentColor",
        marginLeft: "2px",
        ...currentStyle,
      }}
    />
  );
}

export function TypingAnimation({
  children,
  delay = 0,
  typeSpeed = 55,
  className = "",
  playSound,
  cursorStyle = "line",
  smoothBlink = false,
}: TypingAnimationProps) {
  const [displayed, setDisplayed] = useState("");
  const [phase, setPhase] = useState<"waiting" | "typing" | "done">("waiting");
  const timeouts = useRef<ReturnType<typeof setTimeout>[]>([]);
  const rafId = useRef<number | null>(null);

  useEffect(() => {
    const clear = () => {
      timeouts.current.forEach(clearTimeout);
      if (rafId.current !== null) cancelAnimationFrame(rafId.current);
    };

    const startDelay = setTimeout(() => {
      setPhase("typing");
      let i = 0;
      const startTime = Date.now();
      let lastFrameTime = startTime;

      const tick = () => {
        const now = Date.now();
        const elapsed = now - startTime;
        const delta = now - lastFrameTime;
        lastFrameTime = now;

        const nextI = Math.min(children.length, Math.floor(elapsed / typeSpeed) + 1);

        if (nextI > i) {
          if (delta > 100) {
            playSound?.(children[nextI - 1]);
          } else {
            for (let j = i; j < nextI; j++) {
              const offset = (j - i) * (typeSpeed / 1000);
              playSound?.(children[j], offset);
            }
          }
          i = nextI;
          setDisplayed(children.slice(0, i));
        }

        if (i < children.length) {
          rafId.current = requestAnimationFrame(tick);
        } else {
          setPhase("done");
        }
      };

      rafId.current = requestAnimationFrame(tick);
    }, delay);

    timeouts.current.push(startDelay);
    return clear;
  }, [children, delay, typeSpeed, playSound]);

  if (phase === "waiting") return null;

  return (
    <div className={`flex items-center gap-2 font-mono text-sm leading-relaxed ${className}`}>
      <span className="text-emerald-400 font-bold select-none">➜</span>
      <span className="text-sky-400 font-semibold select-none">~</span>

      <span className="flex-1 break-all relative font-fira-code">
        {displayed}
        {phase === "typing" && (
          <Cursor cursorStyle={cursorStyle} smoothBlink={smoothBlink} blink={true} />
        )}
      </span>
    </div>
  );
}

export function AnimatedSpan({
  children,
  delay = 0,
  className = "",
}: AnimatedSpanProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), delay);
    return () => clearTimeout(t);
  }, [delay]);

  if (!visible) return null;

  return (

    <div className={`font-fira-code text-sm pl-6 leading-relaxed  ${className}`}>
      {children}
    </div>
  );
}

function normalizeCommands(commands: string[] | CommandEntry[]): CommandEntry[] {
  return commands.map((c) =>
    typeof c === "string" ? { cmd: c } : c
  );
}

export function Terminal({
  children,
  height = "26rem",
  width = "36rem",
  className = "",
  commands,
  delay = 0,
  typeSpeed = 55,
  enableSound = false,
  soundUrl = "/static/sound/brown_cherry/sound.ogg",
  soundConfigUrl = "/static/sound/brown_cherry/config.json",
  cursorStyle = "line",
  smoothBlink = false,
  loop = false,
  loopDelay = 2000,
  backgroundImage,
  backgroundBlur = 8,
  backgroundOpacity = 0.25,
}: TerminalProps) {
  const [iteration, setIteration] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(wrapperRef, { once: true, margin: "-10px" });

  const [audioLoaded, setAudioLoaded] = useState(!enableSound);
  const soundEnabledRef = useRef(enableSound);
  const soundRef = useRef<{ buffer: AudioBuffer | null; config: SoundPackConfig | null }>({ buffer: null, config: null });

  useEffect(() => {
    soundEnabledRef.current = enableSound;
  }, [enableSound]);

  useEffect(() => {
    if (!enableSound || !soundUrl || !soundConfigUrl) {
      soundRef.current = { buffer: null, config: null };
      setAudioLoaded(true);
      return;
    }

    let cancelled = false;

    const initAudio = async () => {
      try {
        if (!sharedAudioContext) {
          sharedAudioContext = new (window.AudioContext ||
            (window as unknown as { webkitAudioContext?: typeof AudioContext })
              .webkitAudioContext)();
        }

        const [soundRes, configRes] = await Promise.all([
          fetch(soundUrl),
          fetch(soundConfigUrl),
        ]);

        if (!soundRes.ok || !configRes.ok) throw new Error("Failed to load audio files");

        const config = (await configRes.json()) as SoundPackConfig;
        const arrayBuffer = await soundRes.arrayBuffer();

        const buffer = await sharedAudioContext.decodeAudioData(arrayBuffer);

        if (cancelled) return;
        soundRef.current = { buffer, config };
      } catch (err) {
        console.error("Failed to load terminal sound pack:", err);
      } finally {
        if (!cancelled) setAudioLoaded(true);
      }
    };

    initAudio();

    return () => {
      cancelled = true;
      soundRef.current = { buffer: null, config: null };
    };
  }, [enableSound, soundUrl, soundConfigUrl]);

  const unlockAudioContext = useCallback(() => {
    if (!enableSound || !sharedAudioContext) return;
    if (sharedAudioContext.state === "suspended") {
      void sharedAudioContext.resume().catch(() => { });
    }
  }, [enableSound]);

  useEffect(() => {
    if (!enableSound) return;
    window.addEventListener("pointerdown", unlockAudioContext);
    window.addEventListener("keydown", unlockAudioContext);
    return () => {
      window.removeEventListener("pointerdown", unlockAudioContext);
      window.removeEventListener("keydown", unlockAudioContext);
    };
  }, [enableSound, unlockAudioContext]);

  const playSound = useCallback((char: string, timeOffset: number = 0) => {
    if (!soundEnabledRef.current) return;
    const ctx = sharedAudioContext;
    if (!ctx) return;

    if (ctx.state !== "running") return;

    const { buffer, config } = soundRef.current;
    if (!buffer || !config) return;

    const lowerChar = char.toLowerCase();
    let keyIndex = CHAR_MAPPING[char === "Backspace" ? "Backspace" : lowerChar];
    if (!keyIndex) keyIndex = CHAR_MAPPING.default;

    const soundData = config.defines[keyIndex];
    if (!soundData) return;

    const [startTime, duration] = soundData;
    const source = ctx.createBufferSource();
    source.buffer = buffer;
    const gainNode = ctx.createGain();
    gainNode.gain.value = 0.5;
    source.connect(gainNode);
    gainNode.connect(ctx.destination);
    source.start(ctx.currentTime + timeOffset, startTime / 1000, duration / 1000);
  }, []);

  const entries = commands ? normalizeCommands(commands) : null;

  const toCSS = (val: string | number) =>
    typeof val === "number" ? `${val}px` : val;

  const { delays, totalDuration } = React.useMemo(() => {
    if (!entries || entries.length === 0) return { delays: [], totalDuration: 0 };
    let t = delay;
    const computedDelays = entries.map((e) => {
      const speed = e.typeSpeed ?? typeSpeed;
      const typingDuration = e.cmd.length * speed;

      const typingDelay = t;

      const outputs = Array.isArray(e.output) ? e.output : (e.output != null ? [e.output] : []);
      const outputDelayStart = typingDelay + typingDuration + (e.outputDelay ?? 200);

      const outputDelays = outputs.map((_, idx) => outputDelayStart + (idx * 200));

      if (outputs.length > 0) {
        t = outputDelays[outputDelays.length - 1] + 400;
      } else {
        t = typingDelay + typingDuration + 400;
      }

      return {
        typingDelay,
        outputDelays,
      };
    });
    return { delays: computedDelays, totalDuration: t };
  }, [entries, delay, typeSpeed]);

  useEffect(() => {
    if (loop && totalDuration > 0) {
      const timeoutId = setTimeout(() => {
        setIteration((i) => i + 1);
      }, totalDuration + loopDelay);
      return () => clearTimeout(timeoutId);
    }
  }, [loop, loopDelay, totalDuration, iteration]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  });

  let renderedContent;
  if (entries) {
    if (audioLoaded && isInView) {
      renderedContent = (
        <React.Fragment key={iteration}>
          {entries.map((entry, i) => {
            const speed = entry.typeSpeed ?? typeSpeed;
            const { typingDelay, outputDelays } = delays[i] ?? { typingDelay: 0, outputDelays: [] };
            const outputs = Array.isArray(entry.output) ? entry.output : (entry.output != null ? [entry.output] : []);

            return (
              <React.Fragment key={i}>
                <TypingAnimation
                  delay={typingDelay}
                  typeSpeed={speed}
                  className="min-h-6"
                  playSound={playSound}
                  cursorStyle={cursorStyle}
                  smoothBlink={smoothBlink}
                >
                  {entry.cmd}
                </TypingAnimation>
                {outputs.map((out, j) => (
                  <AnimatedSpan key={j} delay={outputDelays[j]} className="min-h-6">
                    {out}
                  </AnimatedSpan>
                ))}
              </React.Fragment>
            );
          })}
        </React.Fragment>
      );
    } else {
      renderedContent = null;
    }
  } else {
    renderedContent = children;
  }

  const bgInset = -Math.abs(backgroundBlur);

  return (
    <motion.div
      ref={wrapperRef}
      initial={{ opacity: 0, y: 20, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      style={{ width: toCSS(width) }}
      className={`rounded-xl border overflow-hidden text-gray-950 border-[#d0d7de] dark:text-gray-200 dark:border-[#30363d] ${className}`}
    >
      <div
        className="flex items-center justify-between px-4 py-3 border-b border-[#d0d7de] dark:border-[#30363d]"
      >
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-red-500" />
          <div className="w-3 h-3 rounded-full bg-amber-500" />
          <div className="w-3 h-3 rounded-full bg-green-500" />
        </div>

        <span className="text-xs font-medium tracking-wide text-gray-700 dark:text-gray-400">
          bash - terminal
        </span>

        <div className="w-16" />
      </div>

      <div className="relative overflow-hidden" style={{ height: toCSS(height) }}>
        {backgroundImage && (
          <>
            <div
              aria-hidden
              className="absolute pointer-events-none bg-cover bg-bottom bg-no-repeat"
              style={{
                inset: bgInset,
                backgroundImage: `url(${backgroundImage})`,
                filter: backgroundBlur ? `blur(${backgroundBlur}px)` : undefined,
                opacity: backgroundOpacity,
              }}
            />
            <div
              aria-hidden
              className="absolute inset-0 pointer-events-none bg-white/70 dark:bg-black/60"
            />
          </>
        )}

        <div
          ref={scrollRef}
          className="relative z-10 h-full overflow-y-auto p-4 space-y-1 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] scrollbar-none"
          style={{ fontFamily: "'SF Mono', SFMono-Regular, ui-monospace, Menlo, monospace" }}
        >
          {renderedContent}
        </div>
      </div>
    </motion.div>
  );
}

export default Terminal;