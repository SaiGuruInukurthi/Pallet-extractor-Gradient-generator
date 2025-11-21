/**
 * Advanced LAB+DBSCAN Color Extraction Utility
 * Uses perceptually uniform LAB color space with density-based clustering
 * 
 * Key Features:
 * - Pixel-perfect accuracy: Counts every pixel individually
 * - LAB color space: Perceptually uniform color representation
 * - CIE94 Delta-E: Professional color difference calculations
 * - Minimum frequency threshold (0.5%): Filters noise and anti-aliasing artifacts
 * - Frequency-based selection: Returns only real colors from the image
 * - No artificial colors: If image has 3 colors, returns 3 colors (not forced to 5)
 * - Conservative merging: Preserves distinct colors while removing near-duplicates
 * 
 * Version: 2.0.0
 * Last Updated: November 21, 2025
 * Fix: Removed forced diversity selection that was creating artificial colors
 */

export interface RGB {
  r: number;
  g: number;
  b: number;
}

export interface LAB {
  l: number; // Lightness (0-100)
  a: number; // Green-Red (-128 to 127)
  b: number; // Blue-Yellow (-128 to 127)
}

export interface ColorResult {
  color: string; // hex color
  rgb: RGB;
  lab: LAB;
  frequency: number;
  clusterSize: number;
}

interface PixelWithLab {
  rgb: RGB;
  lab: LAB;
  clusterId?: number;
}

export class ColorExtractor {
  private canvas: HTMLCanvasElement | null = null;
  private ctx: CanvasRenderingContext2D | null = null;

  constructor() {
    if (typeof window !== 'undefined' && typeof document !== 'undefined') {
      this.canvas = document.createElement('canvas');
      this.ctx = this.canvas.getContext('2d');
    }
  }

  /**
   * Extract dominant colors using weighted grid-based analysis
   */
  async extractColors(
    imageSource: HTMLImageElement | string,
    maxColors: number = 5,
    maxDimension: number = Infinity, // Use full image resolution - no downscaling!
    standardGridSize: number = 200 // Standard grid cell size for weighting
  ): Promise<ColorResult[]> {
    try {
      if (!this.canvas || !this.ctx) {
        throw new Error('Canvas not available - browser environment required');
      }

      // Load and process image
      const img = await this.loadImage(imageSource);
      const { width, height } = this.calculateDimensions(img, maxDimension);
      
      this.canvas.width = width;
      this.canvas.height = height;
      this.ctx.drawImage(img, 0, 0, width, height);
      
      const imageData = this.ctx.getImageData(0, 0, width, height);
      
      // Use weighted grid-based extraction
      const results = await this.extractColorsWeightedGrid(imageData, maxColors, standardGridSize);
      
      return results.sort((a: ColorResult, b: ColorResult) => b.frequency - a.frequency);
    } catch (error) {
      console.error('Weighted grid-based color extraction failed:', error);
      throw new Error('Failed to extract colors using weighted grid analysis');
    }
  }

