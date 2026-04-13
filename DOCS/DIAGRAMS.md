# System Diagrams & Visualizations

**Color Palette Extractor - Visual Documentation**  
**Version:** 2.0.0 | **Last Updated:** April 13, 2026

This document contains comprehensive diagrams illustrating the system architecture, data flows, state machines, and interactions.

---

## Table of Contents

1. [System Architecture Diagram](#system-architecture-diagram)
2. [Component Hierarchy Diagram](#component-hierarchy-diagram)
3. [Data Flow Diagram](#data-flow-diagram)
4. [Color Extraction Sequence Diagram](#color-extraction-sequence-diagram)
5. [Application State Diagram](#application-state-diagram)
6. [Color Processing State Machine](#color-processing-state-machine)
7. [User Interaction Flow Diagram](#user-interaction-flow-diagram)
8. [Class Diagram](#class-diagram)
9. [Deployment Architecture Diagram](#deployment-architecture-diagram)
10. [Process Flow Diagram](#process-flow-diagram)

---

## System Architecture Diagram

```mermaid
graph TB
    User["👤 User<br/>(Browser)"]
    
    subgraph Frontend["🎨 Frontend Layer (React Components)"]
        Home["Home<br/>(Server Component)"]
        GradientDemo["GradientDemo<br/>(Client Component)"]
        AnimBg["AnimatedBackground<br/>(Client Component)"]
        UI["UI Components<br/>(Button, Card)"]
    end
    
    subgraph BizLogic["⚙️ Business Logic Layer"]
        Extractor["ColorExtractor Class"]
        Convert["Color Space<br/>Conversion"]
        Cluster["Color Clustering<br/>& Merging"]
        Utils["Utility Functions"]
    end
    
    subgraph Platform["🌐 Platform Layer (Browser APIs)"]
        Canvas["Canvas API<br/>(Image Processing)"]
        File["FileReader API<br/>(File Upload)"]
        Clipboard["Clipboard API<br/>(Copy to Clipboard)"]
        DOM["DOM APIs<br/>(User Interactions)"]
    end
    
    subgraph Deploy["☁️ Deployment & CDN"]
        Vercel["Vercel Edge Network"]
        Analytics["Vercel Analytics"]
    end
    
    User -->|"Interacts"| Frontend
    Frontend -->|"Uses"| BizLogic
    BizLogic -->|"Calls"| Platform
    Frontend -->|"Served by"| Deploy
    Deploy -->|"Tracks"| Analytics
    
    style Frontend fill:#e1f5ff
    style BizLogic fill:#f3e5f5
    style Platform fill:#e8f5e9
    style Deploy fill:#fff3e0
```

**Components:**
- **Frontend:** React components managing UI and user interactions
- **Business Logic:** Color extraction algorithms and data processing
- **Platform:** Native browser APIs for image/file handling
- **Deployment:** Vercel CDN for distribution and analytics

---

## Component Hierarchy Diagram

```mermaid
graph TD
    RootLayout["🔧 RootLayout<br/>(layout.tsx)<br/>Metadata, Fonts, Analytics"]
    
    Home["📄 Home<br/>(page.tsx)<br/>Server Component"]
    
    AnimBg["✨ AnimatedBackground<br/>(animated-background.tsx)<br/>Floating Icons, Animations"]
    Icons["🎨 Design Icons<br/>(Palette, Layers, Grid, etc.)"]
    
    GradientDemo["🎯 GradientDemo<br/>(gradient-demo.tsx)<br/>Main Application"]
    
    UploadSection["📤 Upload Section<br/>File Input, Drag & Drop"]
    ColorDisplay["🎨 Color Display<br/>Palette Grid, Details"]
    GradSelector["🎪 Gradient Selector<br/>Type Selection"]
    GradDisplay["🌈 Gradient Display<br/>Preview Cards"]
    
    Buttons["🔘 Buttons<br/>(UI Component)"]
    Cards["📦 Cards<br/>(UI Component)"]
    
    RootLayout --> Home
    Home --> AnimBg
    Home --> GradientDemo
    
    AnimBg --> Icons
    
    GradientDemo --> UploadSection
    GradientDemo --> ColorDisplay
    GradientDemo --> GradSelector
    GradientDemo --> GradDisplay
    
    UploadSection --> Buttons
    ColorDisplay --> Cards
    GradSelector --> Buttons
    GradDisplay --> Cards
    
    style RootLayout fill:#fff9c4
    style Home fill:#c8e6c9
    style GradientDemo fill:#bbdefb
    style AnimBg fill:#f8bbd0
```

**Hierarchy Levels:**
- **Level 1:** Root layout with metadata
- **Level 2:** Home page component
- **Level 3:** Feature components (Gradient Demo, Animated Background)
- **Level 4:** Section components (Upload, Color Display, etc.)
- **Level 5:** UI primitives (Buttons, Cards)

---

## Data Flow Diagram

```mermaid
graph LR
    User["👤 User<br/>Action"]
    
    Upload["📤 Upload<br/>Image"]
    Preview["👁️ Show<br/>Preview"]
    Extract["⚡ Extract<br/>Colors"]
    Process["🔄 Process<br/>Pixels"]
    Convert["🎨 Convert<br/>to LAB"]
    Merge["🔀 Merge<br/>Colors"]
    Filter["🚫 Filter<br/>Noise"]
    Sort["↕️ Sort by<br/>Frequency"]
    Display["📊 Display<br/>Palette"]
    Generate["🌈 Generate<br/>Gradients"]
    Render["✅ Render<br/>Results"]
    Copy["📋 Copy<br/>to Clipboard"]
    
    User -->|"Select File"| Upload
    Upload --> Preview
    User -->|"Click Extract"| Extract
    Extract --> Process
    Process --> Convert
    Convert --> Merge
    Merge --> Filter
    Filter --> Sort
    Sort --> Display
    User -->|"Colors ready"| Generate
    Generate --> Render
    User -->|"Click Copy"| Copy
    Copy -->|"Success"| Render
    
    style User fill:#ffccbc
    style Upload fill:#fff9c4
    style Extract fill:#c8e6c9
    style Display fill:#bbdefb
    style Generate fill:#e1bee7
    style Render fill:#b2dfdb
```

**Data Flow:**
1. User uploads image
2. Extraction processes pixels
3. Colors converted and merged
4. Results filtered and sorted
5. Display in palette
6. User can copy or generate gradients

---

## Color Extraction Sequence Diagram

```mermaid
sequenceDiagram
    participant User
    participant UI as GradientDemo
    participant Extractor as ColorExtractor
    participant Canvas as Canvas API
    participant Processor as PixelProcessor
    participant State as React State
    
    User->>UI: Upload Image
    UI->>UI: setImageLoading(true)
    UI->>Canvas: Load Image
    Canvas-->>UI: Image Loaded
    UI->>UI: setUploadedImage(dataURL)
    
    User->>UI: Click Extract
    UI->>UI: setIsExtracting(true)
    UI->>Extractor: extractColors(img)
    
    Extractor->>Canvas: Draw Image
    Canvas-->>Extractor: ImageData
    
    Extractor->>Processor: Process Pixels
    Processor->>Processor: RGB → LAB
    Processor->>Processor: Count by Color
    Processor->>Processor: Calculate Weights
    Processor-->>Extractor: Color Frequency Map
    
    Extractor->>Extractor: Merge Similar Colors
    Extractor->>Extractor: Calculate Delta-E
    Extractor->>Extractor: Apply Threshold
    Extractor->>Extractor: Sort by Frequency
    
    Extractor-->>UI: ColorResult[]
    UI->>State: setExtractedColors(result)
    UI->>State: setGeneratedGradients(gradients)
    UI->>UI: setIsExtracting(false)
    UI-->>User: Display Palette
```

**Sequence:**
1. User uploads image
2. Image loads into canvas
3. Pixels extracted and processed
4. Colors converted to LAB space
5. Similar colors merged using Delta-E
6. Results displayed to user

---

## Application State Diagram

```mermaid
stateDiagram-v2
    [*] --> Idle
    
    Idle --> ImageSelected: User clicks/drags image
    Idle --> EmptyState: Initial load
    
    ImageSelected --> PreviewReady: Image loads
    PreviewReady --> ReadyToExtract: Image displayed
    
    ReadyToExtract --> Extracting: User clicks Extract
    
    Extracting --> Processing: Start processing pixels
    Processing --> Converting: Convert RGB → LAB
    Converting --> Clustering: Merge similar colors
    Clustering --> Filtering: Remove noise
    Filtering --> Sorting: Sort by frequency
    
    Sorting --> ColorsExtracted: Display results
    
    ColorsExtracted --> SelectingGradients: Gradients generated
    SelectingGradients --> GradientsReady: User sees options
    
    GradientsReady --> Copying: User clicks copy
    Copying --> CopyFeedback: Show success
    CopyFeedback --> GradientsReady: Hide feedback
    
    GradientsReady --> SelectingType: User changes gradient type
    SelectingType --> GradientsReady: Update preview
    
    GradientsReady --> Idle: User uploads new image
    ColorsExtracted --> Idle: User uploads new image
    
    note right of Extracting
        🔄 Processing
        Shows spinner
    end note
    
    note right of ColorsExtracted
        ✅ Results Ready
        Display palette
    end note
```

**State Transitions:**
- **Idle** → **ImageSelected**: User uploads image
- **ImageSelected** → **PreviewReady**: Image loads
- **ReadyToExtract** → **Extracting**: User initiates extraction
- **Extracting** → **ColorsExtracted**: Processing complete
- **ColorsExtracted** → **GradientsReady**: Gradients generated
- **GradientsReady** → **Idle**: Upload new image

---

## Color Processing State Machine

```mermaid
stateDiagram-v2
    [*] --> LoadImage
    
    LoadImage --> CalculateDimensions: Image loaded
    CalculateDimensions --> DrawCanvas: Dimensions OK
    DrawCanvas --> ExtractImageData: Canvas ready
    
    ExtractImageData --> InitializeGridSections: Data extracted
    InitializeGridSections --> ProcessSection1: Start grid analysis
    
    ProcessSection1 --> CountPixels: Analyze pixels
    CountPixels --> WeightFrequency: Apply area weight
    WeightFrequency --> StoreCounts: Add to accumulator
    
    StoreCounts --> MoreSections{More sections?}
    MoreSections --> ProcessSection1: Yes
    MoreSections --> MergeColors: No - All sections done
    
    MergeColors --> CalculateDeltaE: Compare colors
    CalculateDeltaE --> CheckThreshold{ΔE < 3.0?}
    CheckThreshold --> MergeIntoCluster: Yes - Merge
    CheckThreshold --> KeepSeparate: No - Keep separate
    
    MergeIntoCluster --> MoreComparisons{More colors?}
    KeepSeparate --> MoreComparisons
    
    MoreComparisons --> CalculateDeltaE: Yes
    MoreComparisons --> ApplyFrequencyThreshold: No - All merged
    
    ApplyFrequencyThreshold --> RemoveNoise{Freq < 0.5%?}
    RemoveNoise --> DiscardColor: Yes
    RemoveNoise --> KeepColor: No
    
    DiscardColor --> MoreColors{More colors?}
    KeepColor --> MoreColors
    
    MoreColors --> ApplyFrequencyThreshold: Yes
    MoreColors --> SortByFrequency: No - All filtered
    
    SortByFrequency --> SelectTopN: Sort descending
    SelectTopN --> [*]
```

**Processing Stages:**
1. **Load & Prepare** - Load image, calculate dimensions
2. **Grid Analysis** - Divide into sections, count pixels
3. **Color Merging** - Use Delta-E to merge similar colors
4. **Noise Filtering** - Remove colors below 0.5% threshold
5. **Sorting** - Sort by frequency, return top N

---

## User Interaction Flow Diagram

```mermaid
flowchart TD
    Start["👤 User Visits Site"]
    
    Start --> ViewInterface["👁️ View Interface<br/>Upload zone visible"]
    
    ViewInterface --> UploadChoice{User chooses<br/>upload method}
    
    UploadChoice -->|Drag & Drop| DragDrop["📁 Drag image<br/>to zone"]
    UploadChoice -->|File Input| FileClick["📁 Click to<br/>browse files"]
    
    DragDrop --> SelectFile["🖱️ Select image<br/>file from computer"]
    FileClick --> SelectFile
    
    SelectFile --> LoadImage["⏳ Image loads<br/>Show preview"]
    
    LoadImage --> DecideExtract{User satisfied<br/>with image?}
    
    DecideExtract -->|No| ViewInterface
    DecideExtract -->|Yes| ClickExtract["🔘 Click Extract<br/>Colors button"]
    
    ClickExtract --> Processing["⌛ Processing..."]
    Processing --> ShowColors["🎨 Display<br/>Color Palette"]
    
    ShowColors --> BrowseChoice{User wants<br/>to do next?}
    
    BrowseChoice -->|Copy Color| CopyOne["📋 Click color<br/>copy hex code"]
    BrowseChoice -->|Copy All| CopyAll["📋 Copy all<br/>hex codes"]
    BrowseChoice -->|View Gradients| SelectGrad["🎪 Select gradient<br/>type & preview"]
    BrowseChoice -->|New Image| ViewInterface
    
    CopyOne --> Feedback1["✅ Copied!<br/>2 sec feedback"]
    CopyAll --> Feedback1
    SelectGrad --> CopyGrad["📋 Copy gradient<br/>CSS code"]
    CopyGrad --> Feedback2["✅ Copied!"]
    
    Feedback1 --> More{Do more?}
    Feedback2 --> More
    
    More -->|Yes| BrowseChoice
    More -->|No| Start
    
    style Start fill:#fff9c4
    style ShowColors fill:#bbdefb
    style Processing fill:#ffe0b2
```

**User Journey:**
1. Upload image (drag/drop or file input)
2. Preview image
3. Extract colors
4. Choose action: copy color, copy all, select gradient
5. Copy to clipboard
6. Repeat or select new image

---

## Class Diagram

```mermaid
classDiagram
    class ColorExtractor {
        -canvas: HTMLCanvasElement | null
        -ctx: CanvasRenderingContext2D | null
        
        +constructor()
        +extractColors(imageSource, maxColors, maxDimension, gridSize): Promise Color Result[]
        -loadImage(source): Promise HTMLImageElement
        -calculateDimensions(img, maxDimension): {width, height}
        -extractColorsWeightedGrid(imageData, maxColors, gridSize): Promise ColorResult[]
        -countPixelsByColor(imageData, startX, startY, endX, endY): Map
        -calculateGridSections(width, height, gridSize): GridSection[]
        -convertRGBtoLAB(rgb): LAB
        -convertLABtoRGB(lab): RGB
        -calculateDeltaE94(lab1, lab2): number
        -rgbToHex(rgb): string
        -hexToRgb(hex): string
    }
    
    class ColorResult {
        +color: string
        +rgb: RGB
        +lab: LAB
        +frequency: number
        +clusterSize: number
    }
    
    class RGB {
        +r: number
        +g: number
        +b: number
    }
    
    class LAB {
        +l: number
        +a: number
        +b: number
    }
    
    class GridSection {
        +startX: number
        +startY: number
        +endX: number
        +endY: number
    }
    
    class GradientDemo {
        -uploadedImage: string | null
        -imageLoading: boolean
        -extractedColors: ColorResult[]
        -isExtracting: boolean
        -generatedGradients: string[]
        -selectedGradientTypes: string[]
        -copiedColor: string | null
        
        +render(): JSX.Element
        -handleFileSelect(file): void
        -handleExtractClick(): Promise void
        -generateGradients(colors): string[]
        -copyColorToClipboard(color): Promise void
        -getContrastColor(hex): string
    }
    
    ColorExtractor --> ColorResult
    ColorExtractor --> RGB
    ColorExtractor --> LAB
    ColorExtractor --> GridSection
    GradientDemo --> ColorExtractor
    GradientDemo --> ColorResult
    
    note "Color Extraction Engine"
        Main algorithm for extracting
        dominant colors from images
    end note
    
    note "UI Component"
        React component managing
        user interface and state
    end note
```

**Class Relationships:**
- `ColorExtractor` creates `ColorResult[]` objects
- `ColorExtractor` uses `RGB`, `LAB`, `GridSection` types
- `GradientDemo` uses `ColorExtractor` instance
- `GradientDemo` displays `ColorResult` objects

---

## Deployment Architecture Diagram

```mermaid
graph TB
    Dev["👨‍💻 Developer<br/>Local Machine"]
    
    Git["🔗 Git Repository<br/>GitHub - main branch"]
    
    CI["⚙️ CI/CD Pipeline<br/>Vercel Build System"]
    
    Build["🏗️ Build Process<br/>TypeScript → JavaScript"]
    
    Test["✅ Testing<br/>Type checks"]
    
    Deploy["🚀 Deployment<br/>Vercel Edge Network"]
    
    CDN["🌐 CDN<br/>Global Distribution"]
    
    Users["👥 Users<br/>Worldwide"]
    
    Analytics["📊 Analytics<br/>Vercel Analytics"]
    
    Dev -->|"git push"| Git
    Git -->|"Webhook trigger"| CI
    
    CI --> Build
    Build --> Test
    
    Test -->|"Success"| Deploy
    Test -->|"Failure"| Dev
    
    Deploy --> CDN
    CDN --> Users
    Users --> Analytics
    
    style Dev fill:#fff9c4
    style Git fill:#c8e6c9
    style CI fill:#bbdefb
    style Deploy fill:#e1bee7
    style CDN fill:#b2dfdb
    style Users fill:#ffccbc
    
    subgraph Production["🌍 Production"]
        CDN
        Users
        Analytics
    end
```

**Flow:**
1. Developer commits and pushes to GitHub
2. Webhook triggers Vercel CI/CD
3. Build process compiles TypeScript
4. Tests verify no errors
5. Success → Deploy to edge network
6. Failure → Notify developer
7. CDN distributes globally
8. Analytics track usage

---

## Process Flow Diagram

```mermaid
flowchart TD
    Start["🎬 Start:<br/>User uploads image"]
    
    subgraph ImageHandling["📤 Image Handling"]
        LoadImg["Load Image<br/>to HTMLImageElement"]
        CheckDim["Check Image<br/>Dimensions"]
        DrawCanvas["Draw to Canvas<br/>at size"]
        ExtractData["Extract Pixel Data<br/>getImageData"]
    end
    
    subgraph GridAnalysis["🔲 Grid Analysis"]
        CalcGrid["Calculate Grid<br/>Section Layout"]
        IterSections["Iterate through<br/>each section"]
        CountPixels["Count pixels<br/>by color"]
        WeightFreq["Apply area<br/>weighting"]
        AccumFreq["Accumulate<br/>frequency"]
    end
    
    subgraph ColorConversion["🎨 Color Conversion"]
        RGBtoLAB["Convert RGB<br/>→ LAB"]
        StoreLabColor["Store LAB<br/>representation"]
    end
    
    subgraph Clustering["🔀 Color Clustering"]
        CompareColors["Compare colors<br/>using Delta-E"]
        CheckThreshold["Check ΔE<br/>< 3.0?"]
        MergeColors["Merge into<br/>cluster"]
        CombineFreq["Combine<br/>frequency"]
    end
    
    subgraph Filtering["🚫 Filtering & Sorting"]
        ApplyThreshold["Apply 0.5%<br/>threshold"]
        RemoveBelowThreshold["Remove colors<br/>< 0.5%"]
        Sort["Sort by<br/>frequency"]
        SelectTopN["Select top N<br/>colors"]
    end
    
    subgraph Output["📊 Output"]
        ReturnResults["Return<br/>ColorResult[]"]
        DisplayPalette["Display Color<br/>Palette UI"]
        GenerateGradients["Generate CSS<br/>Gradients"]
        RenderUI["Render all<br/>results"]
    end
    
    End["✅ Complete:<br/>User sees palette"]
    
    Start --> ImageHandling
    ImageHandling --> GridAnalysis
    GridAnalysis --> ColorConversion
    ColorConversion --> Clustering
    Clustering --> Filtering
    Filtering --> Output
    Output --> End
    
    CheckThreshold -->|Yes| MergeColors
    CheckThreshold -->|No| CombineFreq
    CombineFreq --> Clustering
    
    ApplyThreshold --> RemoveBelowThreshold
    RemoveBelowThreshold --> Sort
    Sort --> SelectTopN
    
    style Start fill:#fff9c4
    style End fill:#c8e6c9
    style ImageHandling fill:#bbdefb
    style GridAnalysis fill:#e1bee7
    style ColorConversion fill:#b2dfdb
    style Clustering fill:#ffccbc
    style Filtering fill:#f0f4c3
    style Output fill:#d1c4e9
```

**Process Stages:**
1. **Image Handling** - Load and prepare image data
2. **Grid Analysis** - Divide into sections and count pixels
3. **Color Conversion** - Convert RGB to LAB space
4. **Clustering** - Merge similar colors
5. **Filtering & Sorting** - Apply thresholds and rank by frequency
6. **Output** - Display results to user

---

## Viewing These Diagrams

These diagrams are written in **Mermaid** syntax, which is:
- ✅ Supported on GitHub (auto-renders in README and .md files)
- ✅ Supported on GitLab
- ✅ Supported in VS Code (with extension)
- ✅ Supported in many documentation tools

**To view in VS Code:**
1. Install "Markdown Preview Mermaid Support" extension
2. Open this file in VS Code
3. Preview rendered (Cmd/Ctrl+Shift+V)

**To convert to images:**
```bash
# Using mermaid CLI
npm install -g @mermaid-js/mermaid-cli

mermaid DIAGRAMS.md
# Generates PNG images for each diagram
```

---

## Legend

### Color Coding

- 🟨 **Yellow** - Start/Input
- 🟩 **Green** - Success/Output  
- 🟦 **Blue** - Processing
- 🟫 **Purple** - Complex Logic
- 🟦 **Cyan** - Data Storage
- 🟧 **Orange** - Error/Warning

### Shape Meanings

| Shape | Meaning |
|-------|---------|
| Rectangle | Process/Action |
| Diamond | Decision/Branch |
| Rounded | Start/End State |
| Circle | Component/Module |
| Cylinder | Storage/Database |

---

## Summary

This document contains **10 comprehensive diagrams** covering:

✅ **System Architecture** - Layered component design  
✅ **Component Hierarchy** - React component tree  
✅ **Data Flow** - How data moves through the system  
✅ **Sequence Diagram** - Step-by-step color extraction  
✅ **State Machine** - Application state transitions  
✅ **Processing State** - Color algorithm states  
✅ **User Flows** - User interaction journeys  
✅ **Class Diagram** - Object-oriented design  
✅ **Deployment** - CI/CD and cloud infrastructure  
✅ **Process Flow** - Complete end-to-end process  

Use these diagrams for:
- Understanding system architecture
- Onboarding new developers
- System documentation  
- Identifying bottlenecks
- Planning improvements
- Technical discussions

---

**Created with ❤️ for the Color Palette Extractor Project**

