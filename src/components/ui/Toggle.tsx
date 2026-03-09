"use client";

import { motion } from "framer-motion";

interface ToggleProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
  "aria-label"?: string;
}

const TRACK_WIDTH = 52;
const TRACK_HEIGHT = 32;
const THUMB_SIZE = 26;
const PADDING = 3;
const THUMB_OFF = PADDING;
const THUMB_ON = TRACK_WIDTH - THUMB_SIZE - PADDING;

export default function Toggle({
  checked,
  onChange,
  disabled,
  "aria-label": ariaLabel,
}: ToggleProps) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={ariaLabel}
      disabled={disabled}
      onClick={() => onChange(!checked)}
      className="shrink-0 min-w-[44px] min-h-[44px] flex items-center justify-center rounded-full focus:outline-none focus-visible:ring-2 focus-visible:ring-blue focus-visible:ring-offset-2 disabled:opacity-50 -m-2 p-2"
    >
      <motion.span
        className="relative inline-block rounded-full"
        style={{ width: TRACK_WIDTH, height: TRACK_HEIGHT }}
        animate={{
          backgroundColor: checked ? "#1A7BBF" : "#0D2137",
        }}
        transition={{ duration: 0.2 }}
      >
        <motion.span
          className="absolute top-1/2 rounded-full bg-white shadow-sm"
          style={{
            width: THUMB_SIZE,
            height: THUMB_SIZE,
            y: "-50%",
          }}
          animate={{
            left: checked ? THUMB_ON : THUMB_OFF,
          }}
          transition={{
            type: "spring",
            stiffness: 500,
            damping: 35,
          }}
        />
      </motion.span>
    </button>
  );
}