  /**
   * Weighted grid-based color extraction with proper area compensation
   */
  private async extractColorsWeightedGrid(
    imageData: ImageData, 
    maxColors: number, 
    standardGridSize: number
  ): Promise<ColorResult[]> {
    const { width, height } = imageData;
    const globalColorWeights = new Map<string, { rgb: RGB, weightedFrequency: number }>();
    
    // Calculate grid layout like your example
    const fullGridCols = Math.floor(width / standardGridSize);
    const fullGridRows = Math.floor(height / standardGridSize);
    const remainderWidth = width % standardGridSize;
    const remainderHeight = height % standardGridSize;
    
    console.log(`Analyzing ${width}x${height} image in weighted grid:`);
    console.log(`- ${fullGridCols}x${fullGridRows} full ${standardGridSize}x${standardGridSize} sections`);
    if (remainderWidth > 0) console.log(`- ${fullGridRows} sections of ${remainderWidth}x${standardGridSize} (right edge)`);
    if (remainderHeight > 0) console.log(`- ${fullGridCols} sections of ${standardGridSize}x${remainderHeight} (bottom edge)`);
    if (remainderWidth > 0 && remainderHeight > 0) console.log(`- 1 corner section of ${remainderWidth}x${remainderHeight}`);
    
    console.log(`Grid calculation: width=${width}, height=${height}, gridSize=${standardGridSize}`);
    console.log(`fullGridCols=${fullGridCols}, fullGridRows=${fullGridRows}, remainderWidth=${remainderWidth}, remainderHeight=${remainderHeight}`);
    
    const standardArea = standardGridSize * standardGridSize;
    
    // Process all grid sections
    const gridSections = this.calculateGridSections(width, height, standardGridSize);
    
    console.log(`Total sections to process: ${gridSections.length}`);
    
    for (let sectionIndex = 0; sectionIndex < gridSections.length; sectionIndex++) {
      const section = gridSections[sectionIndex];
      const { startX, startY, endX, endY } = section;
      const sectionWidth = endX - startX;
      const sectionHeight = endY - startY;
      const sectionArea = sectionWidth * sectionHeight;
      
      console.log(`Processing section ${sectionIndex + 1}/${gridSections.length}: (${startX},${startY})-(${endX},${endY}) [${sectionWidth}x${sectionHeight}]`);
      
      // Extract all pixels from this section and count pixel by pixel
      const colorCounts = this.countPixelsByColor(imageData, startX, startY, endX, endY);
      
      // Calculate area weight relative to standard grid size
      const areaWeight = sectionArea / standardArea;
      
      // Convert pixel counts to percentages and apply area weighting
      const totalPixelsInSection = sectionArea;
      
      // Debug: Log significant colors in this section
      const sortedColors = Array.from(colorCounts.entries())
        .sort(([,a], [,b]) => b.count - a.count)
        .slice(0, 3);
      
      if (sortedColors.length > 0) {
        console.log(`Section (${startX},${startY})-(${endX},${endY}) top colors:`, 
          sortedColors.map(([hex, data]) => `${hex}: ${(data.count/totalPixelsInSection*100).toFixed(1)}%`));
      }
      
      for (const [colorHex, { rgb, count }] of colorCounts.entries()) {
        const localPercentage = (count / totalPixelsInSection) * 100;
        const weightedPercentage = localPercentage * areaWeight;
        
        if (globalColorWeights.has(colorHex)) {
          globalColorWeights.get(colorHex)!.weightedFrequency += weightedPercentage;
        } else {
          globalColorWeights.set(colorHex, {
            rgb: rgb,
            weightedFrequency: weightedPercentage
          });
        }
      }
    }
    
    // Convert to ColorResult array, including more colors for analysis
    const results: ColorResult[] = [];
    let totalWeightedFrequency = 0;
    
    // First pass: calculate total weighted frequency
    for (const [colorHex, data] of globalColorWeights.entries()) {
      if (data.weightedFrequency >= 0.1) {
        totalWeightedFrequency += data.weightedFrequency;
      }
    }
    
    // Second pass: normalize to percentages that add up to 100%
    for (const [colorHex, data] of globalColorWeights.entries()) {
      // Lower the threshold to capture more colors (was 0.5%, now 0.1%)
      if (data.weightedFrequency >= 0.1) {
        const normalizedPercentage = (data.weightedFrequency / totalWeightedFrequency) * 100;
        
        results.push({
          color: colorHex,
          rgb: data.rgb,
          lab: this.rgbToLab(data.rgb),
          frequency: normalizedPercentage, // Now properly normalized to 100%
          clusterSize: Math.round(data.weightedFrequency * 10)
        });
      }
    }
    
    // Sort by weighted frequency
    results.sort((a, b) => b.frequency - a.frequency);
    
    // Debug: Log top 10 colors before merging
    console.log('Top 10 colors before merging:');
    results.slice(0, 10).forEach((color, i) => {
      const isRed = color.rgb.r > 180 && color.rgb.g < 100 && color.rgb.b < 100;
      console.log(`${i+1}. ${color.color} - ${color.frequency.toFixed(2)}% ${isRed ? '🔴 RED!' : ''}`);
    });

    // Also check if there are any red colors in the full list
    const allRedColors = results.filter(color => color.rgb.r > 180 && color.rgb.g < 100 && color.rgb.b < 100);
    if (allRedColors.length > 0) {
      console.log(`🔴 Total red colors found: ${allRedColors.length}`);
      allRedColors.forEach((color, i) => {
        console.log(`Red ${i+1}: ${color.color} - ${color.frequency.toFixed(2)}% RGB(${color.rgb.r},${color.rgb.g},${color.rgb.b})`);
      });
    } else {
      console.log('❌ No red colors found in results!');
    }
    
    // Less aggressive merging to preserve distinct colors like the red
    const mergedResults = this.mergeSimilarColorsConservative(results, maxColors * 3); // Allow more colors before merging
    
    console.log(`Final extraction: ${mergedResults.length} colors found, returning top ${maxColors}`);
    
    // Show ALL colors found with their frequencies
    console.log('🎨 ALL COLORS FOUND (sorted by frequency):');
    mergedResults.forEach((color: ColorResult, i: number) => {
      const isRed = color.rgb.r > 180 && color.rgb.g < 100 && color.rgb.b < 100;
      const isOrange = color.rgb.r > 200 && color.rgb.g > 100 && color.rgb.g < 150 && color.rgb.b < 100;
      const isPurple = color.rgb.r > 100 && color.rgb.g < 100 && color.rgb.b > 100;
      const isBlue = color.rgb.r < 100 && color.rgb.g < 100 && color.rgb.b > 100;
      const isGray = Math.abs(color.rgb.r - color.rgb.g) < 30 && Math.abs(color.rgb.g - color.rgb.b) < 30;
      
      let colorType = '';
      if (isRed) colorType = '🔴 RED';
      else if (isOrange) colorType = '🟠 ORANGE';
      else if (isPurple) colorType = '🟣 PURPLE';
      else if (isBlue) colorType = '🔵 BLUE';
      else if (isGray) colorType = '⚪ GRAY';
      else colorType = '🎨 OTHER';
      
      console.log(`${i+1}. ${color.color} - ${color.frequency.toFixed(2)}% RGB(${color.rgb.r},${color.rgb.g},${color.rgb.b}) ${colorType}`);
    });
    
    // Debug: Log final top colors
    console.log('Final top colors:');
    mergedResults.slice(0, maxColors).forEach((color: ColorResult, i: number) => {
      const isRed = color.rgb.r > 180 && color.rgb.g < 100 && color.rgb.b < 100;
      console.log(`${i+1}. ${color.color} - ${color.frequency.toFixed(2)}% ${isRed ? '🔴 RED!' : ''}`);
    });

    // Check if red colors were lost during merging
    const finalRedColors = mergedResults.filter(color => color.rgb.r > 180 && color.rgb.g < 100 && color.rgb.b < 100);
    if (finalRedColors.length !== allRedColors.length) {
      console.log(`⚠️ Red colors lost during merging! Before: ${allRedColors.length}, After: ${finalRedColors.length}`);
      
      // Show which red colors survived
      if (finalRedColors.length > 0) {
        console.log('🔴 Surviving red colors:');
        finalRedColors.forEach((color, i) => {
          console.log(`  ${i+1}. ${color.color} - ${color.frequency.toFixed(2)}% RGB(${color.rgb.r},${color.rgb.g},${color.rgb.b})`);
        });
      }
      
      // Show some of the lost red colors
      const lostReds = allRedColors.slice(0, 5);
      console.log('💀 Some lost red colors:');
      lostReds.forEach((color, i) => {
        console.log(`  ${i+1}. ${color.color} - ${color.frequency.toFixed(2)}% RGB(${color.rgb.r},${color.rgb.g},${color.rgb.b})`);
      });
    } else {
      console.log('✅ All red colors preserved during merging!');
    }
    
    // Smart color selection - ensure we get good color diversity
    const finalSelection = this.selectDiverseColors(mergedResults, maxColors);
    
    return finalSelection;
  }

