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
  // Design icons with sophisticated animation configs - Increased count
  const designIcons = [
    { Icon: Palette, color: "#1f6feb", size: 24, pattern: "drift", intensity: "medium" },
    { Icon: Layers, color: "#8b5cf6", size: 20, pattern: "spiral", intensity: "soft" },
    { Icon: Grid3X3, color: "#6e7681", size: 18, pattern: "wave", intensity: "subtle" },
    { Icon: PenTool, color: "#1f6feb", size: 22, pattern: "orbit", intensity: "dynamic" },
    { Icon: Compass, color: "#8b5cf6", size: 26, pattern: "float", intensity: "gentle" },
    { Icon: Ruler, color: "#6e7681", size: 20, pattern: "drift", intensity: "medium" },
    { Icon: Eyedropper, color: "#1f6feb", size: 24, pattern: "pulse", intensity: "soft" },
    { Icon: Type, color: "#8b5cf6", size: 18, pattern: "spiral", intensity: "dynamic" },
    { Icon: Frame, color: "#6e7681", size: 22, pattern: "wave", intensity: "gentle" },
    { Icon: Component, color: "#1f6feb", size: 20, pattern: "orbit", intensity: "medium" },
    { Icon: Palette, color: "#ffffff40", size: 16, pattern: "float", intensity: "subtle" },
    { Icon: Layers, color: "#ffffff30", size: 28, pattern: "drift", intensity: "soft" },
    { Icon: Grid3X3, color: "#8b5cf6", size: 24, pattern: "pulse", intensity: "gentle" },
    { Icon: PenTool, color: "#ffffff35", size: 18, pattern: "wave", intensity: "dynamic" },
    { Icon: Compass, color: "#6e7681", size: 20, pattern: "spiral", intensity: "medium" },
    // Additional particles for more density
    { Icon: Palette, color: "#1f6feb50", size: 22, pattern: "drift", intensity: "soft" },
    { Icon: Layers, color: "#8b5cf650", size: 19, pattern: "float", intensity: "gentle" },
    { Icon: Grid3X3, color: "#ffffff25", size: 21, pattern: "orbit", intensity: "medium" },
    { Icon: PenTool, color: "#6e768150", size: 17, pattern: "pulse", intensity: "subtle" },
    { Icon: Compass, color: "#1f6feb40", size: 25, pattern: "spiral", intensity: "dynamic" },
    { Icon: Ruler, color: "#8b5cf640", size: 23, pattern: "wave", intensity: "soft" },
    { Icon: Eyedropper, color: "#ffffff30", size: 19, pattern: "drift", intensity: "gentle" },
    { Icon: Type, color: "#6e768140", size: 21, pattern: "float", intensity: "medium" },
    { Icon: Frame, color: "#1f6feb35", size: 18, pattern: "orbit", intensity: "subtle" },
    { Icon: Component, color: "#8b5cf635", size: 24, pattern: "pulse", intensity: "dynamic" },
    // Even more particles for rich background
    { Icon: Palette, color: "#ffffff20", size: 15, pattern: "spiral", intensity: "soft" },
    { Icon: Layers, color: "#1f6feb30", size: 27, pattern: "wave", intensity: "gentle" },
    { Icon: Grid3X3, color: "#8b5cf630", size: 20, pattern: "drift", intensity: "medium" },
    { Icon: PenTool, color: "#6e768130", size: 16, pattern: "float", intensity: "subtle" },
    { Icon: Compass, color: "#ffffff35", size: 23, pattern: "orbit", intensity: "dynamic" },
  ]

  return (
    <div className="fixed inset-0 -z-10 overflow-hidden">
      {/* Enhanced GitHub dark theme gradient background */}
      <div
        className="absolute inset-0"
        style={{
          background: `
            radial-gradient(circle at 20% 80%, rgba(31, 111, 235, 0.15) 0%, transparent 50%),
            radial-gradient(circle at 80% 20%, rgba(139, 92, 246, 0.15) 0%, transparent 50%),
            radial-gradient(circle at 40% 40%, rgba(110, 118, 129, 0.1) 0%, transparent 50%),
            linear-gradient(135deg, #0d1117 0%, #161b22 50%, #21262d 100%)
          `,
        }}
      />

      {/* Floating design icons with advanced animations */}
      {designIcons.map((item, index) => {
        const { Icon, color, size, pattern, intensity } = item
        const startX = Math.random() * 100
        const startY = Math.random() * 100
        const animationDelay = Math.random() * 20
        const animationDuration = 15 + Math.random() * 25

        return (
          <div
            key={index}
            className={`absolute opacity-60 hover:opacity-80 transition-all duration-500 cursor-pointer animation-${pattern}-${intensity}`}
            style={{
              left: `${startX}%`,
              top: `${startY}%`,
              color: color,
              animationDelay: `${animationDelay}s`,
              animationDuration: `${animationDuration}s`,
              animationIterationCount: "infinite",
              animationTimingFunction: "cubic-bezier(0.4, 0, 0.6, 1)",
              animationFillMode: "both",
              filter: "drop-shadow(0 0 12px rgba(31, 111, 235, 0.4))",
              zIndex: 1,
            }}
          >
            <Icon size={size} />
          </div>
        )
      })}

      {/* Advanced CSS animations with sophisticated easing */}
      <style jsx>{`
        /* Drift Animation - Gentle floating with organic movement */
        @keyframes drift-subtle {
          0%, 100% { transform: translate(0, 0) rotate(0deg) scale(1); }
          25% { transform: translate(30px, -20px) rotate(5deg) scale(1.05); }
          50% { transform: translate(-15px, -40px) rotate(-3deg) scale(0.95); }
          75% { transform: translate(-25px, -10px) rotate(8deg) scale(1.02); }
        }
        
        @keyframes drift-soft {
          0%, 100% { transform: translate(0, 0) rotate(0deg) scale(1); }
          25% { transform: translate(50px, -30px) rotate(10deg) scale(1.1); }
          50% { transform: translate(-25px, -60px) rotate(-5deg) scale(0.9); }
          75% { transform: translate(-40px, -15px) rotate(15deg) scale(1.05); }
        }
        
        @keyframes drift-medium {
          0%, 100% { transform: translate(0, 0) rotate(0deg) scale(1); }
          25% { transform: translate(70px, -50px) rotate(20deg) scale(1.15); }
          50% { transform: translate(-35px, -80px) rotate(-10deg) scale(0.85); }
          75% { transform: translate(-60px, -25px) rotate(25deg) scale(1.1); }
        }
        
        @keyframes drift-gentle {
          0%, 100% { transform: translate(0, 0) rotate(0deg) scale(1); }
          25% { transform: translate(40px, -35px) rotate(8deg) scale(1.08); }
          50% { transform: translate(-20px, -70px) rotate(-6deg) scale(0.92); }
          75% { transform: translate(-45px, -20px) rotate(12deg) scale(1.06); }
        }
        
        @keyframes drift-dynamic {
          0%, 100% { transform: translate(0, 0) rotate(0deg) scale(1); }
          25% { transform: translate(90px, -70px) rotate(30deg) scale(1.2); }
          50% { transform: translate(-45px, -100px) rotate(-15deg) scale(0.8); }
          75% { transform: translate(-80px, -30px) rotate(35deg) scale(1.15); }
        }

        /* Spiral Animation - Elegant circular motion */
        @keyframes spiral-subtle {
          0% { transform: translate(0, 0) rotate(0deg); }
          25% { transform: translate(20px, 20px) rotate(90deg); }
          50% { transform: translate(0, 40px) rotate(180deg); }
          75% { transform: translate(-20px, 20px) rotate(270deg); }
          100% { transform: translate(0, 0) rotate(360deg); }
        }
        
        @keyframes spiral-soft {
          0% { transform: translate(0, 0) rotate(0deg) scale(1); }
          25% { transform: translate(35px, 35px) rotate(90deg) scale(1.1); }
          50% { transform: translate(0, 70px) rotate(180deg) scale(0.9); }
          75% { transform: translate(-35px, 35px) rotate(270deg) scale(1.05); }
          100% { transform: translate(0, 0) rotate(360deg) scale(1); }
        }
        
        @keyframes spiral-medium {
          0% { transform: translate(0, 0) rotate(0deg) scale(1); }
          25% { transform: translate(50px, 50px) rotate(90deg) scale(1.15); }
          50% { transform: translate(0, 100px) rotate(180deg) scale(0.85); }
          75% { transform: translate(-50px, 50px) rotate(270deg) scale(1.1); }
          100% { transform: translate(0, 0) rotate(360deg) scale(1); }
        }
        
        @keyframes spiral-gentle {
          0% { transform: translate(0, 0) rotate(0deg) scale(1); }
          25% { transform: translate(40px, 40px) rotate(90deg) scale(1.08); }
          50% { transform: translate(0, 80px) rotate(180deg) scale(0.92); }
          75% { transform: translate(-40px, 40px) rotate(270deg) scale(1.06); }
          100% { transform: translate(0, 0) rotate(360deg) scale(1); }
        }
        
        @keyframes spiral-dynamic {
          0% { transform: translate(0, 0) rotate(0deg) scale(1); }
          25% { transform: translate(70px, 70px) rotate(90deg) scale(1.25); }
          50% { transform: translate(0, 140px) rotate(180deg) scale(0.75); }
          75% { transform: translate(-70px, 70px) rotate(270deg) scale(1.2); }
          100% { transform: translate(0, 0) rotate(360deg) scale(1); }
        }

        /* Wave Animation - Smooth sine wave motion */
        @keyframes wave-subtle {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          25% { transform: translateY(-15px) rotate(3deg); }
          50% { transform: translateY(0) rotate(0deg); }
          75% { transform: translateY(15px) rotate(-3deg); }
        }
        
        @keyframes wave-soft {
          0%, 100% { transform: translateY(0) rotate(0deg) scale(1); }
          25% { transform: translateY(-25px) rotate(5deg) scale(1.05); }
          50% { transform: translateY(0) rotate(0deg) scale(0.95); }
          75% { transform: translateY(25px) rotate(-5deg) scale(1.02); }
        }
        
        @keyframes wave-medium {
          0%, 100% { transform: translateY(0) rotate(0deg) scale(1); }
          25% { transform: translateY(-40px) rotate(10deg) scale(1.1); }
          50% { transform: translateY(0) rotate(0deg) scale(0.9); }
          75% { transform: translateY(40px) rotate(-10deg) scale(1.08); }
        }
        
        @keyframes wave-gentle {
          0%, 100% { transform: translateY(0) rotate(0deg) scale(1); }
          25% { transform: translateY(-30px) rotate(6deg) scale(1.06); }
          50% { transform: translateY(0) rotate(0deg) scale(0.94); }
          75% { transform: translateY(30px) rotate(-6deg) scale(1.04); }
        }
        
        @keyframes wave-dynamic {
          0%, 100% { transform: translateY(0) rotate(0deg) scale(1); }
          25% { transform: translateY(-60px) rotate(15deg) scale(1.2); }
          50% { transform: translateY(0) rotate(0deg) scale(0.8); }
          75% { transform: translateY(60px) rotate(-15deg) scale(1.15); }
        }

        /* Orbit Animation - Elliptical orbital motion */
        @keyframes orbit-subtle {
          0% { transform: translate(0, 0) rotate(0deg); }
          25% { transform: translate(25px, -10px) rotate(90deg); }
          50% { transform: translate(0, -20px) rotate(180deg); }
          75% { transform: translate(-25px, -10px) rotate(270deg); }
          100% { transform: translate(0, 0) rotate(360deg); }
        }
        
        @keyframes orbit-soft {
          0% { transform: translate(0, 0) rotate(0deg) scale(1); }
          25% { transform: translate(40px, -15px) rotate(90deg) scale(1.08); }
          50% { transform: translate(0, -30px) rotate(180deg) scale(0.92); }
          75% { transform: translate(-40px, -15px) rotate(270deg) scale(1.05); }
          100% { transform: translate(0, 0) rotate(360deg) scale(1); }
        }
        
        @keyframes orbit-medium {
          0% { transform: translate(0, 0) rotate(0deg) scale(1); }
          25% { transform: translate(60px, -25px) rotate(90deg) scale(1.12); }
          50% { transform: translate(0, -50px) rotate(180deg) scale(0.88); }
          75% { transform: translate(-60px, -25px) rotate(270deg) scale(1.1); }
          100% { transform: translate(0, 0) rotate(360deg) scale(1); }
        }
        
        @keyframes orbit-gentle {
          0% { transform: translate(0, 0) rotate(0deg) scale(1); }
          25% { transform: translate(50px, -20px) rotate(90deg) scale(1.06); }
          50% { transform: translate(0, -40px) rotate(180deg) scale(0.94); }
          75% { transform: translate(-50px, -20px) rotate(270deg) scale(1.04); }
          100% { transform: translate(0, 0) rotate(360deg) scale(1); }
        }
        
        @keyframes orbit-dynamic {
          0% { transform: translate(0, 0) rotate(0deg) scale(1); }
          25% { transform: translate(80px, -35px) rotate(90deg) scale(1.18); }
          50% { transform: translate(0, -70px) rotate(180deg) scale(0.82); }
          75% { transform: translate(-80px, -35px) rotate(270deg) scale(1.15); }
          100% { transform: translate(0, 0) rotate(360deg) scale(1); }
        }

        /* Float Animation - Gentle levitation effect */
        @keyframes float-subtle {
          0%, 100% { transform: translateY(0) scale(1); }
          50% { transform: translateY(-10px) scale(1.02); }
        }
        
        @keyframes float-soft {
          0%, 100% { transform: translateY(0) scale(1); }
          50% { transform: translateY(-18px) scale(1.05); }
        }
        
        @keyframes float-medium {
          0%, 100% { transform: translateY(0) scale(1); }
          50% { transform: translateY(-25px) scale(1.08); }
        }
        
        @keyframes float-gentle {
          0%, 100% { transform: translateY(0) scale(1); }
          50% { transform: translateY(-20px) scale(1.06); }
        }
        
        @keyframes float-dynamic {
          0%, 100% { transform: translateY(0) scale(1); }
          50% { transform: translateY(-35px) scale(1.12); }
        }

        /* Pulse Animation - Breathing effect with glow */
        @keyframes pulse-subtle {
          0%, 100% { transform: scale(1); opacity: 0.3; }
          50% { transform: scale(1.05); opacity: 0.5; }
        }
        
        @keyframes pulse-soft {
          0%, 100% { transform: scale(1); opacity: 0.3; filter: drop-shadow(0 0 5px currentColor); }
          50% { transform: scale(1.1); opacity: 0.6; filter: drop-shadow(0 0 15px currentColor); }
        }
        
        @keyframes pulse-medium {
          0%, 100% { transform: scale(1); opacity: 0.3; filter: drop-shadow(0 0 8px currentColor); }
          50% { transform: scale(1.15); opacity: 0.7; filter: drop-shadow(0 0 20px currentColor); }
        }
        
        @keyframes pulse-gentle {
          0%, 100% { transform: scale(1); opacity: 0.3; filter: drop-shadow(0 0 6px currentColor); }
          50% { transform: scale(1.12); opacity: 0.65; filter: drop-shadow(0 0 18px currentColor); }
        }
        
        @keyframes pulse-dynamic {
          0%, 100% { transform: scale(1); opacity: 0.3; filter: drop-shadow(0 0 10px currentColor); }
          50% { transform: scale(1.2); opacity: 0.8; filter: drop-shadow(0 0 25px currentColor); }
        }

        /* Apply animations to elements */
        .animation-drift-subtle { animation-name: drift-subtle; }
        .animation-drift-soft { animation-name: drift-soft; }
        .animation-drift-medium { animation-name: drift-medium; }
        .animation-drift-gentle { animation-name: drift-gentle; }
        .animation-drift-dynamic { animation-name: drift-dynamic; }
        
        .animation-spiral-subtle { animation-name: spiral-subtle; }
        .animation-spiral-soft { animation-name: spiral-soft; }
        .animation-spiral-medium { animation-name: spiral-medium; }
        .animation-spiral-gentle { animation-name: spiral-gentle; }
        .animation-spiral-dynamic { animation-name: spiral-dynamic; }
        
        .animation-wave-subtle { animation-name: wave-subtle; }
        .animation-wave-soft { animation-name: wave-soft; }
        .animation-wave-medium { animation-name: wave-medium; }
        .animation-wave-gentle { animation-name: wave-gentle; }
        .animation-wave-dynamic { animation-name: wave-dynamic; }
        
        .animation-orbit-subtle { animation-name: orbit-subtle; }
        .animation-orbit-soft { animation-name: orbit-soft; }
        .animation-orbit-medium { animation-name: orbit-medium; }
        .animation-orbit-gentle { animation-name: orbit-gentle; }
        .animation-orbit-dynamic { animation-name: orbit-dynamic; }
        
        .animation-float-subtle { animation-name: float-subtle; }
        .animation-float-soft { animation-name: float-soft; }
        .animation-float-medium { animation-name: float-medium; }
        .animation-float-gentle { animation-name: float-gentle; }
        .animation-float-dynamic { animation-name: float-dynamic; }
        
        .animation-pulse-subtle { animation-name: pulse-subtle; }
        .animation-pulse-soft { animation-name: pulse-soft; }
        .animation-pulse-medium { animation-name: pulse-medium; }
        .animation-pulse-gentle { animation-name: pulse-gentle; }
        .animation-pulse-dynamic { animation-name: pulse-dynamic; }
      `}</style>
    </div>
  )
}
