"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Copy, Download, Upload, Palette } from "lucide-react"

export function GradientDemo() {
  const [selectedPalette, setSelectedPalette] = useState(0)

  const palettes = [
    ["#f6f8fa", "#e1e4e8", "#d1d5da", "#959da5", "#586069"],
    ["#0366d6", "#2188ff", "#79b8ff", "#c8e1ff", "#f1f8ff"],
    ["#28a745", "#34d058", "#85e89d", "#c3f5d1", "#f0fff4"],
    ["#d73a49", "#f97583", "#fdaeb7", "#ffeef0", "#ffeef0"],
    ["#6f42c1", "#8a63d2", "#b392f0", "#e1bcf7", "#f8f4ff"],
  ]

  const gradientPreviews = [
    {
      name: "Desktop",
      style: "bg-gradient-to-r from-accent/20 via-muted to-background",
      dimensions: "aspect-[16/9]",
    },
    {
      name: "Mobile",
      style: "bg-gradient-to-b from-accent/10 via-background to-muted",
      dimensions: "aspect-[9/16] max-w-[200px]",
    },
    {
      name: "Square",
      style: "bg-gradient-to-br from-background via-accent/5 to-muted",
      dimensions: "aspect-square max-w-[300px]",
    },
  ]

  return (
    <div className="container mx-auto p-6 space-y-8">
      {/* Header Section */}
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Controls */}
        <div className="flex flex-col gap-4 lg:w-1/3">
          <Button variant="outline" className="justify-start gap-2 bg-transparent">
            <Upload className="h-4 w-4" />
            Import Image
          </Button>
          <Button variant="outline" className="justify-start gap-2 bg-transparent">
            <Palette className="h-4 w-4" />
            Extract Palette
          </Button>
        </div>

        {/* Preview Area */}
        <Card className="flex-1 p-8 relative overflow-hidden">
          {/* Central PNG Overlay */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-32 h-32 bg-gradient-to-br from-accent/20 to-accent/5 rounded-full flex items-center justify-center shadow-lg">
              <div className="w-16 h-16 bg-card rounded-lg shadow-md flex items-center justify-center">
                <Palette className="h-8 w-8 text-accent" />
              </div>
            </div>
          </div>

          {/* Background Pattern */}
          <div className="absolute inset-0 bg-gradient-to-br from-background via-muted/50 to-accent/5 opacity-60" />

          <div className="relative z-10 text-center text-muted-foreground">
            <p className="text-sm">Preview Area</p>
          </div>
        </Card>
      </div>

      {/* Palette Display */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4 text-card-foreground">Color Palette</h3>
        <div className="flex gap-2 overflow-x-auto pb-2">
          {palettes[selectedPalette].map((color, index) => (
            <div
              key={index}
              className="flex-shrink-0 w-16 h-16 rounded-lg shadow-sm border border-border cursor-pointer hover:scale-105 transition-transform"
              style={{ backgroundColor: color }}
              title={color}
            />
          ))}
        </div>
        <div className="flex gap-2 mt-4">
          {palettes.map((_, index) => (
            <button
              key={index}
              onClick={() => setSelectedPalette(index)}
              className={`w-3 h-3 rounded-full transition-colors ${
                selectedPalette === index ? "bg-accent" : "bg-muted"
              }`}
            />
          ))}
        </div>
      </Card>

      {/* Gradient Previews */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {gradientPreviews.map((preview, index) => (
          <div key={index} className="space-y-4">
            <Card className={`p-6 ${preview.dimensions} ${preview.style} relative overflow-hidden shadow-lg`}>
              {/* Subtle overlay pattern */}
              <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent" />
              <div className="relative z-10 flex items-center justify-center h-full">
                <span className="text-sm font-medium text-foreground/70 bg-card/80 px-3 py-1 rounded-full backdrop-blur-sm">
                  {preview.name}
                </span>
              </div>
            </Card>

            <div className="flex gap-2">
              <Button size="sm" variant="outline" className="flex-1 gap-2 bg-transparent">
                <Download className="h-3 w-3" />
                Download
              </Button>
              <Button size="sm" variant="outline" className="flex-1 gap-2 bg-transparent">
                <Copy className="h-3 w-3" />
                Copy CSS
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
