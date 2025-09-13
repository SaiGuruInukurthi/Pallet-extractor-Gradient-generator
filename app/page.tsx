import { GradientDemo } from "@/components/gradient-demo"
import { AnimatedBackground } from "@/components/animated-background"

export default function Home() {
  return (
    <main className="min-h-screen relative">
      <AnimatedBackground />
      <div className="relative z-10">
        <GradientDemo />
      </div>
    </main>
  )
}
