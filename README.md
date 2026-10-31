# CineVerse 3D — Premium 3D Movie Ticket Booking Platform

> **Project Category:** Full-Stack Web Application / 3D Interactive Cinema Experience  
> **Inspired By:** BookMyShow & District  
> **Architecture Status:** Phase 1 & Phase 2 Complete (Interactive 3D Cinema Hall & Seat Selection)

---

## Overview

**CineVerse 3D** is a next-generation movie ticket booking web application designed with a dark cinematic aesthetic and 3D WebGL technology. Our core differentiator is an interactive **3D Cinema Hall Experience** where users can freely explore realistic auditoriums across 4 camera perspectives and select individual 3D seats.

---

## Phase 2 Implementation Summary (Interactive 3D Cinema Hall & Seat Selection)

In **Phase 2**, we implemented the entire interactive 3D auditorium experience:

1. **Realistic Procedural 3D Cinema Auditorium**:
   - **Curved IMAX Screen** with dynamic movie backdrop, emissive glow projection, and stage platform.
   - **Tiered Stepped Risers** accurately modeling rows A through L with realistic sightlines.
   - **Acoustic Wood-Slat Walls** with warm golden sconce downlights and exit signs.
   - **Rear Wall & Projection Booth** with projector beam illuminating the cinema screen.
   - **Elevated Balcony Tier** with glass railing and chrome handrails.
   - **Aisle Floor LEDs** providing blue guide strips along walkways.

2. **Procedural 3D Cinema Seats**:
   - Individual 3D meshes modeled with ergonomic cushions, tilted backrests, padded armrests, cup holders, and steel floor mounting pedestals.
   - Real-time visual status styling:
     - `Green` (`#10b981`): Available
     - `Blue` (`#0284c7` / `#38bdf8`): Selected (with glowing aura)
     - `Red` (`#b91c1c`): Occupied (selection prevented with feedback toast)
   - Hover magnification and pointer feedback.

3. **Camera System with 4 Perspectives**:
   - **Overview Camera**: Expansive wide angle from rear auditorium (`[0, 5.8, 16.2]`).
   - **From Stage Camera**: Front perspective looking up into the seating tiers (`[0, 1.8, -1.0]`).
   - **Balcony Camera**: Elevated VIP balcony view (`[0, 5.8, 18.2]`).
   - **Bird's Eye Camera**: Top-down architectural view for precision seat selection (`[0, 15.2, 10.2]`).
   - Smooth animated transitions between presets without scene reloading.

4. **Strict Camera Collision & Boundary Containment**:
   - Multi-layer camera constraint system:
     - Clamped coordinates on every animation frame: $X \in [-10.4, 10.4]$, $Y \in [0.85, 7.8]$, $Z \in [-1.8, 19.8]$.
     - Constrained `OrbitControls` with polar angles ($0.04\pi$ to $0.485\pi$) strictly preventing cameras from going below the floor.
     - Unbounded panning disabled (`enablePan: false`).
     - Zoom limits (`minDistance: 2.0`, `maxDistance: 18.5`).
   - **Result**: The camera physically cannot clip through walls, the screen, or exit the hall during dragging or zooming.

5. **Seat Selection Panel & Live Pricing HUD**:
   - Floating header displaying selected movie, theatre, date, and showtime.
   - Real-time seat tally (up to 8 seats max per transaction).
   - Three category tiers:
     - **Silver Class** (Front rows A–C): ₹180
     - **Gold Class** (Middle rows D–H): ₹280
     - **Premium Balcony** (VIP rows J–L): ₹420
   - Instant calculation of total price, clear selection action, and validation.

6. **2D Seat Map Fallback**:
   - Toggle button between **3D Auditorium View** and **2D Seating Plan** for low-power devices.
   - Fully synchronized with the 3D scene selection state.

7. **End-to-End Navigation Journey**:
   - `HomePage` → `Movie Details` → `Showtime Selector` → `3D Cinema Hall` (`/cinema-hall?movieId=...&theatreId=...`).
   - State and query parameters preserve all context across reloads.

---

## Tech Stack

- **Framework**: React.js (v19)
- **Bundler**: Vite (v8) + Tailwind CSS (v4)
- **3D Engine**: Three.js, `@react-three/fiber`, `@react-three/drei`
- **Routing**: React Router DOM (v7)
- **Icons**: Lucide React
- **Animations**: Framer Motion & Three.js lerp damping

---

## Getting Started

### Run the Development Server

```bash
cd frontend
npm run dev
```

Visit **`http://localhost:5173/`** in your browser.

### Test 3D Cinema Hall Directly

Visit **`http://localhost:5173/cinema-hall`** or click any showtime button on a movie details page.

### Build for Production

```bash
cd frontend
npm run build
```

---

## Next Up: Phase 3 Roadmap

- **Phase 3 — Backend & Database**:
  - Node.js + Express.js REST API service.
  - PostgreSQL database schema with Prisma ORM.
  - Authentication (JWT + bcrypt).
  - Seat availability API with ACID transaction reservations & expiration timer.
  - Admin APIs for movies, theatres, and show management.
