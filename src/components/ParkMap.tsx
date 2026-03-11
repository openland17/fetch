"use client";

import { motion } from "framer-motion";
import type { Park } from "@/types";

interface ParkMapProps {
  parks: Park[];
  friendCounts: Map<string, number>;
  onMarkerTap: (parkId: string) => void;
  height?: number;
}

const LAT_MIN = -27.52;
const LAT_MAX = -27.40;
const LNG_MIN = 152.93;
const LNG_MAX = 153.17;

function toSvg(lat: number, lng: number): { x: number; y: number } {
  const x = ((lng - LNG_MIN) / (LNG_MAX - LNG_MIN)) * 380 + 10;
  const y = ((lat - LAT_MAX) / (LAT_MIN - LAT_MAX)) * 120 + 10;
  return { x, y };
}

export default function ParkMap({ parks, friendCounts, onMarkerTap, height = 140 }: ParkMapProps) {
  return (
    <div className="mx-4 rounded-xl overflow-hidden relative" style={{ height }}>
      <svg
        viewBox="0 0 400 140"
        className="w-full h-full"
        preserveAspectRatio="xMidYMid slice"
      >
        {/* Background */}
        <rect width="400" height="140" fill="#E8F0F7" />

        {/* River */}
        <path
          d="M0,85 C40,90 80,95 120,80 C160,65 190,55 220,60 C250,65 280,75 310,70 C340,65 370,60 400,65"
          fill="none"
          stroke="#b8d4e8"
          strokeWidth="18"
          strokeLinecap="round"
        />
        <path
          d="M0,85 C40,90 80,95 120,80 C160,65 190,55 220,60 C250,65 280,75 310,70 C340,65 370,60 400,65"
          fill="none"
          stroke="#a3c9e0"
          strokeWidth="8"
          strokeLinecap="round"
        />

        {/* Roads */}
        <line x1="50" y1="0" x2="50" y2="140" stroke="#ddd" strokeWidth="1.5" />
        <line x1="150" y1="0" x2="150" y2="140" stroke="#ddd" strokeWidth="1.5" />
        <line x1="250" y1="0" x2="250" y2="140" stroke="#ddd" strokeWidth="1.5" />
        <line x1="350" y1="0" x2="350" y2="140" stroke="#ddd" strokeWidth="1.5" />
        <line x1="0" y1="35" x2="400" y2="35" stroke="#ddd" strokeWidth="1.5" />
        <line x1="0" y1="105" x2="400" y2="105" stroke="#ddd" strokeWidth="1.5" />

        {/* Green park areas */}
        {parks.slice(0, 6).map((park) => {
          const { x, y } = toSvg(park.latitude, park.longitude);
          return (
            <circle
              key={`area-${park.id}`}
              cx={x}
              cy={y}
              r="14"
              fill="#d4edda"
              opacity="0.5"
            />
          );
        })}
      </svg>

      {/* Park markers as HTML for Framer Motion */}
      {parks.map((park) => {
        const { x, y } = toSvg(park.latitude, park.longitude);
        const hasFriends = (friendCounts.get(park.id) ?? 0) > 0;
        const pctX = (x / 400) * 100;
        const pctY = (y / 140) * 100;

        return (
          <motion.button
            key={park.id}
            type="button"
            className="absolute w-9 h-9 rounded-full flex items-center justify-center text-white text-[11px] font-bold shadow-md border-2 border-white"
            style={{
              left: `${pctX}%`,
              top: `${pctY}%`,
              transform: "translate(-50%, -50%)",
              backgroundColor: hasFriends ? "#E8913A" : "#1A7BBF",
            }}
            whileTap={{ scale: 0.85 }}
            onClick={() => onMarkerTap(park.id)}
          >
            {park.activeDogs?.length ?? park.activeDogCount}
          </motion.button>
        );
      })}
    </div>
  );
}
