import { GradientDemo } from "@/components/gradient-demo"

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-background via-muted to-background">
      <GradientDemo />
    </main>
  )
}