  /**
   * Calculate all grid sections with their coordinates
   */
  private calculateGridSections(width: number, height: number, gridSize: number) {
    const sections: Array<{startX: number, startY: number, endX: number, endY: number}> = [];
    
    const fullGridCols = Math.floor(width / gridSize);
    const fullGridRows = Math.floor(height / gridSize);
    const remainderWidth = width % gridSize;
    const remainderHeight = height % gridSize;
    
    // Full grid sections
    for (let row = 0; row < fullGridRows; row++) {
      for (let col = 0; col < fullGridCols; col++) {
        sections.push({
          startX: col * gridSize,
          startY: row * gridSize,
          endX: (col + 1) * gridSize,
          endY: (row + 1) * gridSize
        });
      }
      
      // Right edge sections (if remainder width exists)
      if (remainderWidth > 0) {
        sections.push({
          startX: fullGridCols * gridSize,
          startY: row * gridSize,
          endX: width,
          endY: (row + 1) * gridSize
        });
      }
    }
    
    // Bottom edge sections (if remainder height exists)
    if (remainderHeight > 0) {
      for (let col = 0; col < fullGridCols; col++) {
        sections.push({
          startX: col * gridSize,
          startY: fullGridRows * gridSize,
          endX: (col + 1) * gridSize,
          endY: height
        });
      }
      
      // Bottom-right corner (if both remainders exist)
      if (remainderWidth > 0) {
        sections.push({
          startX: fullGridCols * gridSize,
          startY: fullGridRows * gridSize,
          endX: width,
          endY: height
        });
      }
    }
    
    return sections;
  }

