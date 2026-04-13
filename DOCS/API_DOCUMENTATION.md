# API Documentation

**Color Palette Extractor - Public API Reference**  
**Version:** 2.0.0 | **Last Updated:** April 13, 2026

---

## Table of Contents

1. [ColorExtractor Class](#colorextractor-class)
2. [Data Types & Interfaces](#data-types--interfaces)
3. [Method Reference](#method-reference)
4. [Usage Examples](#usage-examples)
5. [Error Handling](#error-handling)
6. [Performance Guidelines](#performance-guidelines)
7. [Color Space Reference](#color-space-reference)

---

## ColorExtractor Class

The `ColorExtractor` class is the main API for extracting dominant colors from images.

### Overview

```typescript
class ColorExtractor {
  constructor()
  async extractColors(
    imageSource: HTMLImageElement | string,
    maxColors?: number,
    maxDimension?: number,
    standardGridSize?: number
  ): Promise<ColorResult[]>
  
  private loadImage(source: HTMLImageElement | string): Promise<HTMLImageElement>
  private calculateDimensions(img: HTMLImageElement, maxDimension: number): {width: number; height: number}
  private extractColorsWeightedGrid(imageData: ImageData, maxColors: number, standardGridSize: number): Promise<ColorResult[]>
  private countPixelsByColor(imageData: ImageData, startX: number, startY: number, endX: number, endY: number): Map<string, {count: number; rgb: RGB}>
  private calculateGridSections(width: number, height: number, standardGridSize: number): GridSection[]
  private convertRGBtoLAB(rgb: RGB): LAB
  private convertLABtoRGB(lab: LAB): RGB
  private calculateDeltaE94(lab1: LAB, lab2: LAB): number
  private rgbToHex(rgb: RGB): string
  private hexToRgb(hex: string): RGB
}
```

**Instantiation:**

```typescript
const extractor = new ColorExtractor();
// No parameters required in constructor
// All configuration passed to extractColors method
```

**Environment:**

- ✅ Client-side only (requires browser environment)
- ❌ Not suitable for Node.js/server-side
- ✅ Works in Web Workers
- ✅ Works in service workers

---

## Data Types & Interfaces

### ColorResult

The primary output interface containing a single extracted color with metadata.

```typescript
interface ColorResult {
  color: string;          // CSS hex color string (e.g., "#FF5733")
  rgb: RGB;               // RGB values object
  lab: LAB;               // LAB color space values
  frequency: number;      // Percentage of image pixels (0-100)
  clusterSize: number;    // Number of colors merged into this result
}
```

**Fields:**

| Field | Type | Range | Description |
|-------|------|-------|-------------|
| `color` | string | - | CSS-compliant hex color code (#RRGGBB) |
| `rgb` | RGB | - | RGB color component object |
| `lab` | LAB | - | LAB color space representation |
| `frequency` | number | 0.5-100 | Percentage of total pixels (≥0.5% threshold) |
| `clusterSize` | number | 1+ | Count of original colors merged (indicates color presence variety) |

**Example:**

```json
{
  "color": "#FF5733",
  "rgb": { "r": 255, "g": 87, "b": 51 },
  "lab": { "l": 54.2, "a": 55.1, "b": 44.8 },
  "frequency": 12.5,
  "clusterSize": 3
}
```

### RGB Interface

Red-Green-Blue color component representation.

```typescript
interface RGB {
  r: number;  // Red channel (0-255)
  g: number;  // Green channel (0-255)
  b: number;  // Blue channel (0-255)
}
```

**Valid Range:** 0 ≤ r, g, b ≤ 255

**Examples:**

```typescript
{r: 255, g: 0, b: 0}        // Pure red
{r: 0, g: 255, b: 0}        // Pure green
{r: 0, g: 0, b: 255}        // Pure blue
{r: 128, g: 128, b: 128}    // Gray
```

### LAB Interface

Perceptually uniform color space (L*a*b*) representation.

```typescript
interface LAB {
  l: number;  // Lightness (0-100)
  a: number;  // Green-Red axis (-128 to 127)
  b: number;  // Blue-Yellow axis (-128 to 127)
}
```

**Valid Ranges:**

| Component | Min | Max | Description |
|-----------|-----|-----|-------------|
| `l` | 0 | 100 | 0=black, 100=white |
| `a` | -128 | 127 | -=green, +=red |
| `b` | -128 | 127 | -=blue, +=yellow |

**Why LAB?** LAB color space is perceptually uniform - equal distances in LAB space correspond to equal perceived color differences. This makes it ideal for color comparison and clustering.

### GridSection (Internal)

Represents a rectangular region in the image grid (used internally).

```typescript
interface GridSection {
  startX: number;   // X coordinate of top-left corner (pixels)
  startY: number;   // Y coordinate of top-left corner (pixels)
  endX: number;     // X coordinate of bottom-right corner (pixels)
  endY: number;     // Y coordinate of bottom-right corner (pixels)
}
```

---

## Method Reference

### extractColors()

**Signature:**

```typescript
async extractColors(
  imageSource: HTMLImageElement | string,
  maxColors: number = 5,
  maxDimension: number = Infinity,
  standardGridSize: number = 200
): Promise<ColorResult[]>
```

**Purpose:** Extract dominant colors from an image source.

**Parameters:**

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `imageSource` | HTMLImageElement \| string | Required | Image element or URL string |
| `maxColors` | number | 5 | Maximum number of colors to return (1-20 recommended) |
| `maxDimension` | number | Infinity | Maximum pixel dimension (width/height). If image is larger, it will be downscaled. Set to Infinity for full resolution (**default**) |
| `standardGridSize` | number | 200 | Grid cell size (pixels) for weighted analysis. Larger = faster but less detailed |

**Return Value:** `Promise<ColorResult[]>`

- Sorted by frequency (descending)
- Already filtered (≤0.5% threshold removed)
- Merged colors included
- Guaranteed non-empty if image has visible content

**Throws:** `Error` with descriptions like:
- "Canvas not available - browser environment required"
- "Failed to extract colors using weighted grid analysis"
- "Failed to load image"

**Examples:**

```typescript
// Basic usage - default parameters
const results = await extractor.extractColors(imageElement);
// Returns top 5 colors with full resolution processing

// With custom color count
const topTen = await extractor.extractColors(imageElement, 10);

// From URL string
const fromUrl = await extractor.extractColors(
  'https://example.com/image.jpg',
  7
);

// With performance optimization (smaller grid)
const fast = await extractor.extractColors(
  imageElement,
  5,
  Infinity,
  500  // Larger grid cells = faster processing
);

// With dimension limit (mobile optimization)
const mobile = await extractor.extractColors(
  imageElement,
  5,
  1024  // Cap at 1024×1024 max
);
```

**Processing Steps:**

1. Load image into memory
2. Calculate optimal dimensions
3. Draw to canvas
4. Extract image data (pixel-by-pixel)
5. Analyze with weighted grid system
6. Convert RGB colors to LAB space
7. Merge similar colors using CIE94 Delta-E
8. Filter colors below 0.5% threshold
9. Sort by frequency
10. Return top N results

**Performance:**

- Small images (< 1MB): ~100ms
- Medium images (1-5MB): ~300ms
- Large images (> 5MB): ~800-1000ms

---

## Usage Examples

### Basic Color Extraction

```typescript
import { ColorExtractor, type ColorResult } from '@/lib/color-extractor'

async function extractFromImage() {
  const extractor = new ColorExtractor()
  
  // Get image element
  const img = document.querySelector<HTMLImageElement>('img#myImage')
  if (!img) return
  
  // Extract colors
  const colors: ColorResult[] = await extractor.extractColors(img)
  
  // Display results
  colors.forEach((result, index) => {
    console.log(`Color ${index + 1}: ${result.color}`)
    console.log(`  Frequency: ${result.frequency.toFixed(2)}%`)
    console.log(`  RGB: rgb(${result.rgb.r}, ${result.rgb.g}, ${result.rgb.b})`)
    console.log(`  LAB: L${result.lab.l.toFixed(1)} a${result.lab.a.toFixed(1)} b${result.lab.b.toFixed(1)}`)
  })
}
```

### Handling File Upload

```typescript
async function handleFileUpload(event: React.ChangeEvent<HTMLInputElement>) {
  const file = event.target.files?.[0]
  if (!file) return
  
  // Validate file type
  if (!file.type.startsWith('image/')) {
    alert('Please select an image file')
    return
  }
  
  // Create image element
  const img = new Image()
  img.onload = async () => {
    const extractor = new ColorExtractor()
    const colors = await extractor.extractColors(img, 7)
    
    // Use extracted colors
    displayPalette(colors)
  }
  
  img.onerror = () => {
    alert('Failed to load image')
  }
  
  // Load image from file
  img.src = URL.createObjectURL(file)
}
```

### Generating CSS Gradients from Colors

```typescript
function generateGradient(colors: ColorResult[]): string {
  if (colors.length < 2) return 'linear-gradient(135deg, #000000, #ffffff)'
  
  const hexColors = colors.map(c => c.color).join(', ')
  return `linear-gradient(135deg, ${hexColors})`
}

// Usage
const colors = await extractor.extractColors(imageElement)
const gradient = generateGradient(colors)

// Apply to DOM
document.body.style.background = gradient
```

### Working with Color Frequency

```typescript
function getColorStats(colors: ColorResult[]) {
  return {
    dominant: colors[0],
    dominantPercent: colors[0].frequency,
    totalCovered: colors.reduce((sum, c) => sum + c.frequency, 0),
    avgFrequency: colors.reduce((sum, c) => sum + c.frequency, 0) / colors.length,
    colorVariety: colors.find(c => c.clusterSize > 1) ? 'high' : 'low'
  }
}

// Usage
const stats = getColorStats(extractedColors)
console.log(`Dominant color covers ${stats.dominantPercent.toFixed(1)}% of image`)
console.log(`Total coverage: ${stats.totalCovered.toFixed(1)}%`)
```

### Optimization for Different Scenarios

```typescript
// Scenario 1: Desktop - Full quality
const desktopColors = await extractor.extractColors(
  imageElement,
  5,
  Infinity,      // Full resolution
  200            // Standard grid size
)

// Scenario 2: Mobile - Balanced
const mobileColors = await extractor.extractColors(
  imageElement,
  5,
  2048,          // Cap at 2K
  300            // Larger grid cells
)

// Scenario 3: Real-time Preview - Speed
const previewColors = await extractor.extractColors(
  imageElement,
  3,
  1024,          // Low resolution
  500            // Large grid cells
)

// Scenario 4: Detailed Analysis - Maximum detail
const detailedColors = await extractor.extractColors(
  imageElement,
  10,
  Infinity,      // Full resolution
  100            // Small grid cells
)
```

---

## Error Handling

### Common Error Scenarios

#### Canvas Not Available

```typescript
try {
  const extractor = new ColorExtractor()
  const colors = await extractor.extractColors(imageElement)
} catch (error) {
  if (error instanceof Error) {
    if (error.message.includes('Canvas not available')) {
      console.error('Browser does not support Canvas API')
      // Provide fallback UI
    }
  }
}
```

#### Image Load Failure

```typescript
async function safeExtractColors(imageUrl: string) {
  try {
    const extractor = new ColorExtractor()
    return await extractor.extractColors(imageUrl)
  } catch (error) {
    console.error('Color extraction failed:', error)
    return []
  }
}
```

#### CORS Issues with Image URLs

```typescript
// If loading from external URL and encountering CORS error:

const img = new Image()
img.crossOrigin = "anonymous"  // Request CORS header
img.src = sourceUrl

const extractor = new ColorExtractor()
const colors = await extractor.extractColors(img)
```

### Validation Example

```typescript
function validateColorResults(colors: ColorResult[]): boolean {
  return (
    Array.isArray(colors) &&
    colors.length > 0 &&
    colors.every(color => 
      typeof color.color === 'string' &&
      color.color.match(/^#[0-9A-F]{6}$/i) &&
      color.frequency > 0 &&
      color.frequency <= 100 &&
      color.clusterSize > 0
    )
  )
}
```

---

## Performance Guidelines

### Optimization Tips

1. **Adjust Grid Size:**
   - Smaller grid (100) = more accurate but slower
   - Larger grid (500) = faster but less accurate
   - Default (200) = balanced

2. **Limit Image Dimensions:**
   - Use `maxDimension` on mobile devices
   - Example: cap mobile at 1536px

3. **Request Fewer Colors:**
   - More colors = slower processing
   - Request only what you need
   - Balance: 5-8 colors for most use cases

4. **Instance Reuse:**
   ```typescript
   // Create once, reuse multiple times
   const extractor = new ColorExtractor()
   const result1 = await extractor.extractColors(img1)
   const result2 = await extractor.extractColors(img2)
   ```

### Benchmark Results

| Configuration | Image Size | Time | Notes |
|---------------|-----------|------|-------|
| Default (grid 200) | 1920×1080 | ~250ms | Balanced |
| Fast (grid 500) | 1920×1080 | ~80ms | Preview |
| Detailed (grid 100) | 1920×1080 | ~600ms | Analysis |
| Mobile cap | 1024×768 | ~100ms | Optimized |

---

## Color Space Reference

### RGB to LAB Conversion

Used internally for perceptual color comparison.

```
Input:  RGB {r, g, b} where 0 ≤ r,g,b ≤ 255
        ↓
Process: 1. Normalize to 0-1
         2. Apply gamma correction
         3. Convert to XYZ via D65 illuminant
         4. Normalize by reference white
         5. Apply LAB formula
        ↓
Output: LAB {l, a, b} where:
        0 ≤ L* ≤ 100 (lightness)
        -128 ≤ a* ≤ 127 (green-red)
        -128 ≤ b* ≤ 127 (blue-yellow)
```

### CIE94 Delta-E Distance

Measures perceived color difference between two LAB colors.

```
ΔE94 = sqrt(
    (ΔL* / SL)² +
    (ΔC* / SC)² +
    (ΔH* / SH)²
)

Interpretation:
- ΔE < 1    : Not visible
- 1 < ΔE < 2 : Just perceptible
- 2 < ΔE < 10 : Perceptible
- ΔE > 10   : Very different

Application:
- Used for color merging in extraction
- Threshold: ΔE < 3.0 for merge (special: ΔE < 1.5 for reds)
```

### Frequency Calculation

```
frequency(color) = (pixel_count × area_weight) / total_pixels × 100

where:
- pixel_count = pixels of this color in grid section
- area_weight = section_area / standard_area
- total_pixels = width × height of entire image
- Result: percentage (0-100)

Filtering:
- Colors with frequency < 0.5% are removed (noise)
- Result: only meaningful colors included
```

---

## Summary

The ColorExtractor API provides:

✅ Simple single-method interface  
✅ Configurable processing parameters  
✅ Type-safe results  
✅ Production-ready error handling  
✅ Performance optimization options  
✅ Browser-based processing (privacy-focused)  
✅ Memory-efficient algorithms  
✅ Professional color space handling  

For implementation examples, see the `GradientDemo.tsx` component in the codebase.

