import React, { useRef, useState, useEffect, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { useNavigate } from 'react-router-dom';
import * as THREE from 'three';
import { PosterScreen3D } from './PosterScreen3D';
import { MOVIES } from '../../data/moviesData';
import { 
  ChevronLeft, 
  ChevronRight, 
  Sparkles, 
  Ticket, 
  Info, 
  Star, 
  MoveHorizontal 
} from 'lucide-react';
import { FormatBadge } from '../common/Badge';

// 3D Ring Group that holds the items and rotates
const CarouselRing = ({ 
  movies, 
  targetAngle, 
  currentAngleRef, 
  onSelectMovie, 
  activeIndex, 
  radius = 5.6 
}) => {
  const groupRef = useRef();
  const count = movies.length;
  const step = (Math.PI * 2) / count;

  useFrame(() => {
    // Smooth lerp for buttery momentum
    currentAngleRef.current = THREE.MathUtils.lerp(
      currentAngleRef.current,
      targetAngle.current,
      0.09
    );

    if (groupRef.current) {
      groupRef.current.rotation.y = currentAngleRef.current;
    }
  });

  return (
    <group ref={groupRef} position={[0, -0.1, 0]}>
      {movies.map((movie, i) => {
        const theta = i * step;
        const x = radius * Math.sin(theta);
        const z = radius * Math.cos(theta);
        const rotationY = theta + Math.PI; // Face toward the center
        const isFront = i === activeIndex;

        return (
          <PosterScreen3D
            key={movie.id}
            movie={movie}
            position={[x, 0, z]}
            rotation={[0, rotationY, 0]}
            isFront={isFront}
            onSelect={onSelectMovie}
            index={i}
          />
        );
      })}

      {/* Reflected Cinema Hall Floor */}
      <mesh position={[0, -2.1, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[radius + 2, 64]} />
        <meshStandardMaterial
          color="#06080e"
          metalness={0.9}
          roughness={0.3}
        />
      </mesh>

      {/* Subtle floor glowing rings */}
      <mesh position={[0, -2.08, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[radius - 0.4, radius - 0.35, 64]} />
        <meshBasicMaterial color="#e50914" transparent opacity={0.3} />
      </mesh>
    </group>
  );
};

export const Curved3DCarousel = () => {
  const navigate = useNavigate();
  const featuredMovies = MOVIES.slice(0, 8); // Top 8 featured movies for the 3D ring
  const count = featuredMovies.length;
  const step = (Math.PI * 2) / count;

  const [activeIndex, setActiveIndex] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStartX, setDragStartX] = useState(0);
  const [hasDraggedSignificantly, setHasDraggedSignificantly] = useState(false);

  const targetAngle = useRef(0);
  const currentAngleRef = useRef(0);

  // Auto calculate active index based on current rotation angle
  useEffect(() => {
    const interval = setInterval(() => {
      // Find which movie is at front (angle close to 0 modulo 2*PI)
      const normalizedAngle = (-targetAngle.current % (Math.PI * 2) + Math.PI * 2) % (Math.PI * 2);
      const index = Math.round(normalizedAngle / step) % count;
      setActiveIndex(index);
    }, 100);
    return () => clearInterval(interval);
  }, [step, count]);

  // Pointer drag controls
  const handlePointerDown = (e) => {
    setIsDragging(true);
    setHasDraggedSignificantly(false);
    const clientX = e.clientX || (e.touches && e.touches[0].clientX) || 0;
    setDragStartX(clientX);
  };

  const handlePointerMove = (e) => {
    if (!isDragging) return;
    const clientX = e.clientX || (e.touches && e.touches[0].clientX) || 0;
    const deltaX = clientX - dragStartX;

    if (Math.abs(deltaX) > 8) {
      setHasDraggedSignificantly(true);
    }

    // Sensitivity factor
    const sensitivity = 0.006;
    targetAngle.current += deltaX * sensitivity;
    setDragStartX(clientX);
  };

  const handlePointerUp = () => {
    setIsDragging(false);
    // Snap to closest movie index for a satisfying tactile feel
    const normalizedAngle = -targetAngle.current;
    const closestSlot = Math.round(normalizedAngle / step);
    targetAngle.current = -closestSlot * step;
    const index = ((closestSlot % count) + count) % count;
    setActiveIndex(index);
  };

  const handleRotate = (direction) => {
    if (direction === 'next') {
      targetAngle.current -= step;
      setActiveIndex((prev) => (prev + 1) % count);
    } else {
      targetAngle.current += step;
      setActiveIndex((prev) => (prev - 1 + count) % count);
    }
  };

  const handleSelectMovie = (movie) => {
    // If it was just a drag swipe, don't open details
    if (hasDraggedSignificantly) return;
    navigate(`/movie/${movie.id}`);
  };

  const activeMovie = featuredMovies[activeIndex] || featuredMovies[0];

  return (
    <section className="relative w-full overflow-hidden bg-gradient-to-b from-[#090b12] via-[#0b0e17] to-[#08090d] pt-6 pb-12">
      
      {/* Background Cinematic Glow Elements */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] bg-red-600/10 blur-[140px] pointer-events-none rounded-full" />
      <div className="absolute top-1/2 left-1/4 w-[400px] h-[400px] bg-indigo-600/5 blur-[120px] pointer-events-none rounded-full" />

      {/* Header / Title */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-4">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-3">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-semibold tracking-wider uppercase mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Interactive 3D Experience</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white">
              Featured Premiere <span className="text-red-500">Showcase</span>
            </h2>
            <p className="text-xs sm:text-sm text-zinc-400 mt-1">
              Drag horizontally to spin the 3D cinema ring. Click any screen to book tickets.
            </p>
          </div>

          {/* Quick rotation buttons & drag indicator */}
          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2 text-xs text-zinc-500 bg-zinc-900/60 px-3 py-1.5 rounded-xl border border-zinc-800">
              <MoveHorizontal className="w-3.5 h-3.5 text-red-500 animate-pulse" />
              <span>Drag to Rotate</span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => handleRotate('prev')}
                className="p-2.5 rounded-xl bg-zinc-900/90 hover:bg-zinc-800 border border-zinc-800 text-zinc-300 hover:text-white transition-all hover:scale-105 active:scale-95"
                aria-label="Previous Movie"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={() => handleRotate('next')}
                className="p-2.5 rounded-xl bg-zinc-900/90 hover:bg-zinc-800 border border-zinc-800 text-zinc-300 hover:text-white transition-all hover:scale-105 active:scale-95"
                aria-label="Next Movie"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 3D Canvas Container */}
      <div 
        className="relative w-full h-[420px] sm:h-[480px] lg:h-[520px] cursor-grab active:cursor-grabbing select-none"
        onMouseDown={handlePointerDown}
        onMouseMove={handlePointerMove}
        onMouseUp={handlePointerUp}
        onTouchStart={handlePointerDown}
        onTouchMove={handlePointerMove}
        onTouchEnd={handlePointerUp}
      >
        <Canvas
          camera={{ position: [0, 0.4, 7.8], fov: 44 }}
          dpr={[1, 1.5]}
          gl={{ antialias: true, alpha: true }}
        >
          {/* Lighting */}
          <ambientLight intensity={0.8} />
          <directionalLight position={[0, 8, 4]} intensity={1.2} />
          <pointLight position={[0, 2, 4]} intensity={1.5} distance={10} color="#ffffff" />
          <spotLight 
            position={[0, 6, 6]} 
            angle={0.5} 
            penumbra={0.8} 
            intensity={2} 
            color="#ffffff" 
          />

          <Suspense fallback={null}>
            <CarouselRing
              movies={featuredMovies}
              targetAngle={targetAngle}
              currentAngleRef={currentAngleRef}
              onSelectMovie={handleSelectMovie}
              activeIndex={activeIndex}
              radius={5.6}
            />
          </Suspense>
        </Canvas>

        {/* Subtle vignette gradients */}
        <div className="absolute inset-y-0 left-0 w-16 sm:w-32 bg-gradient-to-r from-[#090b12] to-transparent pointer-events-none" />
        <div className="absolute inset-y-0 right-0 w-16 sm:w-32 bg-gradient-to-l from-[#090b12] to-transparent pointer-events-none" />
      </div>

      {/* Active Movie Showcase Banner (Below 3D Canvas) */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 -mt-6 sm:-mt-8 relative z-20">
        <div className="p-4 sm:p-6 rounded-2xl glass-card border border-zinc-800 shadow-2xl flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4 text-center sm:text-left">
            <img 
              src={activeMovie.poster} 
              alt={activeMovie.title} 
              className="w-16 h-22 object-cover rounded-xl shadow-lg border border-zinc-800 hidden sm:block"
              fetchpriority="high"
            />
            <div>
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mb-1.5">
                <span className="text-xs font-bold text-red-500 uppercase tracking-wider">
                  {activeMovie.language}
                </span>
                <span className="text-zinc-600">•</span>
                <span className="text-xs text-zinc-400">
                  {activeMovie.duration}
                </span>
                <span className="text-zinc-600">•</span>
                <div className="flex items-center gap-1 text-xs text-amber-400 font-bold">
                  <Star className="w-3.5 h-3.5 fill-amber-400" />
                  <span>{activeMovie.rating}</span>
                </div>
              </div>

              <h3 className="text-lg sm:text-2xl font-black text-white tracking-wide">
                {activeMovie.title}
              </h3>
              <p className="text-xs text-zinc-400 line-clamp-1 mt-0.5">
                {activeMovie.tagline}
              </p>

              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-1.5 mt-2">
                {activeMovie.formats.map((f) => (
                  <FormatBadge key={f} format={f} />
                ))}
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2.5 w-full sm:w-auto shrink-0">
            <button
              onClick={() => navigate(`/movie/${activeMovie.id}`)}
              className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-xs font-semibold text-white transition-all"
            >
              <Info className="w-4 h-4 text-zinc-400" />
              <span>Details</span>
            </button>
            <button
              onClick={() => navigate(`/movie/${activeMovie.id}#showtimes`)}
              className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white text-xs font-bold shadow-lg shadow-red-950/40 transition-all hover:scale-105 active:scale-95"
            >
              <Ticket className="w-4 h-4" />
              <span>Book Tickets</span>
            </button>
          </div>
        </div>

        {/* Carousel indicator dots */}
        <div className="flex items-center justify-center gap-1.5 mt-4">
          {featuredMovies.map((_, i) => (
            <button
              key={i}
              onClick={() => {
                targetAngle.current = -i * step;
                setActiveIndex(i);
              }}
              className={`h-1.5 rounded-full transition-all ${
                i === activeIndex 
                  ? 'w-6 bg-red-500 shadow-sm shadow-red-500/50' 
                  : 'w-1.5 bg-zinc-700 hover:bg-zinc-500'
              }`}
              aria-label={`Jump to movie ${i + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};