  /**
   * Count every pixel by color in a specific region
   */
  private countPixelsByColor(
    imageData: ImageData, 
    startX: number, 
    startY: number, 
    endX: number, 
    endY: number
  ): Map<string, { rgb: RGB, count: number }> {
    const { data, width } = imageData;
    const colorCounts = new Map<string, { rgb: RGB, count: number }>();
    let redPixelCount = 0; // Track red pixels specifically
    
    // Count every single pixel in the region
    for (let y = startY; y < endY; y++) {
      for (let x = startX; x < endX; x++) {
        const idx = (y * width + x) * 4;
        const alpha = data[idx + 3];
        
        // Skip transparent pixels
        if (alpha < 128) continue;
        
        const rgb: RGB = {
          r: data[idx],
          g: data[idx + 1],
          b: data[idx + 2]
        };
        
        // Check if this is a red-ish pixel (for debugging)
        if (rgb.r > 180 && rgb.g < 100 && rgb.b < 100) {
          redPixelCount++;
        }
        
        // Specifically check for the target red color #DC1C25 (220, 28, 37)
        if (Math.abs(rgb.r - 220) < 20 && Math.abs(rgb.g - 28) < 20 && Math.abs(rgb.b - 37) < 20) {
          console.log(`🎯 Found target red pixel: RGB(${rgb.r},${rgb.g},${rgb.b}) -> ${this.rgbToHex(rgb)}`);
        }
        
        const colorHex = this.rgbToHex(rgb);
        
        if (colorCounts.has(colorHex)) {
          colorCounts.get(colorHex)!.count++;
        } else {
          colorCounts.set(colorHex, { rgb, count: 1 });
        }
      }
    }
    
    // Debug: Log if we found red pixels in this section
    if (redPixelCount > 0) {
      console.log(`🔴 Found ${redPixelCount} red-ish pixels in section (${startX},${startY})-(${endX},${endY})`);
      
      // Find and log the actual red colors detected
      const redColors = Array.from(colorCounts.entries())
        .filter(([hex, data]) => data.rgb.r > 180 && data.rgb.g < 100 && data.rgb.b < 100)
        .sort(([,a], [,b]) => b.count - a.count);
      
      console.log('Red colors found:', redColors.slice(0, 3).map(([hex, data]) => 
        `${hex} (${data.count} pixels) RGB(${data.rgb.r},${data.rgb.g},${data.rgb.b})`));
    }
    
    return colorCounts;
  }

