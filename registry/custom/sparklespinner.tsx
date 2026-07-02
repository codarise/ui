import * as React from "react"

import { cn } from "@/lib/utils"

const GRID_X = [6, 17, 28, 39, 50]
const GRID_Y = [6, 17, 28, 39, 50]

const DELAYS = [
  [0, 2283, 1617, 1466, 31],
  [2106, 296, 1206, 333, 2241],
  [1929, 967, 1238, 1004, 2252],
  [1955, 2517, 1139, 1076, 1362],
  [2132, 920, 1274, 1310, 1019],
]

// Polished, custom SVG spinner pattern inspired by Sparkle effects
function IconPattern({ className, ...props }: React.ComponentProps<"svg">) {
  const backgroundDots = GRID_Y.flatMap((y, row) =>
    GRID_X.map((x, col) => (
      <use key={`bg-${row}-${col}`} href="#b" x={x} y={y} />
    ))
  )

  const sparkleDots = GRID_Y.flatMap((y, row) =>
    GRID_X.map((x, col) => (
      <use
        key={`sparkle-${row}-${col}`}
        className="l"
        href="#l"
        x={x}
        y={y}
        style={{ animationDelay: `${DELAYS[row][col]}ms` }}
      />
    ))
  )

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 56 56"
      role="img"
      aria-label="Sparkle"
      className={className}
      {...props}
    >
      <title>Sparkle</title>
      <desc>Independent dots twinkle on a deterministic loop.</desc>
      <defs>
        <circle id="b" r="2.4" fill="#ffffff" opacity="0.07" />
        <circle id="l" r="3.1" />
      </defs>

      {/* Sparkle grid background */}
      {backgroundDots}

      {/* Sparkle animated highlights */}
      {sparkleDots}

      <style>
        {`
          .l {
            fill: currentColor;
            opacity: 0;
            animation: icon-09-k 2600ms cubic-bezier(0.65, 0, 0.35, 1) infinite both;
          }
          @keyframes icon-09-k {
            0% { opacity: 0.05; }
            40% { opacity: 0.05; }
            50% { opacity: 1; }
            60% { opacity: 0.05; }
            100% { opacity: 0.05; }
          }
          @media (prefers-reduced-motion: reduce) {
            .l { animation: none; opacity: 0.45; }
          }
        `}
      </style>
    </svg>
  )
}

function SparkleSpinner({ className, ...props }: React.ComponentProps<"svg">) {
  return (
    <IconPattern
      role="status"
      aria-label="Loading"
      className={cn("size-4", className)}
      {...props}
    />
  )
}

export { SparkleSpinner }
