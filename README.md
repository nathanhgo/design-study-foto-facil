# FotoFácil v2 (Design Prototype) 🎨

> A modern web interface prototype for the FotoFácil ecosystem, focusing on User Experience (UX), component modularity, and client-side performance.

### 💡 About the Project
This repository represents a **Design Study** for the evolution of the FotoFácil project. While the [v1 Legacy](https://github.com/nathanhgo/fotofacil) focused on backend algorithms, **v2** focuses on the **Frontend Architecture** and **User Interface**.

The goal was to create a seamless, app-like experience using **React** and **Material UI**, moving basic image manipulations (cropping, filters) to the client-side to reduce server load and latency.

### 🛠️ Tech Stack
![Next.js](https://img.shields.io/badge/next.js-%23000000.svg?style=for-the-badge&logo=next.js&logoColor=white)
![React](https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB)
![MUI](https://img.shields.io/badge/MUI-%230081CB.svg?style=for-the-badge&logo=mui&logoColor=white)
![HTML5 Canvas](https://img.shields.io/badge/Canvas_API-%23E34F26.svg?style=for-the-badge&logo=html5&logoColor=white)

### ✨ Key Features & UX Concepts
- **🎨 Modern Design System:** Custom theme implementation using MUI (`src/styles/theme.js`) with a dark/purple aesthetic.
- **🖼️ Client-Side Processing:**
  - Real-time **Filter Application** (Brightness, Contrast, Saturation) using HTML5 Canvas.
  - **Non-destructive Cropping** logic implemented in the browser.
- **🧩 Component-Based Architecture:** Modular components like `EditorSidebar` and `Polaroid` cards for project management.
- **💾 Local Persistence:** Simulates backend behavior using `localStorage` for user sessions and project saving logic.

### 🎨 Color Palette
The design language is built around a high-contrast dark theme:
- **Primary Accent:** `#841F9D` (Electric Purple)
- **Background:** `#2D272C` (Deep Charcoal)
- **Surface:** `#1D1D1D` (Dark Surface)
- **Text:** `#E5DFE0` (Off-White)

### 🚀 How to Run

1. **Clone the repository**
   ```bash
   git clone [https://github.com/nathanhgo/design-study-foto-facil.git](https://github.com/nathanhgo/design-study-foto-facil.git)
   cd frontend
   ```

2. Install Dependencies

```
npm install
# or
yarn install
```

3. Run the Development Server

```bash
npm run dev
```

Open http://localhost:3000 to see the UI in action.

<hr>

Developed by @nathanhgo.