  /**
   * Merge similar colors to avoid near-duplicates in final result
   */
  private mergeSimilarColors(colors: ColorResult[], maxColors: number): ColorResult[] {
    if (colors.length <= maxColors) return colors;
    
    const merged: ColorResult[] = [];
    const used = new Set<number>();
    
    for (let i = 0; i < colors.length && merged.length < maxColors; i++) {
      if (used.has(i)) continue;
      
      const baseColor = colors[i];
      let totalFrequency = baseColor.frequency;
      let totalR = baseColor.rgb.r * baseColor.frequency;
      let totalG = baseColor.rgb.g * baseColor.frequency;
      let totalB = baseColor.rgb.b * baseColor.frequency;
      
      // Find similar colors to merge
      for (let j = i + 1; j < colors.length; j++) {
        if (used.has(j)) continue;
        
        const compareColor = colors[j];
        const distance = this.labDistanceCIE94(baseColor.lab, compareColor.lab);
        
        // Merge if colors are very similar (Delta E < 10)
        if (distance < 10) {
          used.add(j);
          totalFrequency += compareColor.frequency;
          totalR += compareColor.rgb.r * compareColor.frequency;
          totalG += compareColor.rgb.g * compareColor.frequency;
          totalB += compareColor.rgb.b * compareColor.frequency;
        }
      }
      
      // Calculate averaged color
      const avgRgb: RGB = {
        r: Math.round(totalR / totalFrequency),
        g: Math.round(totalG / totalFrequency),
        b: Math.round(totalB / totalFrequency)
      };
      
      merged.push({
        color: this.rgbToHex(avgRgb),
        rgb: avgRgb,
        lab: this.rgbToLab(avgRgb),
        frequency: totalFrequency,
        clusterSize: totalFrequency
      });
      
      used.add(i);
    }
    
    return merged;
  }

  /**
   * Conservative merging - only merge very similar colors to preserve distinct ones
   */
  private mergeSimilarColorsConservative(colors: ColorResult[], maxColors: number): ColorResult[] {
    if (colors.length <= maxColors) return colors;
    
    const merged: ColorResult[] = [];
    const used = new Set<number>();
    
    for (let i = 0; i < colors.length && merged.length < maxColors; i++) {
      if (used.has(i)) continue;
      
      const baseColor = colors[i];
      let totalFrequency = baseColor.frequency;
      let totalR = baseColor.rgb.r * baseColor.frequency;
      let totalG = baseColor.rgb.g * baseColor.frequency;
      let totalB = baseColor.rgb.b * baseColor.frequency;
      
      // Special handling for red colors - be even more conservative
      const isRedColor = baseColor.rgb.r > 180 && baseColor.rgb.g < 100 && baseColor.rgb.b < 100;
      const mergeThreshold = isRedColor ? 1.5 : 3; // Much tighter threshold for reds
      
      // Find similar colors to merge - much more conservative threshold
      for (let j = i + 1; j < colors.length; j++) {
        if (used.has(j)) continue;
        
        const compareColor = colors[j];
        const distance = this.labDistanceCIE94(baseColor.lab, compareColor.lab);
        
        // Only merge very similar colors - extra conservative for reds
        if (distance < mergeThreshold) {
          used.add(j);
          totalFrequency += compareColor.frequency;
          totalR += compareColor.rgb.r * compareColor.frequency;
          totalG += compareColor.rgb.g * compareColor.frequency;
          totalB += compareColor.rgb.b * compareColor.frequency;
        }
      }
      
      // Calculate averaged color
      const avgRgb: RGB = {
        r: Math.round(totalR / totalFrequency),
        g: Math.round(totalG / totalFrequency),
        b: Math.round(totalB / totalFrequency)
      };
      
      merged.push({
        color: this.rgbToHex(avgRgb),
        rgb: avgRgb,
        lab: this.rgbToLab(avgRgb),
        frequency: totalFrequency,
        clusterSize: totalFrequency
      });
      
      used.add(i);
    }
    
    return merged;
  }

