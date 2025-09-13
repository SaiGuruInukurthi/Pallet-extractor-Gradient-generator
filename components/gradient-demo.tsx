"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Copy, Download, Upload, Palette, X } from "lucide-react"
import { ColorExtractor, type ColorResult } from "@/lib/color-extractor"
import { AnimatedBackground } from "@/components/animated-background"

export function GradientDemo() {
  const [selectedPalette, setSelectedPalette] = useState(0)
  const [uploadedImage, setUploadedImage] = useState<string | null>(null)
  const [imageLoading, setImageLoading] = useState(false)
  const [isDragOver, setIsDragOver] = useState(false)
  const [extractedColors, setExtractedColors] = useState<ColorResult[]>([])
  const [isExtracting, setIsExtracting] = useState(false)
  const [copiedColor, setCopiedColor] = useState<string | null>(null)
  const [copiedImageIndex, setCopiedImageIndex] = useState<number | null>(null)
  const [generatedGradients, setGeneratedGradients] = useState<string[]>([])
  const [selectedGradientTypes, setSelectedGradientTypes] = useState<string[]>(["linear-135", "linear-180", "radial"])
  const [showGradientSelector, setShowGradientSelector] = useState<number | null>(null)
  const [isExpanded, setIsExpanded] = useState(false)
  const [cursorTooltip, setCursorTooltip] = useState<{ show: boolean; x: number; y: number; text: string }>({
    show: false,
    x: 0,
    y: 0,
    text: "",
  })
  const fileInputRef = useRef<HTMLInputElement>(null)
  const colorExtractor = useRef<ColorExtractor | null>(null)

  // Helper function to determine contrasting text color
  const getContrastColor = (hexColor: string): string => {
    // Convert hex to RGB
    const hex = hexColor.replace("#", "")
    const r = Number.parseInt(hex.substr(0, 2), 16)
    const g = Number.parseInt(hex.substr(2, 2), 16)
    const b = Number.parseInt(hex.substr(4, 2), 16)

    // Calculate relative luminance
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255

    // Return white for dark colors, black for light colors
    return luminance > 0.5 ? "#000000" : "#ffffff"
  }

  // Generate gradients from extracted colors
  const generateGradients = (colors: ColorResult[]) => {
    if (colors.length < 2) return []

    const colorHexes = colors.map((c) => c.color)
    const colorString = colorHexes.slice(0, 5).join(", ")

    const gradients = selectedGradientTypes.map((type) => {
      if (type === "radial") {
        return `radial-gradient(circle at center, ${colorString})`
      } else if (type === "radial-ellipse") {
        return `radial-gradient(ellipse at center, ${colorString})`
      } else if (type.startsWith("linear-")) {
        const angle = type.split("-")[1]
        return `linear-gradient(${angle}deg, ${colorString})`
      }
      return `linear-gradient(135deg, ${colorString})` // fallback
    })

    return gradients
  }

  // Available gradient types with categories
  const gradientCategories = [
    {
      label: "Linear",
      options: [
        { value: "linear-0", label: "0°" },
        { value: "linear-45", label: "45°" },
        { value: "linear-90", label: "90°" },
        { value: "linear-135", label: "135°" },
        { value: "linear-180", label: "180°" },
        { value: "linear-225", label: "225°" },
        { value: "linear-270", label: "270°" },
        { value: "linear-315", label: "315°" },
      ],
    },
    {
      label: "Radial",
      options: [
        { value: "radial", label: "Center" },
        { value: "radial-ellipse", label: "Ellipse" },
      ],
    },
  ]

  // Get display label for gradient type
  const getGradientLabel = (type: string) => {
    for (const category of gradientCategories) {
      const option = category.options.find((opt) => opt.value === type)
      if (option) return `${category.label} ${option.label}`
    }
    return type
  }

  // Handle gradient type selection
  const handleGradientTypeChange = (index: number, newType: string) => {
    const newTypes = [...selectedGradientTypes]
    newTypes[index] = newType
    setSelectedGradientTypes(newTypes)

    // Regenerate gradients if colors are available - use the new types directly
    if (extractedColors.length > 0) {
      const colorHexes = extractedColors.map((c) => c.color)
      const colorString = colorHexes.slice(0, 5).join(", ")

      const newGradients = newTypes.map((type) => {
        if (type === "radial") {
          return `radial-gradient(circle at center, ${colorString})`
        } else if (type === "radial-ellipse") {
          return `radial-gradient(ellipse at center, ${colorString})`
        } else if (type.startsWith("linear-")) {
          const angle = type.split("-")[1]
          return `linear-gradient(${angle}deg, ${colorString})`
        }
        return `linear-gradient(135deg, ${colorString})` // fallback
      })

      setGeneratedGradients(newGradients)
    }
  }

  // Copy gradient image to clipboard
  const copyImageToClipboard = async (gradientCSS: string, width: number, height: number, index: number) => {
    try {
      const canvas = document.createElement("canvas")
      const ctx = canvas.getContext("2d")!

      canvas.width = width
      canvas.height = height

      // Create a temporary div to render the CSS gradient
      const tempDiv = document.createElement("div")
      tempDiv.style.width = `${width}px`
      tempDiv.style.height = `${height}px`
      tempDiv.style.background = gradientCSS
      tempDiv.style.position = "absolute"
      tempDiv.style.top = "-9999px"
      document.body.appendChild(tempDiv)

      // Use html2canvas-like approach - draw the gradient manually
      // Parse the gradient CSS and recreate it on canvas
      if (extractedColors.length >= 2) {
        const colors = extractedColors.map((c) => c.color)

        // Determine gradient type and create accordingly
        if (gradientCSS.includes("radial-gradient")) {
          const gradient = ctx.createRadialGradient(
            width / 2,
            height / 2,
            0,
            width / 2,
            height / 2,
            Math.max(width, height) / 2,
          )
          colors.forEach((color, i) => {
            gradient.addColorStop(i / (colors.length - 1), color)
          })
          ctx.fillStyle = gradient
        } else {
          // Linear gradient - extract angle from CSS
          const angleMatch = gradientCSS.match(/(\d+)deg/)
          const angle = angleMatch ? Number.parseInt(angleMatch[1]) : 135
          const radians = (angle * Math.PI) / 180

          const x1 = width / 2 - (Math.cos(radians) * width) / 2
          const y1 = height / 2 - (Math.sin(radians) * height) / 2
          const x2 = width / 2 + (Math.cos(radians) * width) / 2
          const y2 = height / 2 + (Math.sin(radians) * height) / 2

          const gradient = ctx.createLinearGradient(x1, y1, x2, y2)
          colors.forEach((color, i) => {
            gradient.addColorStop(i / (colors.length - 1), color)
          })
          ctx.fillStyle = gradient
        }

        ctx.fillRect(0, 0, width, height)
      }

      // Clean up
      document.body.removeChild(tempDiv)

      // Convert to blob and copy to clipboard
      canvas.toBlob(async (blob) => {
        if (blob) {
          try {
            await navigator.clipboard.write([new ClipboardItem({ "image/png": blob })])
            setCopiedImageIndex(index)
            setTimeout(() => setCopiedImageIndex(null), 2000)
          } catch (err) {
            console.error("Failed to copy image:", err)
          }
        }
      }, "image/png")
    } catch (error) {
      console.error("Error copying image:", error)
    }
  }

  // Download wallpaper in specific resolution
  const downloadWallpaper = (gradientCSS: string, width: number, height: number, name: string) => {
    const canvas = document.createElement("canvas")
    const ctx = canvas.getContext("2d")!

    canvas.width = width
    canvas.height = height

    // Create gradient
    let gradient
    if (gradientCSS.includes("radial-gradient")) {
      gradient = ctx.createRadialGradient(width / 2, height / 2, 0, width / 2, height / 2, Math.max(width, height) / 2)
    } else if (gradientCSS.includes("to bottom")) {
      gradient = ctx.createLinearGradient(0, 0, 0, height)
    } else {
      // Default to 135deg diagonal
      gradient = ctx.createLinearGradient(0, 0, width, height)
    }

    // Extract colors from CSS gradient
    const colorMatches = gradientCSS.match(/#[a-fA-F0-9]{6}/g) || []
    const step = 1 / (colorMatches.length - 1)

    colorMatches.forEach((color, index) => {
      gradient.addColorStop(index * step, color)
    })

    ctx.fillStyle = gradient
    ctx.fillRect(0, 0, width, height)

    // Download
    canvas.toBlob((blob) => {
      if (blob) {
        const url = URL.createObjectURL(blob)
        const a = document.createElement("a")
        a.href = url
        a.download = `${name}-wallpaper-${width}x${height}.png`
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
        URL.revokeObjectURL(url)
      }
    })
  }

  // Copy CSS gradient to clipboard
  const copyCSSGradient = async (gradientCSS: string, event: React.MouseEvent) => {
    const cssCode = `background: ${gradientCSS};`
    try {
      await navigator.clipboard.writeText(cssCode)
      setCursorTooltip({
        show: true,
        x: event.clientX,
        y: event.clientY,
        text: "CSS copied!",
      })
      setTimeout(() => setCursorTooltip((prev) => ({ ...prev, show: false })), 1500)
    } catch (error) {
      const textArea = document.createElement("textarea")
      textArea.value = cssCode
      document.body.appendChild(textArea)
      textArea.select()
      document.execCommand("copy")
      document.body.removeChild(textArea)
      setCursorTooltip({
        show: true,
        x: event.clientX,
        y: event.clientY,
        text: "CSS copied!",
      })
      setTimeout(() => setCursorTooltip((prev) => ({ ...prev, show: false })), 1500)
    }
  }

  const palettes = [
    ["#f6f8fa", "#e1e4e8", "#d1d5da", "#959da5", "#586069"],
    ["#0366d6", "#2188ff", "#79b8ff", "#c8e1ff", "#f1f8ff"],
    ["#28a745", "#34d058", "#85e89d", "#b392f0", "#f0fff4"],
    ["#d73a49", "#f97583", "#fdaeb7", "#ffeef0", "#ffeef0"],
    ["#6f42c1", "#8a63d2", "#b392f0", "#e1bcf7", "#f8f4ff"],
  ]

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    processImageFile(file)
  }

  const processImageFile = (file: File) => {
    // Validate file type
    const validTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"]
    if (!validTypes.includes(file.type)) {
      alert("Please upload a valid image file (JPEG, PNG, or WebP)")
      return
    }

    // Validate file size (max 10MB)
    const maxSize = 10 * 1024 * 1024 // 10MB in bytes
    if (file.size > maxSize) {
      alert("File size must be less than 10MB")
      return
    }

    setImageLoading(true)

    // Read and display the image
    const reader = new FileReader()
    reader.onload = (e) => {
      const imageData = e.target?.result as string
      setUploadedImage(imageData)
      setImageLoading(false)
      
      // Beautiful reveal animation after image loads
      setTimeout(() => setIsExpanded(true), 300)

      // Automatically extract palette using the fresh image data
      setTimeout(() => {
        handleExtractPalette(imageData)
      }, 100) // Small delay to ensure image is rendered
    }
    reader.onerror = () => {
      alert("Error reading file")
      setImageLoading(false)
    }
    reader.readAsDataURL(file)
  }

  const handleImportClick = () => {
    fileInputRef.current?.click()
  }

  const handleRemoveImage = () => {
    setUploadedImage(null)
    setImageLoading(false)
    setExtractedColors([])
    setIsExpanded(false)
    // Reset the file input
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const handleExtractPalette = async (imageData?: string) => {
    const imageToProcess = imageData || uploadedImage
    if (!imageToProcess) {
      alert("Please upload an image first")
      return
    }

    setIsExtracting(true)
    try {
      // Initialize ColorExtractor lazily (only in browser)
      if (!colorExtractor.current) {
        colorExtractor.current = new ColorExtractor()
      }
      
      const results = await colorExtractor.current.extractColors(imageToProcess, 5)
      setExtractedColors(results)

      // Auto-generate gradients from extracted colors
      const gradients = generateGradients(results)
      setGeneratedGradients(gradients)
    } catch (error) {
      console.error("Color extraction failed:", error)
      alert("Failed to extract colors from the image. Please try another image.")
    } finally {
      setIsExtracting(false)
    }
  }

  const copyToClipboard = async (color: string, event: React.MouseEvent) => {
    try {
      await navigator.clipboard.writeText(color)
      setCopiedColor(color)

      // Show cursor tooltip
      setCursorTooltip({
        show: true,
        x: event.clientX,
        y: event.clientY,
        text: `${color} copied!`,
      })

      setTimeout(() => setCopiedColor(null), 2000)
      setTimeout(() => setCursorTooltip((prev) => ({ ...prev, show: false })), 1500)
    } catch (error) {
      // Fallback for older browsers
      const textArea = document.createElement("textarea")
      textArea.value = color
      document.body.appendChild(textArea)
      textArea.select()
      document.execCommand("copy")
      document.body.removeChild(textArea)

      setCopiedColor(color)
      setCursorTooltip({
        show: true,
        x: event.clientX,
        y: event.clientY,
        text: `${color} copied!`,
      })

      setTimeout(() => setCopiedColor(null), 2000)
      setTimeout(() => setCursorTooltip((prev) => ({ ...prev, show: false })), 1500)
    }
  }

  // Drag and drop handlers
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragOver(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragOver(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragOver(false)

    const files = e.dataTransfer.files
    if (files && files.length > 0) {
      const file = files[0]
      processImageFile(file)
    }
  }

  const gradientPreviews = [
    {
      name: "Desktop",
      dimensions: "aspect-[16/9] w-48",
      resolution: { width: 1920, height: 1080 },
    },
    {
      name: "Mobile",
      dimensions: "aspect-[9/16] w-32",
      resolution: { width: 1080, height: 1920 },
    },
    {
      name: "Square",
      dimensions: "aspect-square w-40",
      resolution: { width: 1080, height: 1080 },
    },
  ]

  const copyAllHexCodes = async (event: React.MouseEvent) => {
    if (extractedColors.length === 0) return

    const allHexCodes = extractedColors.map((color) => color.color).join(", ")
    try {
      await navigator.clipboard.writeText(allHexCodes)
      setCursorTooltip({
        show: true,
        x: event.clientX,
        y: event.clientY,
        text: "All hex codes copied!",
      })
      setTimeout(() => setCursorTooltip((prev) => ({ ...prev, show: false })), 1500)
    } catch (error) {
      // Fallback for older browsers
      const textArea = document.createElement("textarea")
      textArea.value = allHexCodes
      document.body.appendChild(textArea)
      textArea.select()
      document.execCommand("copy")
      document.body.removeChild(textArea)

      setCursorTooltip({
        show: true,
        x: event.clientX,
        y: event.clientY,
        text: "All hex codes copied!",
      })
      setTimeout(() => setCursorTooltip((prev) => ({ ...prev, show: false })), 1500)
    }
  }

  if (!isExpanded && !uploadedImage) {
    return (
      <>
        {/* Animated Background with Floating Particles */}
        <AnimatedBackground />
        
        <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center relative">
          {/* Hidden file input */}
          <input ref={fileInputRef} type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />

          {/* Main Content */}
          <div className="max-w-4xl mx-auto space-y-8">
            {/* Project Icon */}
            <div className="flex justify-center mb-6">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-2xl">
                <Palette className="h-10 w-10 text-white" />
              </div>
            </div>

            {/* Title */}
            <h1 className="text-6xl font-bold text-white mb-6 tracking-tight">
              Color Palette Extractor
            </h1>

            {/* Subtitle */}
            <p className="text-xl text-gray-400 mb-8 max-w-2xl mx-auto leading-relaxed">
              Extract Color Palette from Any Image
            </p>

            {/* Feature Cards */}
            <div className="grid md:grid-cols-3 gap-6 mb-12 text-left">
              <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6 hover:bg-gray-800/70 transition-all duration-300 hover:border-blue-400 hover:shadow-[0_0_20px_rgba(59,130,246,0.5)]">
                <div className="text-blue-400 mb-3">
                  <Upload className="h-6 w-6" />
                </div>
                <h3 className="text-white font-semibold mb-2">Upload & Extract</h3>
                <p className="text-gray-400 text-sm">Drag and drop any image to extract the 5 most dominant colors using K-means clustering</p>
              </div>
              
              <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6 hover:bg-gray-800/70 transition-all duration-300 hover:border-purple-400 hover:shadow-[0_0_20px_rgba(139,92,246,0.5)]">
                <div className="text-purple-400 mb-3">
                  <Palette className="h-6 w-6" />
                </div>
                <h3 className="text-white font-semibold mb-2">Copy Colors</h3>
                <p className="text-gray-400 text-sm">Click any color to copy its hex code directly to your clipboard</p>
              </div>
              
              <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6 hover:bg-gray-800/70 transition-all duration-300 hover:border-green-400 hover:shadow-[0_0_20px_rgba(34,197,94,0.5)]">
                <div className="text-green-400 mb-3">
                  <Download className="h-6 w-6" />
                </div>
                <h3 className="text-white font-semibold mb-2">Generate Wallpapers</h3>
                <p className="text-gray-400 text-sm">Create gradient wallpapers from images in multiple formats</p>
              </div>
            </div>

            {/* CTA Drop Zone */}
            <div className="flex justify-center">
              <div
                className={`w-full max-w-4xl h-32 border-2 border-dashed border-gray-500 bg-transparent rounded-xl cursor-pointer transition-all duration-300 flex items-center justify-center group ${
                  isDragOver
                    ? "border-blue-400 bg-blue-500/10 scale-[1.02] shadow-[0_0_30px_rgba(59,130,246,0.8)]"
                    : "hover:border-gray-400 hover:bg-gray-800/20 hover:shadow-[0_0_25px_rgba(156,163,175,0.6)] hover:scale-[1.01]"
                }`}
                onClick={handleImportClick}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
              >
                <div className="text-center">
                  <div className="flex items-center justify-center gap-3 mb-2">
                    <Upload className={`h-6 w-6 transition-colors duration-300 ${
                      isDragOver ? "text-blue-400" : "text-gray-400 group-hover:text-gray-300"
                    }`} />
                    <span className={`text-lg font-semibold transition-colors duration-300 ${
                      isDragOver ? "text-blue-400" : "text-gray-300 group-hover:text-white"
                    }`}>
                      {isDragOver ? "Drop image to extract colors" : "Start Extracting Colors"}
                    </span>
                  </div>
                  <p className={`text-sm transition-colors duration-300 ${
                    isDragOver ? "text-blue-400/70" : "text-gray-500 group-hover:text-gray-400"
                  }`}>
                    {isDragOver ? "Release to upload and analyze" : "Drag & drop an image or click to browse"}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2">
            <p 
              className="text-gray-500 text-sm cursor-pointer transition-all duration-300 hover:text-gray-300 hover:transform hover:scale-105 hover:-translate-y-1 active:scale-95"
              onClick={() => window.open('https://github.com/SaiGuruInukurthi/Pallet-extractor-Gradient-generator', '_blank')}
            >
              Made by GitHub Community GITAM Hyderabad • Learn by Doing
            </p>
          </div>
        </div>
      </>
    )
  }

  return (
    <>
      {/* Animated Background with Floating Particles */}
      <AnimatedBackground />
      
      <div
        className={`container mx-auto p-6 space-y-8 transition-all duration-700 ease-out ${
          isExpanded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
        }`}
      >
      {/* Animated Button Controls - Above Preview */}
      <div className="flex flex-col items-center gap-4">
        {/* Hidden file input */}
        <input ref={fileInputRef} type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />

        {/* Animated Button Container */}
        <div
          className={`flex gap-3 transition-all duration-500 ease-in-out ${
            uploadedImage ? "justify-center w-full max-w-md" : "justify-center"
          }`}
        >
          {/* Remove Button with Slide Animation */}
          <div
            className={`overflow-hidden transition-all duration-500 ease-in-out ${
              uploadedImage ? "max-w-[200px] opacity-100" : "max-w-0 opacity-0"
            }`}
          >
            <Button
              variant="outline-glow"
              className="justify-center gap-2 text-red-400 hover:text-red-300 whitespace-nowrap hover:bg-red-500/10 border-red-500/50 hover:border-red-400 shadow-[0_0_10px_rgba(239,68,68,0.4)] hover:shadow-[0_0_20px_rgba(239,68,68,0.6)]"
              onClick={handleRemoveImage}
            >
              <X className="h-4 w-4" />
              Remove Image
            </Button>
          </div>
        </div>

        {/* Extraction Status */}
        {isExtracting && (
          <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground animate-fade-in">
            <div className="w-4 h-4 border-2 border-accent border-t-transparent rounded-full animate-spin"></div>
            Extracting colors...
          </div>
        )}
      </div>

      {/* Preview Section */}
      <div className="flex justify-center">
        {/* Centered Preview Area */}
        <Card
          className={`w-full max-w-2xl relative overflow-hidden min-h-[300px] transition-all duration-200 ${
            isDragOver ? "border-2 border-dashed border-accent bg-accent/5" : "border border-border"
          }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          {imageLoading ? (
            /* Loading state */
            <div className="absolute inset-0 flex items-center justify-center bg-muted/50">
              <div className="flex flex-col items-center gap-2">
                <div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin"></div>
                <p className="text-sm text-muted-foreground">Loading image...</p>
              </div>
            </div>
          ) : uploadedImage ? (
            /* Display uploaded image with dynamic sizing */
            <div className="p-4 h-full flex items-center justify-center">
              <div className="relative max-w-full max-h-full">
                <img
                  src={uploadedImage || "/placeholder.svg"}
                  alt="Uploaded image for color extraction"
                  className="max-w-full max-h-[400px] w-auto h-auto object-contain rounded-lg shadow-lg border border-border"
                  style={{
                    minHeight: "200px",
                    maxWidth: "100%",
                  }}
                />
              </div>
            </div>
          ) : (
            /* Clean, minimal placeholder when no image */
            <div className="h-full flex items-center justify-center">
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-muted flex items-center justify-center">
                  <Palette className="h-8 w-8 text-muted-foreground" />
                </div>
                <p
                  className={`text-sm font-medium mb-2 transition-colors duration-200 ${
                    isDragOver ? "text-accent" : "text-foreground"
                  }`}
                >
                  {isDragOver ? "Drop image to extract colors" : "Upload an image"}
                </p>
                <p
                  className={`text-xs transition-colors duration-200 ${
                    isDragOver ? "text-accent/70" : "text-muted-foreground"
                  }`}
                >
                  {isDragOver ? "Release to upload" : "Drag & drop or click Import"}
                </p>
              </div>
            </div>
          )}

          {/* Drag overlay for better visual feedback */}
          {isDragOver && (
            <div className="absolute inset-0 bg-accent/10 border-2 border-dashed border-accent rounded-lg pointer-events-none" />
          )}
        </Card>
      </div>

      <div
        className={`transition-all duration-700 delay-200 ease-out ${
          isExpanded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
        }`}
      >
        {/* Palette Display */}
        <Card className="p-6 bg-white/10 backdrop-blur-md border-white/20 max-w-4xl mx-auto">
          <h3 className="text-lg font-semibold mb-4 text-white">
            {extractedColors.length > 0 ? "Extracted Color Palette" : "Color Palette"}
          </h3>

          {extractedColors.length > 0 ? (
            /* Display extracted colors */
            <div className="space-y-4">
              <div className="flex justify-between items-center mb-4">
                <Button
                  size="sm"
                  variant="outline-glow"
                  className="gap-2 bg-transparent text-white"
                  onClick={copyAllHexCodes}
                >
                  <Copy className="h-3 w-3" />
                  Copy All
                </Button>
              </div>

              <div className="grid grid-cols-5 gap-4 w-full">
                {extractedColors.map((colorResult, index) => (
                  <div
                    key={index}
                    className="group cursor-pointer"
                    onClick={(e) => copyToClipboard(colorResult.color, e)}
                  >
                    <div
                      className={`w-full aspect-square rounded-lg shadow-sm border transition-all duration-200 hover:shadow-md relative flex flex-col items-center justify-center min-h-[120px] ${
                        copiedColor === colorResult.color
                          ? "border-green-500 border-2 scale-105"
                          : "border-border hover:scale-105"
                      }`}
                      style={{ backgroundColor: colorResult.color }}
                      title={`${colorResult.color} - Click to copy`}
                    >
                      {/* Hex code overlay */}
                      <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <span
                          className="text-sm font-mono font-bold px-2 py-1 rounded backdrop-blur-sm"
                          style={{
                            color: getContrastColor(colorResult.color),
                            backgroundColor:
                              getContrastColor(colorResult.color) === "#000000"
                                ? "rgba(255,255,255,0.9)"
                                : "rgba(0,0,0,0.7)",
                          }}
                        >
                          {colorResult.color.toUpperCase()}
                        </span>
                        <span
                          className="text-xs mt-2 px-2 py-0.5 rounded backdrop-blur-sm"
                          style={{
                            color: getContrastColor(colorResult.color),
                            backgroundColor:
                              getContrastColor(colorResult.color) === "#000000"
                                ? "rgba(255,255,255,0.8)"
                                : "rgba(0,0,0,0.6)",
                          }}
                        >
                          {Math.round(colorResult.frequency * 100)}%
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <p className="text-xs text-white text-center">Click on any color box to copy its hex code to clipboard</p>
            </div>
          ) : (
            /* Display default palette samples */
            <div className="space-y-4">
              <div className="grid grid-cols-5 gap-4 w-full">
                {palettes[selectedPalette].map((color, index) => (
                  <div key={index} className="group cursor-pointer" onClick={(e) => copyToClipboard(color, e)}>
                    <div
                      className={`w-full aspect-square rounded-lg shadow-sm border transition-all duration-200 hover:shadow-md relative flex items-center justify-center min-h-[120px] ${
                        copiedColor === color ? "border-green-500 border-2 scale-105" : "border-border hover:scale-105"
                      }`}
                      style={{ backgroundColor: color }}
                      title={`${color} - Click to copy`}
                    >
                      {/* Hex code overlay */}
                      <span
                        className="text-sm font-mono font-bold px-2 py-1 rounded backdrop-blur-sm"
                        style={{
                          color: getContrastColor(color),
                          backgroundColor:
                            getContrastColor(color) === "#000000" ? "rgba(255,255,255,0.9)" : "rgba(0,0,0,0.7)",
                        }}
                      >
                        {color.toUpperCase()}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
              <p className="text-xs text-white text-center mt-4">
                Upload an image and click "Extract Palette" to get real colors, or click on sample colors to copy
              </p>
            </div>
          )}
        </Card>
      </div>

      <div
        className={`space-y-6 transition-all duration-700 delay-400 ease-out ${
          isExpanded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
        }`}
      >
        <h3 className="text-lg font-semibold text-white">Gradient Wallpapers</h3>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 place-items-center">
          {gradientPreviews.map((preview, index) => (
            <div key={index} className="space-y-4 w-full max-w-sm flex flex-col items-center">
              {/* Custom Gradient Type Selector */}
              <div className="w-full relative">
                <label className="text-sm font-medium text-black mb-2 block">{preview.name} Gradient Type</label>
                <button
                  onClick={() => setShowGradientSelector(showGradientSelector === index ? null : index)}
                  className="w-full px-3 py-2 text-sm border border-border rounded-md bg-background hover:bg-muted/50 focus:outline-none focus:ring-2 focus:ring-accent flex items-center justify-between"
                >
                  <span>{getGradientLabel(selectedGradientTypes[index] || "linear-135")}</span>
                  <svg
                    className={`w-4 h-4 transition-transform ${showGradientSelector === index ? "rotate-180" : ""}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {/* Custom Dropdown */}
                {showGradientSelector === index && (
                  <div className="absolute top-full left-0 right-0 mt-1 bg-card border border-border rounded-lg shadow-lg z-50 p-4">
                    {gradientCategories.map((category) => (
                      <div key={category.label} className="mb-4 last:mb-0">
                        <h4 className="text-sm font-medium text-foreground mb-2 pb-1 border-b border-border">
                          {category.label}
                        </h4>
                        <div className="grid grid-cols-4 gap-2">
                          {category.options.map((option) => (
                            <button
                              key={option.value}
                              onClick={() => {
                                handleGradientTypeChange(index, option.value)
                                setShowGradientSelector(null)
                              }}
                              className={`px-2 py-1 text-xs rounded border transition-colors ${
                                selectedGradientTypes[index] === option.value
                                  ? "bg-accent text-accent-foreground border-accent"
                                  : "bg-background hover:bg-muted border-border"
                              }`}
                            >
                              {option.label}
                            </button>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <Card
                className={`p-6 ${preview.dimensions} relative overflow-hidden shadow-lg w-full cursor-pointer transition-all duration-200 hover:shadow-xl hover:scale-[1.02] group ${
                  copiedImageIndex === index ? "border-green-500 border-2 scale-105" : ""
                }`}
                style={{
                  background: generatedGradients[index] || "linear-gradient(135deg, #f0f0f0, #e0e0e0)",
                }}
                onClick={() => {
                  if (generatedGradients[index]) {
                    copyImageToClipboard(
                      generatedGradients[index],
                      preview.resolution.width,
                      preview.resolution.height,
                      index,
                    )
                  }
                }}
                title="Click to copy gradient image to clipboard"
              >
                {/* Subtle overlay pattern */}
                <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent" />

                {/* Click to copy hint overlay */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-black/20">
                  <div className="bg-white/90 text-black px-3 py-2 rounded-lg text-sm font-medium flex items-center gap-2">
                    <Copy className="h-4 w-4" />
                    {copiedImageIndex === index ? "Image copied!" : "Click to copy image"}
                  </div>
                </div>

                <div className="relative z-10 flex items-center justify-center h-full">
                  {generatedGradients[index] && (
                    <span className="absolute bottom-2 right-2 text-xs bg-black/50 text-white px-2 py-1 rounded">
                      {preview.resolution.width}×{preview.resolution.height}
                    </span>
                  )}
                </div>
              </Card>

              <div className="flex gap-2 w-full">
                <Button
                  size="sm"
                  variant="outline"
                  className="flex-1 gap-2 bg-transparent"
                  onClick={() =>
                    downloadWallpaper(
                      generatedGradients[index] || "linear-gradient(135deg, #f0f0f0, #e0e0e0)",
                      preview.resolution.width,
                      preview.resolution.height,
                      preview.name.toLowerCase(),
                    )
                  }
                  disabled={!generatedGradients[index]}
                >
                  <Download className="h-3 w-3" />
                  Download
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="flex-1 gap-2 bg-transparent"
                  onClick={(e) =>
                    copyCSSGradient(generatedGradients[index] || "linear-gradient(135deg, #f0f0f0, #e0e0e0)", e)
                  }
                  disabled={!generatedGradients[index]}
                >
                  <Copy className="h-3 w-3" />
                  Copy CSS
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Cursor-following tooltip */}
      {cursorTooltip.show && (
        <div
          className="fixed z-50 bg-gray-900 text-white text-sm px-3 py-2 rounded-lg shadow-lg pointer-events-none"
          style={{
            left: cursorTooltip.x + 10,
            top: cursorTooltip.y - 40,
            transform: "translateX(-50%)",
          }}
        >
          {cursorTooltip.text}
        </div>
      )}
    </div>
    </>
  )
}
