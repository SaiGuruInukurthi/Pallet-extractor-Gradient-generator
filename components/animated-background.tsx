"use client"

import {
  Palette,
  Layers,
  Grid3X3,
  PenTool,
  Compass,
  Ruler,
  Droplet as Eyedropper,
  Type,
  Frame,
  Component,
} from "lucide-react"

export function AnimatedBackground() {
  // Design icons with GitHub color palette
  const designIcons = [
    { Icon: Palette, color: "#1f6feb", size: 24, delay: 0 },
    { Icon: Layers, color: "#8b5cf6", size: 20, delay: 2 },
    { Icon: Grid3X3, color: "#6e7681", size: 18, delay: 4 },
    { Icon: PenTool, color: "#1f6feb", size: 22, delay: 6 },
    { Icon: Compass, color: "#8b5cf6", size: 26, delay: 8 },
    { Icon: Ruler, color: "#6e7681", size: 20, delay: 10 },
    { Icon: Eyedropper, color: "#1f6feb", size: 24, delay: 12 },
    { Icon: Type, color: "#8b5cf6", size: 18, delay: 14 },
    { Icon: Frame, color: "#6e7681", size: 22, delay: 16 },
    { Icon: Component, color: "#1f6feb", size: 20, delay: 18 },
    { Icon: Palette, color: "#ffffff40", size: 16, delay: 3 },
    { Icon: Layers, color: "#ffffff30", size: 28, delay: 7 },
    { Icon: Grid3X3, color: "#8b5cf6", size: 24, delay: 11 },
    { Icon: PenTool, color: "#ffffff35", size: 18, delay: 15 },
    { Icon: Compass, color: "#6e7681", size: 20, delay: 1 },
  ]

  return (
    <div className="fixed inset-0 -z-10 overflow-hidden">
      {/* GitHub dark theme gradient background */}
      <div
        className="absolute inset-0"
        style={{
          background: "linear-gradient(135deg, #0d1117 0%, #161b22 50%, #21262d 100%)",
        }}
      />

      {/* Floating design icons */}
      {designIcons.map((item, index) => {
        const { Icon, color, size, delay } = item

        return (
          <div
            key={index}
            className="absolute opacity-30 hover:opacity-50 transition-opacity duration-300"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              color: color,
              animationDelay: `${delay}s`,
              animationDuration: `${15 + Math.random() * 10}s`,
              animationIterationCount: "infinite",
              animationTimingFunction: "ease-in-out",
              animationName: "floatAndRotate",
            }}
          >
            <Icon size={size} />
          </div>
        )
      })}

      {/* CSS animations */}
      <style jsx>{`
        @keyframes floatAndRotate {
          0% {
            transform: translate(0, 0) rotate(0deg);
          }
          25% {
            transform: translate(calc(-50px + ${Math.random() * 100}px), calc(-30px + ${Math.random() * 60}px)) rotate(90deg);
          }
          50% {
            transform: translate(calc(-30px + ${Math.random() * 60}px), calc(-40px + ${Math.random() * 80}px)) rotate(180deg);
          }
          75% {
            transform: translate(calc(-40px + ${Math.random() * 80}px), calc(-20px + ${Math.random() * 40}px)) rotate(270deg);
          }
          100% {
            transform: translate(0, 0) rotate(360deg);
          }
        }
      `}</style>
    </div>
  )
}