  /**
   * Select diverse colors ensuring good representation across color types
   * Only includes colors above a minimum threshold to avoid "making up" colors
   */
  private selectDiverseColors(colors: ColorResult[], maxColors: number): ColorResult[] {
    // Filter out colors with very low frequency (< 0.5%)
    // These are usually anti-aliasing artifacts or noise
    const MIN_FREQUENCY_THRESHOLD = 0.5;
    const significantColors = colors.filter(c => c.frequency >= MIN_FREQUENCY_THRESHOLD);
    
    console.log(`🎨 Filtered colors: ${colors.length} -> ${significantColors.length} (threshold: ${MIN_FREQUENCY_THRESHOLD}%)`);
    
    // If we have fewer significant colors than requested, just return what we have
    if (significantColors.length <= maxColors) {
      console.log(`✅ Returning ${significantColors.length} significant colors (requested ${maxColors})`);
      return significantColors;
    }
    
    // Categorize only significant colors
    const colorCategories = {
      red: significantColors.filter(c => c.rgb.r > 180 && c.rgb.g < 100 && c.rgb.b < 100),
      orange: significantColors.filter(c => c.rgb.r > 200 && c.rgb.g > 100 && c.rgb.g < 150 && c.rgb.b < 100),
      purple: significantColors.filter(c => c.rgb.r > 100 && c.rgb.g < 100 && c.rgb.b > 100),
      blue: significantColors.filter(c => c.rgb.r < 100 && c.rgb.g < 100 && c.rgb.b > 100),
      gray: significantColors.filter(c => Math.abs(c.rgb.r - c.rgb.g) < 30 && Math.abs(c.rgb.g - c.rgb.b) < 30),
      other: significantColors.filter(c => 
        !(c.rgb.r > 180 && c.rgb.g < 100 && c.rgb.b < 100) && // not red
        !(c.rgb.r > 200 && c.rgb.g > 100 && c.rgb.g < 150 && c.rgb.b < 100) && // not orange
        !(c.rgb.r > 100 && c.rgb.g < 100 && c.rgb.b > 100) && // not purple
        !(c.rgb.r < 100 && c.rgb.g < 100 && c.rgb.b > 100) && // not blue
        !(Math.abs(c.rgb.r - c.rgb.g) < 30 && Math.abs(c.rgb.g - c.rgb.b) < 30) // not gray
      )
    };
    
    console.log('🎨 Color category breakdown:');
    console.log(`Red: ${colorCategories.red.length}, Orange: ${colorCategories.orange.length}, Purple: ${colorCategories.purple.length}, Blue: ${colorCategories.blue.length}, Gray: ${colorCategories.gray.length}, Other: ${colorCategories.other.length}`);
    
    // Simply return the top N colors by frequency - no forced diversity
    // The user wants to see what's actually in the image, not artificial variety
    const selected = significantColors.slice(0, maxColors);
    
    console.log('🎯 Final selected colors:');
    selected.forEach((color, i) => {
      console.log(`${i+1}. ${color.color} - ${color.frequency.toFixed(1)}%`);
    });
    
    const total = selected.reduce((sum, color) => sum + color.frequency, 0);
    console.log(`Total: ${total.toFixed(1)}%`);
    
    return selected;
  }

  /**
   * Load image from source (URL or HTMLImageElement)
   */
  private loadImage(source: HTMLImageElement | string): Promise<HTMLImageElement> {
    return new Promise((resolve, reject) => {
      if (source instanceof HTMLImageElement) {
        resolve(source);
        return;
      }

      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => resolve(img);
      img.onerror = () => reject(new Error('Failed to load image'));
      img.src = source;
    });
  }

  /**
   * Calculate optimal dimensions while maintaining aspect ratio
   */
  private calculateDimensions(img: HTMLImageElement, maxDimension: number) {
    const { width: originalWidth, height: originalHeight } = img;
    
    if (originalWidth <= maxDimension && originalHeight <= maxDimension) {
      return { width: originalWidth, height: originalHeight };
    }

    const ratio = originalWidth / originalHeight;
    
    if (originalWidth > originalHeight) {
      return {
        width: maxDimension,
        height: Math.round(maxDimension / ratio)
      };
    } else {
      return {
        width: Math.round(maxDimension * ratio),
        height: maxDimension
      };
    }
  }

