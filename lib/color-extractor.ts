/**
 * Offline K-Means Color Extraction Utility
 * Extracts dominant colors from images using pure client-side JavaScript
 */

export interface RGB {
  r: number;
  g: number;
  b: number;
}

export interface ColorResult {
  color: string; // hex color
  rgb: RGB;
  frequency: number; // how often this color appears
}

export class ColorExtractor {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;

  constructor() {
    this.canvas = document.createElement('canvas');
    this.ctx = this.canvas.getContext('2d')!;
  }

  /**
   * Extract dominant colors from an image using K-means clustering
   */
  async extractColors(
    imageSource: HTMLImageElement | string,
    k: number = 5,
    maxDimension: number = 300
  ): Promise<ColorResult[]> {
    try {
      // Load image
      const img = await this.loadImage(imageSource);
      
      // Resize for performance
      const { width, height } = this.calculateDimensions(img, maxDimension);
      this.canvas.width = width;
      this.canvas.height = height;

      // Draw and extract pixels
      this.ctx.drawImage(img, 0, 0, width, height);
      const imageData = this.ctx.getImageData(0, 0, width, height);
      
      // Sample pixels for performance
      const pixels = this.samplePixels(imageData, 1000); // Sample max 1000 pixels
      
      // Run K-means clustering
      const centroids = this.kMeans(pixels, k);
      
      // Calculate frequencies and convert to hex
      const results = this.processResults(centroids, pixels);
      
      return results.sort((a, b) => b.frequency - a.frequency);
    } catch (error) {
      console.error('Color extraction failed:', error);
      throw new Error('Failed to extract colors from image');
    }
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
   * Sample pixels efficiently for better performance
   */
  private samplePixels(imageData: ImageData, maxSamples: number): RGB[] {
    const { data, width, height } = imageData;
    const totalPixels = width * height;
    const step = Math.max(1, Math.floor(totalPixels / maxSamples));
    
    const pixels: RGB[] = [];
    
    for (let i = 0; i < data.length; i += step * 4) {
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];
      const alpha = data[i + 3];
      
      // Skip transparent pixels
      if (alpha < 128) continue;
      
      pixels.push({ r, g, b });
    }
    
    return pixels;
  }

  /**
   * K-means clustering algorithm implementation
   */
  private kMeans(pixels: RGB[], k: number, maxIterations: number = 20): RGB[] {
    if (pixels.length === 0) return [];
    if (k >= pixels.length) return pixels.slice(0, k);

    // Initialize centroids using K-means++ method
    let centroids = this.initializeCentroids(pixels, k);
    
    for (let iteration = 0; iteration < maxIterations; iteration++) {
      // Assign pixels to closest centroids
      const clusters: RGB[][] = Array(k).fill(null).map(() => []);
      
      for (const pixel of pixels) {
        const closestCentroidIndex = this.findClosestCentroid(pixel, centroids);
        clusters[closestCentroidIndex].push(pixel);
      }
      
      // Calculate new centroids
      const newCentroids: RGB[] = [];
      let hasChanged = false;
      
      for (let i = 0; i < k; i++) {
        if (clusters[i].length === 0) {
          // Keep the old centroid if no pixels assigned
          newCentroids.push(centroids[i]);
        } else {
          const newCentroid = this.calculateCentroid(clusters[i]);
          newCentroids.push(newCentroid);
          
          // Check if centroid changed significantly
          if (this.colorDistance(centroids[i], newCentroid) > 1) {
            hasChanged = true;
          }
        }
      }
      
      centroids = newCentroids;
      
      // Early convergence
      if (!hasChanged) break;
    }
    
    return centroids;
  }

  /**
   * Initialize centroids using K-means++ algorithm for better results
   */
  private initializeCentroids(pixels: RGB[], k: number): RGB[] {
    const centroids: RGB[] = [];
    
    // Choose first centroid randomly
    centroids.push(pixels[Math.floor(Math.random() * pixels.length)]);
    
    // Choose remaining centroids
    for (let i = 1; i < k; i++) {
      const distances: number[] = [];
      
      for (const pixel of pixels) {
        const minDistance = Math.min(
          ...centroids.map(centroid => this.colorDistance(pixel, centroid))
        );
        distances.push(minDistance * minDistance);
      }
      
      // Weighted random selection
      const totalDistance = distances.reduce((sum, d) => sum + d, 0);
      const randomValue = Math.random() * totalDistance;
      
      let cumulative = 0;
      for (let j = 0; j < pixels.length; j++) {
        cumulative += distances[j];
        if (cumulative >= randomValue) {
          centroids.push(pixels[j]);
          break;
        }
      }
    }
    
    return centroids;
  }

  /**
   * Find the closest centroid to a pixel
   */
  private findClosestCentroid(pixel: RGB, centroids: RGB[]): number {
    let minDistance = Infinity;
    let closestIndex = 0;
    
    for (let i = 0; i < centroids.length; i++) {
      const distance = this.colorDistance(pixel, centroids[i]);
      if (distance < minDistance) {
        minDistance = distance;
        closestIndex = i;
      }
    }
    
    return closestIndex;
  }

  /**
   * Calculate the distance between two colors
   * Uses Euclidean distance in RGB space
   */
  private colorDistance(color1: RGB, color2: RGB): number {
    const dr = color1.r - color2.r;
    const dg = color1.g - color2.g;
    const db = color1.b - color2.b;
    return Math.sqrt(dr * dr + dg * dg + db * db);
  }

  /**
   * Calculate the average color (centroid) of a cluster
   */
  private calculateCentroid(cluster: RGB[]): RGB {
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
   * Process results and calculate frequencies
   */
  private processResults(centroids: RGB[], pixels: RGB[]): ColorResult[] {
    const results: ColorResult[] = [];
    
    for (const centroid of centroids) {
      // Count how many pixels are closest to this centroid
      let frequency = 0;
      for (const pixel of pixels) {
        const closestCentroid = centroids.reduce((closest, current) =>
          this.colorDistance(pixel, current) < this.colorDistance(pixel, closest)
            ? current : closest
        );
        
        if (closestCentroid === centroid) {
          frequency++;
        }
      }
      
      results.push({
        color: this.rgbToHex(centroid),
        rgb: centroid,
        frequency: frequency / pixels.length
      });
    }
    
    return results;
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
