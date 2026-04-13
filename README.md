# David's PlayGround 🧸

Offline educational games for children, designed for use on iPad during flights without an internet connection.

## 🎮 Games

- **🐶 Where is the Dog?** – Tap the correct animal.
- **🐝 Bee's Path** – Drag the bee toward the flower.

## ⏱️ Features

- **Parental Panel**: Double tap on ⚙️ (top right corner)
  - Parental code: **1102**
  - Configurable timer (5/10/15/30 min or unlimited)
  - Volume with lock option
  - Usage report (last 7 days)
  - Unlock code for when time expires

## 🚀 Installation

```bash
npm install
npm run dev


📦 Build PWA

```bash
npm run build

Generates a dist/ folder ready to be deployed as an offline PWA.

📱 Offline Use
The app works 100% offline thanks to a Service Worker using a CacheFirst strategy.

🛠️ Tech Stack
React + Vite

vite-plugin-pwa

react-confetti

📄 License
MIT