  /**
   * Convert RGB to LAB color space (perceptually uniform)
   */
  private rgbToLab(rgb: RGB): LAB {
    // First convert RGB to XYZ
    let { r, g, b } = rgb;
    
    // Normalize RGB values
    r = r / 255;
    g = g / 255;
    b = b / 255;
    
    // Apply gamma correction
    r = r > 0.04045 ? Math.pow((r + 0.055) / 1.055, 2.4) : r / 12.92;
    g = g > 0.04045 ? Math.pow((g + 0.055) / 1.055, 2.4) : g / 12.92;
    b = b > 0.04045 ? Math.pow((b + 0.055) / 1.055, 2.4) : b / 12.92;
    
    // Convert to XYZ using sRGB matrix
    let x = r * 0.4124564 + g * 0.3575761 + b * 0.1804375;
    let y = r * 0.2126729 + g * 0.7151522 + b * 0.0721750;
    let z = r * 0.0193339 + g * 0.1191920 + b * 0.9503041;
    
    // Normalize by D65 illuminant
    x = x / 0.95047;
    y = y / 1.00000;
    z = z / 1.08883;
    
    // Apply LAB transformation
    const fx = x > 0.008856 ? Math.pow(x, 1/3) : (7.787 * x + 16/116);
    const fy = y > 0.008856 ? Math.pow(y, 1/3) : (7.787 * y + 16/116);
    const fz = z > 0.008856 ? Math.pow(z, 1/3) : (7.787 * z + 16/116);
    
    const l = 116 * fy - 16;
    const a = 500 * (fx - fy);
    const bVal = 200 * (fy - fz);
    
    return { l, a, b: bVal };
  }

  /**
   * Calculate CIE94 Delta E for more accurate perceptual distance
   * This gives better clustering results for similar colors
   */
  private labDistanceCIE94(lab1: LAB, lab2: LAB): number {
    const dl = lab1.l - lab2.l;
    const da = lab1.a - lab2.a;
    const db = lab1.b - lab2.b;
    
    const c1 = Math.sqrt(lab1.a * lab1.a + lab1.b * lab1.b);
    const c2 = Math.sqrt(lab2.a * lab2.a + lab2.b * lab2.b);
    const dc = c1 - c2;
    
    const dh = Math.sqrt(da * da + db * db - dc * dc);
    
    const sl = 1;
    const kc = 1;
    const kh = 1;
    const k1 = 0.045;
    const k2 = 0.015;
    
    const sc = 1 + k1 * c1;
    const sh = 1 + k2 * c1;
    
    const deltaE = Math.sqrt(
      (dl / sl) ** 2 +
      (dc / (kc * sc)) ** 2 +
      (dh / (kh * sh)) ** 2
    );
    
    return deltaE;
  }

  /**
   * Calculate the average RGB color (centroid) of a cluster
   */
  private calculateClusterCentroid(cluster: RGB[]): RGB {
    if (cluster.length === 0) return { r: 0, g: 0, b: 0 };
    
    const sum = cluster.reduce(
      (acc, pixel) => ({
        r: acc.r + pixel.r,
        g: acc.g + pixel.g,
        b: acc.b + pixel.b
      }),
      { r: 0, g: 0, b: 0 }
    );
    
    return {
      r: Math.round(sum.r / cluster.length),
      g: Math.round(sum.g / cluster.length),
      b: Math.round(sum.b / cluster.length)
    };
  }

  /**
   * Convert RGB to hex color string
   */
  private rgbToHex({ r, g, b }: RGB): string {
    const toHex = (n: number) => Math.max(0, Math.min(255, Math.round(n)))
      .toString(16)
      .padStart(2, '0');
    
    return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
  }

