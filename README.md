# Color Palette Extractor

![Color Palette Extractor](https://img.shields.io/badge/Color%20Palette-Extractor-blue?style=for-the-badge)
[![Next.js](https://img.shields.io/badge/Next.js-14.2.16-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)
[![MIT License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)](LICENSE)

> A professional-grade web application that extracts dominant colors from images using advanced computer vision algorithms. Built with Next.js, TypeScript, and modern web technologies.

## 🚀 Live Demo

**[Try it now →  https://v0-ui-gradient-generator.vercel.app](https://v0-ui-gradient-generator.vercel.app/)**

## ✨ Features

### 🎨 **Advanced Color Extraction**
- **LAB Color Space Analysis**: Uses perceptually uniform LAB color space for accurate color representation
- **CIE94 Delta-E Distance**: Professional color difference calculations for precise color matching
- **Weighted Grid Analysis**: Processes images in 200×200 pixel sections with area-based frequency weighting
- **Full Resolution Processing**: Analyzes images at their original resolution (up to 4096×2304 pixels) without downscaling
- **Pixel-Perfect Accuracy**: Every pixel is counted individually for true color frequency distribution
- **Minimum Frequency Threshold**: Filters out noise and anti-aliasing artifacts (colors < 0.5%) to show only real colors
- **No Artificial Colors**: Returns only colors that actually exist in the image - no made-up or forced diversity

### 🔧 **Technical Excellence**
- **Conservative Color Merging**: Special handling for red colors (Delta-E < 1.5) vs other colors (Delta-E < 3.0)
- **Frequency-Based Selection**: Returns top N colors by actual pixel frequency, not forced diversity
- **Accurate Percentages**: Color frequencies reflect true pixel distribution without artificial inflation
- **Noise Filtering**: Automatically filters out colors below 0.5% threshold (anti-aliasing, compression artifacts)
- **Canvas-based Processing**: Browser-native image processing for optimal performance
- **Memory Efficient**: Optimized algorithms for handling large images without memory overflow

### 🖼️ **User Experience**
- **Drag & Drop Interface**: Intuitive file upload with visual feedback
- **Responsive Design**: Mobile-first approach with adaptive layouts (2/3/5 column grids)
- **One-Click Color Copying**: Click any color to copy hex code to clipboard
- **Copy All Colors**: Bulk copy all extracted colors at once
- **Real-time Extraction**: Instant color analysis with loading indicators
- **Professional UI**: Modern glassmorphism design with animated backgrounds

### 📱 **Cross-Platform Compatibility**
- **Mobile Optimized**: 2-column grid layout for small screens
- **Tablet Friendly**: 3-column grid for medium screens
- **Desktop Enhanced**: 5-column grid for large screens
- **Touch-friendly**: Large touch targets for mobile interaction

## ️ Technology Stack

- **Frontend Framework**: Next.js 14.2.16 (React 18)
- **Language**: TypeScript 5.0+
- **Styling**: Tailwind CSS 3.4
- **UI Components**: Radix UI primitives
- **Icons**: Lucide React
- **Image Processing**: HTML5 Canvas API
- **Color Science**: LAB color space with CIE94 Delta-E calculations
- **Deployment**: Vercel
- **Package Manager**: pnpm

## 📋 Prerequisites

Before setting up the project, ensure you have the following installed:

- **Node.js**: Version 18.0.0 or higher
- **pnpm**: Version 8.0.0 or higher (recommended) or npm/yarn
- **Git**: For cloning the repository

## 🏗️ Installation & Setup

### 1. Clone the Repository

```bash
# Clone the repository
git clone https://github.com/SaiGuruInukurthi/Pallet-extractor-Gradient-generator.git

# Navigate to the project directory
cd Pallet-extractor-Gradient-generator
```

### 2. Install Dependencies

```bash
# Using pnpm (recommended)
pnpm install

# Or using npm
npm install

# Or using yarn
yarn install
```

### 3. Environment Setup

The project works out of the box without additional environment variables. However, if you want to customize any settings, create a `.env.local` file:

```bash
# Optional: Add any custom environment variables here
# NEXT_PUBLIC_APP_NAME="Color Palette Extractor"
```

### 4. Start the Development Server

```bash
# Using pnpm
pnpm dev

# Or using npm
npm run dev

# Or using yarn
yarn dev
```

The application will be available at `http://localhost:3000`

### 5. Build for Production

```bash
# Create production build
pnpm build

# Start production server
pnpm start
```

## 📁 Project Structure

```
Pallet-extractor-Gradient-generator/
├── app/                          # Next.js 13+ app directory
│   ├── globals.css              # Global styles and Tailwind imports
│   ├── layout.tsx               # Root layout component
│   └── page.tsx                 # Main page component
├── components/                   # React components
│   ├── ui/                      # Reusable UI components
│   │   ├── button.tsx           # Custom button component
│   │   └── card.tsx             # Card component
│   ├── animated-background.tsx   # Animated particle background
│   ├── gradient-demo.tsx        # Main color extraction interface
│   └── theme-provider.tsx       # Dark/light theme provider
├── lib/                         # Utility libraries
│   ├── color-extractor.ts       # Core color extraction algorithms
│   └── utils.ts                 # General utility functions
├── public/                      # Static assets
│   ├── images/                  # Image assets
│   └── placeholder.*            # Placeholder images
├── styles/                      # Additional stylesheets
├── components.json              # shadcn/ui configuration
├── next.config.mjs             # Next.js configuration
├── package.json                # Dependencies and scripts
├── tailwind.config.js          # Tailwind CSS configuration
└── tsconfig.json               # TypeScript configuration
```

## 🔬 Algorithm Deep Dive

### Color Extraction Process

1. **Image Loading**: Canvas-based image loading preserving original resolution
2. **Grid Analysis**: Image divided into 200×200 pixel sections for comprehensive analysis
3. **Pixel Processing**: Each pixel converted from RGB to LAB color space and counted individually
4. **Color Counting**: Exact frequency analysis of each unique color in every pixel
5. **Noise Filtering**: Colors below 0.5% frequency threshold removed (anti-aliasing, compression artifacts)
6. **Merging**: Similar colors merged using CIE94 Delta-E distance calculations (conservative thresholds)
7. **Selection**: Returns top N colors by actual pixel frequency - no artificial diversity
8. **Result**: Only real colors from the image are returned with accurate frequency percentages

### Key Algorithms

- **LAB Color Space Conversion**: Perceptually uniform color representation
- **CIE94 Delta-E**: Industry-standard color difference calculation
- **Weighted Frequency Analysis**: Grid-based analysis with area weighting for accuracy
- **Conservative Merging**: Preserves important colors (especially reds) during merging process
- **Minimum Frequency Threshold**: 0.5% threshold filters noise while preserving real colors

## 🎯 Usage Guide

### Basic Usage

1. **Upload Image**: Drag and drop an image or click to browse
2. **Extract Colors**: The application automatically processes the image
3. **View Results**: See the dominant colors with their actual percentages (returns 3-5 colors based on what exists in the image)
4. **Copy Colors**: Click any color box to copy the hex code to clipboard
5. **Copy All**: Use the "Copy All" button to copy all hex codes at once

### Important Notes

- **Accurate Results**: The extractor only returns colors that actually exist in your image (≥0.5% frequency)
- **Variable Count**: If your image has only 3 distinct colors, you'll get 3 colors, not 5 artificial ones
- **True Percentages**: Percentages reflect actual pixel distribution in the image
- **Noise Filtering**: Anti-aliasing artifacts and compression noise are automatically filtered out

### Supported Image Formats

- JPEG/JPG
- PNG
- WebP
- GIF (static)
- BMP
- SVG

### Image Size Recommendations

- **Optimal**: 1000×1000 to 4000×4000 pixels
- **Maximum**: Up to 4096×2304 pixels (no downscaling)
- **Minimum**: 100×100 pixels for meaningful results

## 🧪 Testing

```bash
# Run type checking
pnpm type-check

# Run linting
pnpm lint

# Run build test
pnpm build
```

## 🚀 Deployment

### Vercel (Recommended)

1. Fork this repository
2. Connect your Vercel account to GitHub
3. Import the project to Vercel
4. Deploy automatically

### Manual Deployment

```bash
# Build the project
pnpm build

# The build output will be in the .next folder
# Upload this to your hosting provider
```

## 🤝 Contributing

We welcome contributions! Please see our contributing guidelines:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines

- Follow TypeScript best practices
- Use Tailwind CSS for styling
- Maintain responsive design principles
- Add comments for complex algorithms
- Test on multiple devices and browsers

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Authors

- **Sai Guru Inukurthi** - *Initial work* - [@SaiGuruInukurthi](https://github.com/SaiGuruInukurthi)
- **GitHub Community GITAM Hyderabad** - *Community support and development*

## 🙏 Acknowledgments

- **v0.app** - Initial project scaffolding and design inspiration
- **Radix UI** - Accessible component primitives
- **Tailwind CSS** - Utility-first CSS framework
- **Lucide React** - Beautiful icon library
- **Next.js Team** - Excellent React framework
- **Vercel** - Seamless deployment platform

## 📞 Support

If you have any questions or need help:

1. Check the [Issues](https://github.com/SaiGuruInukurthi/Pallet-extractor-Gradient-generator/issues) page
2. Create a new issue if your problem isn't already reported
3. Contact the maintainers

## 🔮 Future Enhancements

- [ ] Export color palettes in various formats (ASE, GPL, JSON)
- [ ] Color harmony analysis and suggestions
- [ ] Batch processing for multiple images
- [ ] Color accessibility compliance checking
- [ ] Integration with design tools (Figma, Sketch)
- [ ] Advanced color theory recommendations
- [ ] Machine learning-based color prediction

---

**Made with ❤️ by GitHub Community GITAM Hyderabad • Learn by Doing**
