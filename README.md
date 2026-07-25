# 🚀 FocusFlow - Premium MacOS + Notion Productivity Suite

FocusFlow is an award-winning, commercial-grade productivity web application built with **React 18**, **TypeScript**, **Vite**, **Tailwind CSS**, **Framer Motion**, **Zustand**, and **Supabase**.

Designed with aesthetics inspired by MacOS, Notion, and Arc Browser — featuring glassmorphism, glowing accents, dark/light theme presets, synthesized ambient soundscapes, drag-and-drop Kanban boards, full productivity analytics, habit tracking, Notion-style docs, and an AI Productivity Coach.

---

## ✨ Features Breakdown

### 1. ⏱️ Pomodoro Engine & Presets
- **Modes**: Pomodoro (25m), Short Break (5m), Long Break (15m), and Custom (1–180m slider).
- **Presets**: Classic (25/5), Deep Work (50/10), Quick Tasks (15/3), Exam Mode (90/20), Developer Mode (60/10).
- **Interactive SVG Ring**: Smooth animated SVG circular countdown with radial gradient glow.
- **Notification Chimes & Web Audio**: Synthesized Web Audio API completion chimes and Web Notification API integration.
- **Keyboard Shortcuts**:
  - `Space`: Start / Pause Timer
  - `R`: Reset Timer
  - `F`: Enter Fullscreen Focus Mode
  - `←` / `→`: Switch Timer Modes
  - `↑` / `↓`: Adjust Duration (+1m / -1m)

### 2. 🌌 Distraction-Free Focus Mode
- Fullscreen dark backdrop (`F` key trigger).
- Shows only large countdown ring, linked Kanban task, motivational quote, and quick exit button.

### 3. 📋 Drag & Drop Kanban Task Management
- **Columns**: To Do, In Progress, Completed.
- **Task Properties**: Priority tags (Urgent, High, Medium, Low), color tags, due date, estimated vs completed pomodoros, subtask checklists.
- **Quick Add Templates**: Study Session, Coding Sprint, Book Reading, Workout, Project Assignment, Meeting Prep.
- **Filter & Sort**: Search query, priority filter, sort by date/priority/title.

### 4. 📊 Productivity Analytics Dashboard
- Interactive **Recharts**:
  - Daily Focus Time (Bar Chart)
  - Task Completion Rate (Donut Chart)
  - Most Productive Hours (Area Chart)
- Overview Stats: Total Focus Hours, Daily Streaks, Average Session Length, Longest Session.
- **CSV Data Export**.

### 5. 🗓️ Habit Tracker & Heatmap
- Track daily habits (Drink Water, Workout, Reading, Meditation, Sleep, Coding, etc.).
- 14-day visual check-in heatmap grid & active streak tracking.

### 6. 📝 Notion-Style Notes & Knowledge Base
- Rich Markdown editor with real-time preview mode and autosave.
- Folder organization, search filtering, and pinned notes.

### 7. 🎵 Ambient Binaural Sound Engine
- 6 Soundscapes: Rainstorm, Deep Forest, Coffee Shop, White Noise, Ocean Waves, Lo-Fi Chill.
- Generated on-the-fly using the Web Audio API with custom volume control.

### 8. 🎨 10 Premium Themes & Custom Accent Picker
- 10 Presets: Red, Orange, Green, Blue, Purple, Black, Midnight, Ocean, Forest, Rose Gold.
- Custom HEX accent picker & Dark/Light mode toggle.

### 9. 🤖 AI Productivity Coach
- Real-time productivity scoring engine (0–100).
- Daily flow summary, weekly insights, peak energy hour analysis, break recommendations, task prioritization.

### 10. ⌘ Floating Command Palette (Cmd+K) & Extra Tools
- `Cmd+K` / `Ctrl+K` global search & quick actions.
- Achievements & level badges system with confetti celebrations.
- Offline LocalStorage fallback & JSON Backup Export/Import.

---

## 🛠️ Tech Stack

- **Framework**: React 18 + Vite 6 + TypeScript 5
- **Styling**: Tailwind CSS v3 + CSS Glassmorphism + Custom CSS Variables
- **Animations**: Framer Motion 12 + Canvas Confetti
- **State Management**: Zustand v5
- **Charts**: Recharts v2
- **Icons**: Lucide React
- **Backend & Auth**: Supabase JS v2 + LocalStorage fallback
- **Notifications & Toast**: React Hot Toast

---

## 🚀 Installation & Local Development

### Prerequisites
- Node.js 18+
- npm or yarn / pnpm

### Quick Start

1. **Clone & Install Dependencies**:
   ```bash
   npm install
   ```

2. **Run Development Server**:
   ```bash
   npm run dev
   ```
   Open `http://localhost:3000` in your browser.

3. **Build for Production**:
   ```bash
   npm run build
   ```

---

## 🗄️ Supabase Setup (Optional)

FocusFlow runs seamlessly out of the box using LocalStorage fallback mode. To connect your live Supabase database:

1. Create a project at [Supabase.com](https://supabase.com).
2. Copy `.env.example` to `.env`:
   ```env
   VITE_SUPABASE_URL=https://your-project.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-key
   ```
3. Run the SQL schema script located in `supabase/schema.sql` inside your Supabase SQL Editor.

---

## 📜 License

Commercial Grade - Ready for Vercel, Netlify, or Cloudflare Pages deployment.