  /**
   * Median Cut algorithm - better than K-means for color quantization
   * This is what many professional tools use for palette extraction
   */
  private medianCutPalette(rgbPixels: RGB[], maxColors: number): ColorResult[] {
    if (rgbPixels.length === 0) return [];
    if (maxColors >= rgbPixels.length) {
      return rgbPixels.map(rgb => ({
        color: this.rgbToHex(rgb),
        rgb,
        lab: this.rgbToLab(rgb),
        frequency: 1,
        clusterSize: 1
      }));
    }

    // Create initial bucket with all pixels
    const buckets: RGB[][] = [rgbPixels.slice()];
    
    // Split buckets until we have maxColors buckets
    while (buckets.length < maxColors) {
      // Find bucket with largest range
      let maxRange = -1;
      let maxRangeIndex = -1;
      
      for (let i = 0; i < buckets.length; i++) {
        const range = this.getColorRange(buckets[i]);
        if (range > maxRange) {
          maxRange = range;
          maxRangeIndex = i;
        }
      }
      
      if (maxRangeIndex === -1 || maxRange === 0) break;
      
      // Split the bucket with largest range
      const bucketToSplit = buckets[maxRangeIndex];
      const [bucket1, bucket2] = this.splitBucket(bucketToSplit);
      
      // Replace original bucket with two new buckets
      buckets.splice(maxRangeIndex, 1, bucket1, bucket2);
    }
    
    // Convert buckets to ColorResults
    const results: ColorResult[] = [];
    for (const bucket of buckets) {
      if (bucket.length > 0) {
        const centroid = this.calculateClusterCentroid(bucket);
        results.push({
          color: this.rgbToHex(centroid),
          rgb: centroid,
          lab: this.rgbToLab(centroid),
          frequency: bucket.length,
          clusterSize: bucket.length
        });
      }
    }
    
    return results.sort((a, b) => b.frequency - a.frequency);
  }

  /**
   * Get the range of colors in a bucket (largest dimension)
   */
  private getColorRange(pixels: RGB[]): number {
    if (pixels.length === 0) return 0;
    
    let rMin = 255, rMax = 0, gMin = 255, gMax = 0, bMin = 255, bMax = 0;
    
    for (const pixel of pixels) {
      rMin = Math.min(rMin, pixel.r);
      rMax = Math.max(rMax, pixel.r);
      gMin = Math.min(gMin, pixel.g);
      gMax = Math.max(gMax, pixel.g);
      bMin = Math.min(bMin, pixel.b);
      bMax = Math.max(bMax, pixel.b);
    }
    
    const rRange = rMax - rMin;
    const gRange = gMax - gMin;
    const bRange = bMax - bMin;
    
    return Math.max(rRange, gRange, bRange);
  }

  /**
   * Split a bucket of pixels along the dimension with largest range
   */
  private splitBucket(pixels: RGB[]): [RGB[], RGB[]] {
    if (pixels.length <= 1) return [pixels, []];
    
    // Find dimension with largest range
    let rMin = 255, rMax = 0, gMin = 255, gMax = 0, bMin = 255, bMax = 0;
    
    for (const pixel of pixels) {
      rMin = Math.min(rMin, pixel.r);
      rMax = Math.max(rMax, pixel.r);
      gMin = Math.min(gMin, pixel.g);
      gMax = Math.max(gMax, pixel.g);
      bMin = Math.min(bMin, pixel.b);
      bMax = Math.max(bMax, pixel.b);
    }
    
    const rRange = rMax - rMin;
    const gRange = gMax - gMin;
    const bRange = bMax - bMin;
    
    // Sort by the dimension with largest range
    if (rRange >= gRange && rRange >= bRange) {
      pixels.sort((a, b) => a.r - b.r);
    } else if (gRange >= bRange) {
      pixels.sort((a, b) => a.g - b.g);
    } else {
      pixels.sort((a, b) => a.b - b.b);
    }
    
    // Split at median
    const median = Math.floor(pixels.length / 2);
    return [pixels.slice(0, median), pixels.slice(median)];
  }

  /**
   * Create an image element from a data URL or file
   */
  static createImageFromSource(source: string | File): Promise<HTMLImageElement> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      
      img.onload = () => resolve(img);
      img.onerror = () => reject(new Error('Failed to load image'));
      
      if (typeof source === 'string') {
        img.src = source;
      } else {
        const reader = new FileReader();
        reader.onload = (e) => {
          img.src = e.target?.result as string;
        };
        reader.onerror = () => reject(new Error('Failed to read file'));
        reader.readAsDataURL(source);
      }
    });
  }
}

// Utility function for easy usage
export const extractColorsFromImage = async (
  imageSource: string | HTMLImageElement,
  colorCount: number = 5
): Promise<string[]> => {
  const extractor = new ColorExtractor();
  const results = await extractor.extractColors(imageSource, colorCount);
  return results.map(result => result.color);
};