# David's PlayGround 🧸

Juegos educativos offline para niños, diseñado para usarse en iPad durante vuelos sin conexión a internet.

## 🎮 Juegos

- **🐶 ¿Dónde está el perro?** - Tocar el animal correcto
- **🐝 Camino de la abeja** - Arrastrar la abeja hacia la flor

## ⏱️ Funcionalidades

- **Panel de Padres**: Doble tap en ⚙️ (esquina superior derecha)
  - Código parental: **1102**
  - Timer configurable (5/10/15/30 min o ilimitado)
  - Volumen con opción de bloqueo
  - Reporte de uso (últimos 7 días)
  - Código para desbloquear cuando expire el tiempo

## 🚀 Instalación

```bash
npm install
npm run dev
```

## 📦 Build PWA

```bash
npm run build
```

Genera `dist/` listo para-deployar como PWA offline.

## 📱 Uso Offline

La app funciona 100% sin conexión gracias a Service Worker con estrategia CacheFirst.

## 🛠️ Tech Stack

- React + Vite
- vite-plugin-pwa
- react-confetti

## 📄 Licencia

MIT