# Mind Match Pro

A modern, responsive memory card game built with React, Vite, and Vanilla CSS. The game challenges players to match pairs of tech logo cards while tracking moves, accuracy, streaks, and time across multiple difficulty levels and game modes.

## Overview

Mind Match Pro provides an interactive and engaging user experience with 3D card-flipping animations, procedural Web Audio sound synthesis, haptic feedback, real-time combos, and persistent state storage. The entire interface is optimized to fit completely inside the screen viewport with zero scrolling required on both desktop and mobile devices.

## Features

### Game Modes
- Classic Mode: Play at your own pace with a count-up timer, tracking your total elapsed time and moves.
- Time Attack Mode: Race against a countdown timer (45s on Easy, 60s on Medium, 75s on Hard). Every successful pair matched awards a bonus of 4 seconds.

### Difficulty Levels
- Easy: 12 cards (6 pairs) in a 4x3 grid.
- Medium: 16 cards (8 pairs) in a 4x4 grid.
- Hard: 20 cards (10 pairs) in a 5x4 grid.

### Combo and Streak System
- Consecutive matches build a combo multiplier (2x, 3x, etc.).
- Audio chimes dynamically pitch upward with each consecutive match.
- Missing a match resets the streak to zero.

### Interactive Feedback
- Card Shake Animation: When two non-matching cards are selected, they shake horizontally with a brief warning glow before flipping back.
- Haptic Feedback: Integrated vibration patterns via the Web Vibration API for clicks, successful matches, and mismatches on mobile devices.
- Built-in Web Audio: Lightweight sound synthesizer using the Web Audio API for flips, matches, mismatches, and victory fanfares without external audio file dependencies.
- Confetti Celebration: Celebration effect upon winning with star ratings based on performance.

### User Experience and Customization
- Bilingual Support: Instant language toggle between Arabic (RTL) and English (LTR).
- Player Profile: Editable player username saved in local storage.
- Auto-Save and State Persistence: Active games, board layout, elapsed time, and moves are preserved across browser refreshes.
- Confirmation Dialogs: Safety prompt prevents accidental loss of progress when restarting or switching difficulty levels mid-game.
- Quick Peek Hint: Reveal all cards briefly for 1.2 seconds once per round.
- Strict Zero-Scroll Layout: Responsive CSS grid automatically scales to fit within 100vh on any screen size.

## Tech Stack

- Framework: React 18
- Build Tool: Vite
- Styling: Vanilla CSS (Custom tokens, Glassmorphism, 3D Transforms)
- Icons: Lucide React
- Effects: Canvas Confetti
- Sound: Web Audio API (Synthesized)

## Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/OfficialMoSaleh/React-Memory-Game.git
cd React-Memory-Game
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to:
```
http://localhost:5173
```

### Production Build

To generate the optimized production bundle:
```bash
npm run build
```

To preview the production build locally:
```bash
npm run preview
```

## Project Structure

```
React-Memory-Game/
├── public/
│   └── img/                 # Card icons and assets
├── src/
│   ├── components/
│   │   ├── ConfirmModal.jsx # Reset and mode confirmation dialog
│   │   ├── ConfirmModal.css
│   │   ├── SingleCard.jsx   # 3D interactive card component
│   │   ├── SingleCard.css
│   │   ├── StatsBar.jsx     # Header dashboard, metrics, and controls
│   │   ├── StatsBar.css
│   │   ├── VictoryModal.jsx # Win and game over celebration modal
│   │   └── VictoryModal.css
│   ├── utils/
│   │   ├── audio.js         # Web Audio API sound generator
│   │   └── translations.js  # Arabic and English dictionary
│   ├── App.jsx              # Main game logic and state management
│   ├── App.css              # Layout and grid definitions
│   ├── index.css            # Base styles and theme variables
│   └── main.jsx             # React application entry point
├── index.html
├── package.json
└── vite.config.js
```

## Author

Mohamed Saleh
Website: https://memory-game-23.vercel.app/
