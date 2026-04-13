# Developer Setup & Workflow Guide

**Color Palette Extractor - Local Development Guide**  
**Version:** 2.0.0 | **Last Updated:** April 13, 2026

---

## Table of Contents

1. [Environment Setup](#environment-setup)
2. [Development Workflow](#development-workflow)
3. [Git Workflow](#git-workflow)
4. [Code Quality](#code-quality)
5. [Debugging](#debugging)
6. [Testing](#testing)
7. [Common Development Tasks](#common-development-tasks)
8. [Project Structure](#project-structure)
9. [Useful Scripts](#useful-scripts)
10. [IDE Setup](#ide-setup)

---

## Environment Setup

### System Requirements

```
Minimum Requirements:
- Node.js: 18.0.0 or higher
- npm: 9.0.0 or higher  
           OR
- pnpm: 8.0.0 or higher
- Git: 2.30.0 or higher
- RAM: 4GB
- Disk: 2GB free

Recommended:
- Node.js: 20.x LTS or latest
- pnpm: 9.x (faster than npm)
- VS Code (with extensions)
- Chrome DevTools
```

### Step 1: Clone Repository

```bash
# Clone with HTTPS
git clone https://github.com/SaiGuruInukurthi/Pallet-extractor-Gradient-generator.git

# OR clone with SSH (if SSH key configured)
git clone git@github.com:SaiGuruInukurthi/Pallet-extractor-Gradient-generator.git

# Navigate to project
cd Pallet-extractor-Gradient-generator
```

### Step 2: Install Node.js

**Windows:**
```bash
# Via winget (Windows 11+)
winget install OpenJS.NodeJS.LTS

# OR download from https://nodejs.org
# Choose LTS version
```

**macOS:**
```bash
# Via Homebrew
brew install node

# OR download from https://nodejs.org
```

**Linux:**
```bash
# Ubuntu/Debian
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

# OR from NodeSource: https://nodejs.org
```

**Verify installation:**
```bash
node --version   # Should show v18+
npm --version    # Should show 9+
```

### Step 3: Install Dependencies

```bash
# Option 1: Using pnpm (recommended, faster)
npm install -g pnpm  # Install pnpm globally (one time)
pnpm install         # Install dependencies

# Option 2: Using npm
npm install

# Option 3: Using yarn
yarn install
```

**Expected output:**
- Downloads ~150MB of packages
- Takes 2-5 minutes depending on internet
- Creates `node_modules/` folder
- Creates `pnpm-lock.yaml` (or package-lock.json for npm)

### Step 4: Verify Installation

```bash
# Check Next.js installed
npx next --version    # Should show 14.2.16

# Check TypeScript installed
npx tsc --version     # Should show 5.0+

# Try running development server
npm run dev
# Should show:
# ▲ Next.js 14.2.16 (Compiled successfully)
# ○ Ready in 3.45s
# ▲ Local: http://localhost:3000
```

**Visit http://localhost:3000 in browser** - Should see color extractor app

---

## Development Workflow

### Daily Development Loop

```
1. Start Development Server
   npm run dev
   (Runs at http://localhost:3000)

2. Edit Code
   - Make changes in components/
   - Changes auto-reload (fast refresh)
   - Browser updates automatically

3. Test Changes
   - Visit http://localhost:3000
   - Test affected features
   - Check browser console for errors

4. Commit Changes
   git add .
   git commit -m "Feature: Add new capability"

5. Push to GitHub
   git push origin branch-name

6. Create Pull Request
   - GitHub web interface
   - Get code review
   - Merge when approved
```

### Development Server Commands

```bash
# Start development server (with hot reload)
npm run dev

# Stop server
Ctrl+C

# Restart server (if needed)
# Stop then npm run dev

# Run on different port
npm run dev -- -p 3001

# Production build (for testing)
npm run build
npm run start
```

### Fast Refresh (Hot Reload)

**Automatic on code changes:**

```typescript
// Edit this...
const color = "#FF0000"

// Save file...
// Browser instantly updates (no full reload)
// ✅ Fast development experience
```

**Caveats:**
- State resets on errors
- Requires "use client" for client components
- Works with most changes; full reload needed for config changes

---

## Git Workflow

### Branch Strategy

```
main (production)
  ↑ (PR from develop/feature)
  └── develop (staging, optional)
      ↑ (PR from feature branches)
      ├── feature/new-color-algorithm
      ├── feature/mobile-ui-improvements
      ├── fix/color-extraction-bug
      └── docs/update-api-docs
```

### Feature Branch Workflow

#### 1. Create Feature Branch

```bash
# Update main first
git checkout main
git pull origin main

# Create feature branch (naming convention)
git checkout -b feature/color-algorithm-v3
# OR
git checkout -b fix/color-extraction-edge-case
# OR
git checkout -b docs/api-documentation

# Branch name format: {type}/{description}
# Types: feature, fix, docs, refactor, perf, test, chore
```

#### 2. Make Changes

```bash
# Edit files
# Use `npm run dev` to test changes

# Stage changes
git add .
# OR stage specific files
git add components/gradient-demo.tsx lib/color-extractor.ts

# Check what's staged
git status
```

#### 3. Commit Changes

```bash
# Commit with descriptive message
git commit -m "Feat: Implement improved LAB color space conversion"

# Commit format:
# {Type}: {Description}
# 
# Types: feat, fix, docs, style, refactor, perf, test
# Description: imperative, lowercase, present tense
# ✅ "Add color caching optimization"
# ❌ "Added color cache" or "Adds color cache"

# View commits
git log --oneline -5
```

#### 4. Push Branch

```bash
# Push to GitHub
git push origin feature/color-algorithm-v3

# Track branch
git push -u origin feature/color-algorithm-v3  # First time
git push origin feature/color-algorithm-v3     # After tracking
```

#### 5. Create Pull Request

**Via GitHub Web Interface:**

1. Go to repository: https://github.com/SaiGuruInukurthi/Pallet-extractor-Gradient-generator
2. See "Compare & pull request" button
3. If not, click "Pull requests" → "New pull request"
4. Select:
   - Base branch: `main`
   - Compare branch: `feature/color-algorithm-v3`
5. Fill in PR details:
   - Title: "Feat: Implement improved LAB color space conversion"
   - Description: Explain what changed and why
   - Mention any related issues: "Fixes #123"
6. Click "Create pull request"

**PR Template:**

```markdown
## Description
Brief explanation of changes.

## Changes
- Changed color extraction algorithm
- Updated LAB conversion formulas
- Added new tests

## Related Issues
Fixes #123

## Testing
- [x] Tested with solid color images
- [x] Tested with complex gradients
- [x] Mobile responsive

## Checklist
- [x] Code follows style guide
- [x] TypeScript compilation passes
- [x] Tests written (if applicable)
- [x] Documentation updated
```

#### 6. Code Review & Merge

```bash
# After approval, merge via GitHub
# OR merge locally:
git checkout main
git pull origin main
git merge feature/color-algorithm-v3
git push origin main

# Delete branch (cleanup)
git branch -d feature/color-algorithm-v3
git push origin --delete feature/color-algorithm-v3
```

### Useful Git Commands

```bash
# View local branches
git branch

# View all branches (including remote)
git branch -a

# Switch branch
git checkout main
git checkout develop

# Update branch with latest main
git checkout feature/my-feature
git merge main
# OR
git rebase main  # Cleaner history

# View recent changes
git log --oneline -10
git log --graph --oneline --all

# Undo unpushed commits
git reset --soft HEAD~1  # Keep changes, undo commit
git reset --hard HEAD~1  # Discard commit and changes

# Stash changes (save for later)
git stash      # Save current work
git stash pop  # Restore saved work

# View what changed
git diff                           # Unstaged changes
git diff --staged                  # Staged changes
git diff main feature/my-feature   # Branch differences
```

---

## Code Quality

### TypeScript Checking

```bash
# Check for TypeScript errors
npm run build   # Includes TS check

# Or run just type check (faster)
npx tsc --noEmit
```

**Fix errors:**

```typescript
// ❌ Error: Type 'number' is not assignable to type 'string'
const name: string = 123

// ✅ Fixed
const name: string = "123"
const age: number = 123
```

### Linting

```bash
# Run linter
npm run lint

# Fix auto-fixable issues
npx next lint --fix
```

**Common lint errors:**

```typescript
// ❌ Unused variable
const unused = "value"

// ✅ Removed
// Or use it

// ❌ Unused import
import { unusedFunction } from 'module'

// ✅ Removed
import { usedFunction } from 'module'

// ❌ Missing 'use client' in client component
export function MyComponent() {
  const [state, setState] = useState()  // Error: setState is client-only
}

// ✅ Add directive
"use client"
export function MyComponent() {
  const [state, setState] = useState()  // OK
}
```

### Code Formatting

**Automated via Prettier** (configured via Next.js):

```bash
# Auto-format code
npx prettier --write .

# OR let IDE handle it (see IDE Setup section)
```

---

## Debugging

### Browser DevTools

**Open DevTools:**
- Press `F12` or `Ctrl+Shift+I` (Windows/Linux)
- Press `Cmd+Option+I` (macOS)

**Key Tabs:**

```
1. Elements/Inspector
   - View DOM structure
   - Inspect elements
   - Check styles

2. Console
   - View logs
   - See errors
   - Run code: console.log()

3. Sources
   - See source code
   - Set breakpoints
   - Step through code

4. Network
   - Monitor requests
   - Check response times
   - Verify no errors

5. Performance
   - Record performance
   - Identify bottlenecks
   - Optimize rendering

6. Lighthouse
   - Run performance audit
   - Check accessibility
   - Get optimization tips
```

### Console Logging

```typescript
// In components/gradient-demo.tsx
const handleExtract = async () => {
  console.log('Starting color extraction...')
  try {
    const colors = await extractor.current.extractColors(img)
    console.log('Extracted colors:', colors)
    colors.forEach((c, i) => {
      console.log(`Color ${i}: ${c.color} (${c.frequency.toFixed(2)}%)`)
    })
  } catch (error) {
    console.error('Extraction failed:', error)
  }
}
```

**Console output:**
```
Starting color extraction...
Extracted colors: (5) [{…}, {…}, {…}, {…}, {…}]
Color 0: #FF5733 (25.50%)
Color 1: #3498DB (20.30%)
...
```

### Debugger

```typescript
// Set breakpoint by adding debugger statement
const handleExtract = async () => {
  debugger  // Browser will pause here when DevTools open
  const colors = await extractor.current.extractColors(img)
  console.log(colors)
}
```

**Or click line number in DevTools Sources tab to set breakpoint**

### VS Code Debugging

**Setup for Next.js debugging:**

1. Install extension: "Debugger for Firefox" or "Debugger for Chrome"
2. Create `.vscode/launch.json`:

```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "name": "Next.js",
      "type": "node",
      "request": "launch",
      "program": "${workspaceFolder}/node_modules/.bin/next",
      "args": ["dev"],
      "runtimeArgs": ["--inspect"],
      "console": "integratedTerminal",
      "internalConsoleOptions": "neverOpen"
    }
  ]
}
```

3. Press `F5` to start debugging
4. Set breakpoints in VS Code
5. Code will pause at breakpoints

---

## Testing

### Manual Testing Checklist

```
✓ Image Upload
  [ ] Drag & drop upload works
  [ ] File input click works
  [ ] Image preview shows correctly
  [ ] Unsupported file rejected

✓ Color Extraction
  [ ] Extract button works
  [ ] Loading indicator shows
  [ ] Colors display correctly
  [ ] Frequencies add up to ~100%
  
✓ Gradient Generation
  [ ] Default gradients generate
  [ ] Linear angles work (all 8)
  [ ] Radial types work (both)
  [ ] Change gradient type updates preview

✓ Copy Functionality
  [ ] Copy single color works
  [ ] Copied feedback shows
  [ ] Copy all colors works
  [ ] Clipboard contains correct data

✓ UI/UX
  [ ] Responsive on mobile
  [ ] Responsive on tablet
  [ ] Responsive on desktop
  [ ] Dark theme (GitHub colors)
  [ ] No layout shifts

✓ Performance
  [ ] Page loads in < 3s
  [ ] Color extraction < 1s (small image)
  [ ] No memory leaks
  [ ] Smooth animations
```

### Automated Testing (Optional)

```bash
# Setup testing (if not already)
npm install --save-dev jest @testing-library/react

# Run tests
npm test

# Create test file
# components/__tests__/gradient-demo.test.tsx

import { render, screen } from '@testing-library/react'
import { GradientDemo } from '@/components/gradient-demo'

describe('GradientDemo', () => {
  test('renders upload section', () => {
    render(<GradientDemo />)
    expect(screen.getByText(/upload/i)).toBeInTheDocument()
  })
})
```

---

## Common Development Tasks

### Task 1: Add a New Color Space

```typescript
// 1. Add conversion function in lib/color-extractor.ts
export function convertRGBtoXYZ(rgb: RGB): XYZ {
  // Implementation
}

// 2. Add type definition
export interface XYZ {
  x: number
  y: number
  z: number
}

// 3. Update ColorResult type if needed
export interface ColorResult {
  // ... existing fields
  xyz?: XYZ  // Optional new field
}

// 4. Test conversion
const rgb = {r: 255, g: 0, b: 0}
const xyz = convertRGBtoXYZ(rgb)
console.log(xyz)  // Verify output

// 5. Commit
git commit -m "Feat: Add XYZ color space conversion"
```

### Task 2: Modify Gradient Types

```typescript
// In components/gradient-demo.tsx

// Find gradientCategories constant
const gradientCategories = [
  {
    label: "Linear",
    options: [
      { value: "linear-0", label: "0°" },
      // ... add more angles
      { value: "linear-360", label: "360°" },
    ]
  },
  // ... add new category if needed
]

// Test new options
1. npm run dev
2. Visit http://localhost:3000
3. Upload image
4. Extract colors
5. Check new gradient options appear
```

### Task 3: Improve Performance

```typescript
// Identify bottleneck
console.time('color-extraction')
const colors = await extractor.extractColors(img)
console.timeEnd('color-extraction')
// Output: color-extraction: 250ms

// Optimize
// Option 1: Larger grid size
const colors = await extractor.extractColors(img, 5, Infinity, 300)

// Option 2: Fewer colors
const colors = await extractor.extractColors(img, 3)

// Option 3: Limit resolution
const colors = await extractor.extractColors(img, 5, 2048)

// Measure improvement
console.time('color-extraction')
const colors = await extractor.extractColors(img)
console.timeEnd('color-extraction')
// Compare times
```

### Task 4: Update Documentation

```bash
# 1. Edit documentation files in DOCS/
vim DOCS/FRONTEND_GUIDE.md

# 2. Commit changes
git add DOCS/
git commit -m "Docs: Update frontend guide with new patterns"

# 3. Push and create PR
git push origin docs/update-frontend-guide
```

---

## Project Structure

### Directory Layout

```
Pallet-extractor-Gradient-generator/
│
├── app/                        # Next.js app directory
│   ├── page.tsx               # Root page (/)
│   ├── layout.tsx             # Root layout
│   └── globals.css            # Global styles
│
├── components/                # React components
│   ├── gradient-demo.tsx      # Main app component
│   ├── animated-background.tsx# Background animation
│   ├── theme-provider.tsx     # Theme setup (if used)
│   └── ui/                    # Reusable UI components
│       ├── button.tsx
│       ├── card.tsx
│       └── ...
│
├── lib/                        # Utilities and functions
│   ├── color-extractor.ts     # Main color extraction logic
│   └── utils.ts               # Helper functions
│
├── public/                     # Static assets
│   └── images/
│
├── styles/                     # Additional styles
│   └── globals.css            # (Duplicated, consolidate)
│
├── DOCS/                       # Project documentation
│   ├── ARCHITECTURE.md
│   ├── API_DOCUMENTATION.md
│   ├── TECHNICAL_GUIDE.md
│   ├── FRONTEND_GUIDE.md
│   ├── DEPLOYMENT.md
│   └── DIAGRAMS.md
│
├── README.md                   # Project README
├── package.json               # Dependencies
├── tsconfig.json              # TypeScript config
├── next.config.mjs            # Next.js config
├── tailwind.config.ts         # Tailwind config
└── postcss.config.mjs         # PostCSS config
```

---

## Useful Scripts

```bash
# Development
npm run dev              # Start dev server (localhost:3000)
npm run dev -- -p 3001  # Different port

# Production build and test
npm run build            # Build for production
npm run start            # Run production build locally

# Quality checking
npm run lint             # Check code quality
npx tsc --noEmit         # TypeScript type check
npm run build            # Full build (includes all checks)

# Formatting
npx prettier --write .   # Auto-format all files
npx eslint . --fix       # Auto-fix lint issues

# Information
npm list                 # Show dependencies
npm outdated             # Show outdated packages
npm audit                # Security audit
```

---

## IDE Setup

### VS Code Extensions

**Recommended extensions:**

```
1. ES7+ React/Redux/React-Native snippets
   - ID: dsznajder.es7-react-js-snippets
   - Auto-complete for React

2. TypeScript Vue Plugin
   - ID: Vue.vscode-typescript-vue-plugin
   - Type support

3. Prettier - Code formatter
   - ID: esbenp.prettier-vscode
   - Auto-format on save

4. ESLint
   - ID: dbaeumer.vscode-eslint
   - Lint errors inline

5. Tailwind CSS IntelliSense
   - ID: bradlc.vscode-tailwindcss
   - Auto-complete for Tailwind classes

6. Thunder Client or REST Client
   - Test APIs if added

7. GitLens
   - ID: eamodio.gitlens
   - Git history and blame
```

**Install:**
1. Open VS Code
2. Cmd+Shift+X (Extensions)
3. Search and install each

### VS Code Settings

**`.vscode/settings.json`** (create if doesn't exist):

```json
{
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.formatOnSave": true,
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": "explicit"
  },
  "typescript.enablePromptUseWorkspaceTsdk": true,
  "editor.fontSize": 13,
  "editor.tabSize": 2,
  "editor.insertSpaces": true,
  "files.exclude": {
    "**/node_modules": true,
    "**/.next": true
  }
}
```

### Launch Configuration

**`.vscode/launch.json`** (create if doesn't exist):

```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "name": "Next.js",
      "type": "node",
      "request": "launch",
      "program": "${workspaceFolder}/node_modules/.bin/next",
      "args": ["dev"],
      "console": "integratedTerminal",
      "internalConsoleOptions": "neverOpen"
    }
  ]
}
```

---

## Summary

Development setup includes:

✅ **Environment Setup** - Node.js, dependencies, verification  
✅ **Development Loop** - Edit → Save → Test → Commit  
✅ **Git Workflow** - Feature branches, PRs, merge strategy  
✅ **Code Quality** - TypeScript, linting, formatting  
✅ **Debugging** - DevTools, console, breakpoints  
✅ **Testing** - Manual testing checklist  
✅ **Common Tasks** - Real development scenarios  
✅ **IDE Setup** - VS Code extensions and configs  

**Quick Start:**
```bash
# 1. Clone
git clone https://github.com/SaiGuruInukurthi/Pallet-extractor-Gradient-generator.git
cd Pallet-extractor-Gradient-generator

# 2. Install
npm install

# 3. Develop
npm run dev

# 4. Visit
open http://localhost:3000
```

Happy coding! 🚀

