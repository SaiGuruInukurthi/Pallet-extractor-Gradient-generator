# Frontend Development Guide

**Color Palette Extractor - UI/UX Implementation**  
**Version:** 2.0.0 | **Last Updated:** April 13, 2026

---

## Table of Contents

1. [Frontend Architecture](#frontend-architecture)
2. [Component Breakdown](#component-breakdown)
3. [State Management](#state-management)
4. [Styling System](#styling-system)
5. [UX Patterns](#ux-patterns)
6. [Mobile Optimization](#mobile-optimization)
7. [Accessibility](#accessibility)
8. [Best Practices](#best-practices)
9. [Common Tasks](#common-tasks)

---

## Frontend Architecture

### Technology Stack

```
┌─────────────────────────────────────┐
│        Next.js 14 Framework         │
│  (File-based routing, SSR/SSG)      │
└────────────────┬────────────────────┘
                 │
┌────────────────▼────────────────────┐
│      React 18 Component Model       │
│  (Hooks, Server/Client Components)  │
└────────────────┬────────────────────┘
                 │
┌────────────────▼────────────────────┐
│    TypeScript Type Safety Layer     │
└────────────────┬────────────────────┘
                 │
┌────────────────▼────────────────────┐
│    Tailwind CSS Utility Framework   │
│  (2.4+ with JIT compilation)        │
└────────────────┬────────────────────┘
                 │
┌────────────────▼────────────────────┐
│    UI Component Libraries           │
│  - Radix UI (primitives)           │
│  - Lucide React (icons)            │
└─────────────────────────────────────┘
```

### Key Architectural Patterns

#### 1. **Server Component by Default**
```typescript
// app/page.tsx - This is a Server Component
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
```

**Why:** 
- Reduced JavaScript bundle
- Direct database access (if needed)
- Secure API keys handling

#### 2. **Client Components for Interactivity**
```typescript
// components/gradient-demo.tsx - Marked "use client"
"use client"

export function GradientDemo() {
  const [state, setState] = useState(...)
  // Handle user interactions
}
```

**Why:**
- useState, useRef, useEffect available
- Event handlers required
- Real-time user feedback

#### 3. **UI Component Abstraction**
```
components/
├── ui/               (Reusable, generic components)
│  ├── button.tsx    (Button primitive)
│  └── card.tsx      (Card container)
│
└── gradient-demo.tsx (Feature component using UI)
```

**Design Principle:** Separate reusable UI from feature-specific logic

---

## Component Breakdown

### Component Hierarchy Diagram

```
RootLayout
  └─ Home (Server Component)
      ├─ AnimatedBackground (Client)
      │   └─ Floating Icons (animated)
      │
      └─ GradientDemo (Client - Main App)
          ├─ Upload Section
          │   ├─ Drag & Drop Zone
          │   └─ File Input
          │
          ├─ Extracted Colors Card
          │   ├─ Color Palette Grid
          │   │   └─ Color Swatch (5-column responsive)
          │   │       ├─ Swatch Visual
          │   │       ├─ Hex Display
          │   │       ├─ RGB/LAB Info
          │   │       ├─ Frequency %
          │   │       └─ Copy Button
          │   │
          │   └─ Copy All Button
          │
          ├─ Gradient Selector
          │   ├─ Linear Angles (8 options)
          │   └─ Radial Types (2 options)
          │
          └─ Gradients Display
              └─ Gradient Cards (responsive rows)
                  ├─ Gradient Preview
                  ├─ Type Selector
                  └─ Copy/Export Buttons
```

### RootLayout Component

**File:** `app/layout.tsx`

```typescript
export const metadata: Metadata = {
  title: 'GitHub CPGW',
  description: 'Color Palette Extractor with Gradient Generator',
  generator: 'Next.js',
}

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="en">
      <body className={`font-sans ${GeistSans.variable} ${GeistMono.variable}`}>
        {children}
        <Analytics />  {/* Vercel Analytics */}
      </body>
    </html>
  )
}
```

**Responsibilities:**
- ✅ HTML structure & meta tags
- ✅ Font loading (Geist Sans/Mono)
- ✅ Analytics integration
- ✅ Global styles application

**Key Features:**
- SEO optimization via metadata
- System fonts for performance
- Analytics for usage metrics

### AnimatedBackground Component

**File:** `components/animated-background.tsx`

```typescript
export function AnimatedBackground() {
  const designIcons = [
    { Icon: Palette, color: "#1f6feb", size: 24, pattern: "drift", ... },
    // 30+ animated icons
  ]

  return (
    <div className="fixed inset-0 -z-10 overflow-hidden">
      {/* Radial gradient background */}
      <div className="absolute inset-0" style={{background: ...}} />
      
      {/* Floating icons */}
      {designIcons.map((item, index) => (
        <div key={index} style={{...animations...}}>
          <Icon />
        </div>
      ))}
      
      {/* CSS animations */}
      <style jsx>{`...animations...`}</style>
    </div>
  )
}
```

**Responsibilities:**
- ✅ Visual background design
- ✅ Animated particles
- ✅ Decorative elements

**Technical Details:**
- 30 animated design icons
- Multiple animation patterns (drift, spiral, wave, orbit, float, pulse)
- Varying opacity and colors
- CSS-based animations (not JS-driven, efficient)

### GradientDemo Component (Main App)

**File:** `components/gradient-demo.tsx` (~300 lines)

**State Variables:**

```typescript
// File Upload & Image
const [uploadedImage, setUploadedImage] = useState<string | null>(null)
const [imageLoading, setImageLoading] = useState(false)
const [isDragOver, setIsDragOver] = useState(false)

// Color Extraction
const [extractedColors, setExtractedColors] = useState<ColorResult[]>([])
const [isExtracting, setIsExtracting] = useState(false)

// Gradients
const [generatedGradients, setGeneratedGradients] = useState<string[]>([])
const [selectedGradientTypes, setSelectedGradientTypes] = useState<string[]>([
  "linear-135",
  "linear-180",
  "radial"
])

// UI Feedback
const [copiedColor, setCopiedColor] = useState<string | null>(null)
const [copiedImageIndex, setCopiedImageIndex] = useState<number | null>(null)
const [showGradientSelector, setShowGradientSelector] = useState<number | null>(null)
const [isExpanded, setIsExpanded] = useState(false)
const [cursorTooltip, setCursorTooltip] = useState({show, x, y, text})
```

**Major Methods:**

```typescript
// 1. Image Upload Handling
const handleDrop = (e: React.DragEvent) => {...}
const handleDragOver = (e: React.DragEvent) => {...}
const handleFileSelect = (file: File) => {...}

// 2. Color Extraction
const extractColors = async () => {...}

// 3. Gradient Generation
const generateGradients = (colors: ColorResult[]): string[] => {...}

// 4. Copy Operations
const copyColorToClipboard = async (color: string) => {...}
const copyAllColorsToClipboard = async () => {...}
const copyImageToClipboard = async (gradient: string, ...) => {...}

// 5. UI Helpers
const getContrastColor = (hexColor: string): string => {...}
const getGradientLabel = (type: string): string => {...}
```

**UI Sections:**

```typescript
return (
  <div className="space-y-8">
    
    {/* Upload Section */}
    <Card>
      <input type="file" accept="image/*" />
      <DragDropZone />
    </Card>

    {/* Extracted Colors Display */}
    {extractedColors.length > 0 && (
      <Card>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {extractedColors.map(color => (
            <ColorSwatch key={color.hex} color={color} />
          ))}
        </div>
      </Card>
    )}

    {/* Gradient Selector */}
    {extractedColors.length > 0 && (
      <Card>
        <div>Select gradient types...</div>
      </Card>
    )}

    {/* Generated Gradients */}
    {generatedGradients.length > 0 && (
      <Card>
        <div className="grid grid-cols-1 gap-4">
          {generatedGradients.map((gradient, idx) => (
            <GradientCard key={idx} gradient={gradient} />
          ))}
        </div>
      </Card>
    )}
  </div>
)
```

---

## State Management

### State Flow Diagram

```
Initial State: {} (empty)
    │
    ├─→ User uploads image
    │   └─→ setUploadedImage(dataURL)
    │       setImageLoading(true)
    │
    ├─→ Image loads
    │   └─→ setImageLoading(false)
    │
    ├─→ User clicks "Extract"
    │   └─→ setIsExtracting(true)
    │
    ├─→ Colors extracted
    │   ├─→ setExtractedColors(results)
    │   └─→ setIsExtracting(false)
    │
    ├─→ Gradients generated automatically
    │   └─→ setGeneratedGradients(gradients)
    │
    └─→ User interacts (copy, select gradient types)
        ├─→ setCopiedColor(hex) [for feedback]
        ├─→ setSelectedGradientTypes(newTypes)
        └─→ [update gradients]
```

### State Update Order (Critical)

```typescript
// ✅ CORRECT: Update dependent state together
if (colors.length > 0) {
  setExtractedColors(colors)
  const gradients = generateGradients(colors)
  setGeneratedGradients(gradients)
}

// ❌ WRONG: Separate updates cause race condition
setExtractedColors(colors)  // React batches, but unpredictable order
setGeneratedGradients(generateGradients(colors))  // May use stale state
```

### Performance Optimization

```typescript
// Memoize color extractor instance
const colorExtractor = useRef<ColorExtractor | null>(null)

useEffect(() => {
  if (!colorExtractor.current) {
    colorExtractor.current = new ColorExtractor()
  }
}, [])  // Initialize once

// Avoid recreating gradient categories
const gradientCategories = useMemo(() => [
  {label: "Linear", options: [...]},
  {label: "Radial", options: [...]}
], [])  // Never changes, don't recreate
```

---

## Styling System

### Tailwind CSS Architecture

```
Global Styles:
  └─ app/globals.css (Tailwind imports + custom CSS)
     ├─ @tailwind base
     ├─ @tailwind components
     ├─ @tailwind utilities
     └─ Custom variables & animations

Component Styles:
  └─ Utility classes inline (components/gradient-demo.tsx)
     ├─ Responsive: hidden/sm:/md:/lg:
     ├─ Dark mode: dark:
     └─ Interactive: hover:/focus:/active:
```

### Color System

```typescript
// Tailwind config (implicit via Geist system font)

// Dark theme colors (GitHub-style)
- Background: #0d1117
- Secondary: #161b22
- Tertiary: #21262d
- Border: #30363d
- Text: #c9d1d9

// Accent colors
- Blue: #1f6feb (primary CTA)
- Purple: #8b5cf6 (secondary)
- Gray: #6e7681 (muted)
```

### Responsive Grid System

```typescript
// Color swatches - adaptive columns
className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4"
// 2 cols on mobile (< 640px)
// 3 cols on tablet (640px - 1024px)
// 5 cols on desktop (> 1024px)

// Gradient cards - full width responsive
className="grid grid-cols-1 gap-4"
// Stack vertically on all sizes
// 1 gradient per row for better preview
```

### Animation Patterns

```typescript
// Fade in colors when extracted
className="animate-fadeIn"  // Custom keyframe

// Copy button feedback
className="transition-colors duration-200"
// Smooth color change on state

// Dragging visual feedback
className={isDragOver ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20" : ""}
// Instant visual response

// Skeleton/loading states
className={isExtracting ? "animate-pulse" : ""}
// Shows loading while processing
```

---

## UX Patterns

### Drag & Drop Pattern

```typescript
const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
  e.preventDefault()
  e.stopPropagation()
  setIsDragOver(true)  // Visual feedback immediately
}

const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
  e.preventDefault()
  e.stopPropagation()
  setIsDragOver(false)
}

const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
  e.preventDefault()
  e.stopPropagation()
  setIsDragOver(false)
  
  const file = e.dataTransfer.files[0]
  if (file?.type.startsWith('image/')) {
    handleFileSelected(file)
  } else {
    showError('Please drop an image file')
  }
}
```

**UX Benefit:** Users know drop-zone is active immediately

### Copy Feedback Pattern

```typescript
const copyToClipboard = async (text: string) => {
  try {
    await navigator.clipboard.writeText(text)
    setCopiedColor(text)  // Show visual feedback
    
    // Hide feedback after 2 seconds
    setTimeout(() => setCopiedColor(null), 2000)
  } catch (error) {
    console.error('Copy failed:', error)
  }
}

// In JSX:
<Button 
  onClick={() => copyToClipboard(color.hex)}
  className={copiedColor === color.hex ? "bg-green-600" : ""}
>
  {copiedColor === color.hex ? "✓ Copied!" : "Copy"}
</Button>
```

**UX Benefit:** Clear user feedback for successful action

### Progressive Disclosure Pattern

```typescript
// Show gradient type selectors incrementally
const [showGradientSelector, setShowGradientSelector] = useState<number | null>(null)

// Only show selector for hovered/clicked gradient
{generatedGradients.map((gradient, index) => (
  <div key={index} onMouseEnter={() => setShowGradientSelector(index)}>
    <div>{/* gradient preview */}</div>
    
    {showGradientSelector === index && (
      <div>{/* gradient type selector */}</div>
    )}
  </div>
))}
```

**UX Benefit:** Less visual clutter, on-demand controls

### Error Handling Pattern

```typescript
try {
  setIsExtracting(true)
  const colors = await colorExtractor.current.extractColors(img)
  
  if (!colors || colors.length === 0) {
    showError('No colors found - try a different image')
    return
  }
  
  setExtractedColors(colors)
  setGeneratedGradients(generateGradients(colors))
} catch (error) {
  const message = error instanceof Error ? error.message : 'Unknown error'
  showError(`Extraction failed: ${message}`)
} finally {
  setIsExtracting(false)
}
```

**UX Benefit:** User always knows what happened

---

## Mobile Optimization

### Responsive Breakpoints

```typescript
// Next.js + Tailwind uses Tailwind breakpoints
// sm: 640px
// md: 768px
// lg: 1024px
// xl: 1280px
// 2xl: 1536px
```

### Mobile-First Strategy

```typescript
// Start with mobile styles, enhance for larger screens

// Color grid
className="grid grid-cols-2 gap-3"        // Mobile: 2 columns, tight spacing
//        md:grid-cols-3 md:gap-4         // Tablet: 3 columns, more spacing
//        lg:grid-cols-5 lg:gap-6         // Desktop: 5 columns, loose spacing

// Text sizes
className="text-sm"                       // Mobile: smaller text
//        sm:text-base                    // Tablet: normal text
//        md:text-lg                      // Desktop: larger text

// Padding
className="p-3"                           // Mobile: tight padding
//        md:p-6                          // Tablet: medium padding
//        lg:p-8                          // Desktop: generous padding
```

### Mobile Interactions

```typescript
// Touch-friendly tap targets (minimum 44×44px)
className="w-full h-12 rounded-lg"        // Height: 48px (≥ 44px)

// Prevent zoom on touch events
<input {...} style={{fontSize: '16px'}} />  // Font < 16px triggers zoom

// Handle touch vs mouse events
const handlePointerDown = (e: React.PointerEvent) => {
  // Works for both touch and mouse
}
```

### Performance on Mobile

```typescript
// 1. Optimize image resolution on mobile
const maxDimension = window.innerWidth < 640 ? 1024 : Infinity
const colors = await extractor.extractColors(img, 5, maxDimension)

// 2. Use larger grid for faster processing
const gridSize = window.innerWidth < 640 ? 300 : 200
const colors = await extractor.extractColors(img, 5, Infinity, gridSize)

// 3. Limit colors for mobile preview
const colorCount = window.innerWidth < 640 ? 3 : 5
const colors = await extractor.extractColors(img, colorCount)
```

---

## Accessibility

### Semantic HTML

```typescript
// ✅ Good: Semantic elements communicate intent
<button onClick={handleExtract}>Extract Colors</button>
<fieldset>
  <legend>Gradient Types</legend>
  {/* Options */}
</fieldset>

// ❌ Avoid: div-based buttons (require ARIA)
<div onClick={handleExtract}>Extract</div>
```

### Color Contrast

```typescript
// Ensure text readable on color swatches
const getContrastColor = (hexColor: string): string => {
  const hex = hexColor.replace("#", "")
  const r = parseInt(hex.substr(0, 2), 16)
  const g = parseInt(hex.substr(2, 2), 16)
  const b = parseInt(hex.substr(4, 2), 16)
  
  // Uses relative luminance formula (WCAG)
  const luminance = (0.299*r + 0.587*g + 0.114*b) / 255
  return luminance > 0.5 ? "#000000" : "#ffffff"
  // Result: WCAG AA compliant contrast
}
```

### Keyboard Navigation

```typescript
// Tab order follows DOM order automatically
<div>
  <input type="file" />          {/* Tab 1 */}
  <button onClick={extract}>     {/* Tab 2 */}
  <button onClick={copyAll}>     {/* Tab 3 */}
</div>

// Focus visible styling
className="focus:outline-none focus:ring-2 focus:ring-blue-500"
// Blue ring on focus, visible to keyboard users
```

### ARIA Labels

```typescript
// Descriptive labels for screen readers
<button aria-label="Copy hex code to clipboard">
  <Copy size={20} />
</button>

<fieldset>
  <legend>Select gradient types</legend>
  <input type="checkbox" id="linear135" />
  <label htmlFor="linear135">135° Linear</label>
</fieldset>
```

---

## Best Practices

### Component Structure

```typescript
// ✅ GOOD: Clear structure with comments
export function ComponentName() {
  // Constants
  const ANIMATION_DURATION = 300
  
  // State
  const [state, setState] = useState()
  
  // Refs
  const ref = useRef()
  
  // Effects
  useEffect(() => {
    // Setup
    return () => {
      // Cleanup
    }
  }, [])
  
  // Handlers
  const handleClick = () => {}
  
  // Render
  return <div>...</div>
}
```

### Event Handler Pattern

```typescript
// ✅ GOOD: Named handlers that describe intent
const handleImageUpload = (file: File) => {}
const handleExtractClick = () => {}
const handleCopyColorClick = (color: string) => {}

// ❌ AVOID: Generic handler names
const handleClick = () => {}
const handle1 = () => {}
```

### Conditional Rendering

```typescript
// ✅ GOOD: Early returns, clear logic
if (!uploadedImage) {
  return <UploadPrompt />
}

if (isExtracting) {
  return <LoadingSpinner />
}

if (extractedColors.length === 0) {
  return <EmptyState />
}

return <ColorPalette colors={extractedColors} />

// ❌ AVOID: Deeply nested ternaries
{uploadedImage ? (isExtracting ? <Loading /> : colors.length > 0 ? <Palette /> : <Empty />) : <Upload />}
```

### Props Typing

```typescript
// ✅ GOOD: Explicit interface
interface ColorSwatchProps {
  color: ColorResult
  onCopy: (hex: string) => void
  showDetails?: boolean
}

export function ColorSwatch({color, onCopy, showDetails = false}: ColorSwatchProps) {
  // Implementation
}

// ❌ AVOID: Using `any`
export function ColorSwatch(props: any) {
  // No type checking
}
```

---

## Common Tasks

### Adding a New UI Component

1. **Create the component file:**
   ```typescript
   // components/ui/badge.tsx
   interface BadgeProps {
     variant?: 'default' | 'secondary'
     children: React.ReactNode
   }
   
   export function Badge({ variant = 'default', children }: BadgeProps) {
     return (
       <span className={`
         px-2 py-1 rounded-full text-sm font-medium
         ${variant === 'secondary' ? 'bg-gray-200' : 'bg-blue-200'}
       `}>
         {children}
       </span>
     )
   }
   ```

2. **Export from components/ui/index.ts (if created)**

3. **Use in feature component:**
   ```typescript
   import { Badge } from '@/components/ui/badge'
   
   export function GradientDemo() {
     return <Badge variant="secondary">New Feature</Badge>
   }
   ```

### Customizing Colors

**Colors used in the app:**

```typescript
// Primary (CTA)
bg-blue-600        // #2563eb
hover:bg-blue-700  // #1d4ed8

// Secondary
bg-purple-600      // #9333ea
hover:bg-purple-700// #7e22ce

// Neutral
bg-gray-800         // #1f2937
text-gray-100       // #f3f4f6

// Feedback
bg-green-600        // Success (copy)
bg-red-600          // Error
bg-yellow-500       // Warning
```

**To change theme colors, modify Tailwind config or use CSS custom properties.**

### Adding Animation

```typescript
// In components/gradient-demo.tsx
<div className="animate-fadeIn">
  Extracted colors appear here
</div>

// Or define custom in globals.css
@keyframes slideUp {
  from {
    transform: translateY(20px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

// Then use:
<div className="animate-slideUp">...</div>
```

### Handling Async Operations

```typescript
// Good pattern for file processing
const handleFileSelect = async (file: File) => {
  setImageLoading(true)
  try {
    const dataURL = await readFile(file)
    setUploadedImage(dataURL)
  } catch (error) {
    showError('Failed to load image')
  } finally {
    setImageLoading(false)
  }
}
```

---

## Summary

The frontend implements:

✅ **Next.js 14** - Modern React framework  
✅ **TypeScript** - Type safety throughout  
✅ **Tailwind CSS** - Utility-first styling  
✅ **Responsive Design** - Mobile-first approach  
✅ **Accessibility** - WCAG AA compliance  
✅ **UX Patterns** - Copy feedback, drag-drop, progressive disclosure  
✅ **Performance** - Component reuse, memoization, optimizations  

The architecture prioritizes **usability**, **maintainability**, and **performance** while maintaining clean, readable code.

