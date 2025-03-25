"use client"

import { motion } from "framer-motion"

function FloatingPaths({ position }: { position: number }) {
  const paths = Array.from({ length: 36 }, (_, i) => ({
    id: i,
    d: `M-${380 - i * 5 * position} -${189 + i * 6}C-${
      380 - i * 5 * position
    } -${189 + i * 6} -${312 - i * 5 * position} ${216 - i * 6} ${
      152 - i * 5 * position
    } ${343 - i * 6}C${616 - i * 5 * position} ${470 - i * 6} ${
      684 - i * 5 * position
    } ${875 - i * 6} ${684 - i * 5 * position} ${875 - i * 6}`,
    width: 0.5 + i * 0.03,
    color:
      i % 5 === 0
        ? "rgba(147, 51, 234, 0.5)"
        : // Purple
          i % 4 === 0
          ? "rgba(59, 130, 246, 0.5)"
          : // Blue
            i % 3 === 0
            ? "rgba(236, 72, 153, 0.5)"
            : // Pink
              i % 2 === 0
              ? "rgba(16, 185, 129, 0.5)"
              : // Green
                "rgba(255, 255, 255, 0.5)", // White
  }))

  return (
    <div className="absolute inset-0 w-full h-full">
      <svg className="w-full h-full" viewBox="0 0 696 316" fill="none" preserveAspectRatio="xMidYMid slice">
        <title>Zuzia RodzeN</title>
        <link rel="icon" href="https://api.zuzia.dev/v1/images?name=zuziarodzen-logo.png" />
        {paths.map((path) => (
          <motion.path
            key={path.id}
            d={path.d}
            stroke={path.color}
            strokeWidth={path.width}
            strokeOpacity={0.1 + path.id * 0.01}
            initial={{ pathLength: 0.3, opacity: 0.6 }}
            animate={{
              pathLength: 1,
              opacity: [0.3, 0.6, 0.3],
              pathOffset: [0, 1, 0],
            }}
            transition={{
              duration: 20 + Math.random() * 10,
              repeat: Number.POSITIVE_INFINITY,
              ease: "linear",
            }}
          />
        ))}
      </svg>
    </div>
  )
}

export default function BackgroundPaths() {
  return (
    <div className="fixed inset-0 w-full h-full min-h-screen overflow-hidden z-0 pointer-events-none">
      <div className="absolute inset-0">
        <FloatingPaths position={1} />
        <FloatingPaths position={-1} />
      </div>
    </div>
  )
}

