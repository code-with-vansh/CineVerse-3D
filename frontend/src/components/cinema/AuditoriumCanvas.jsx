import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { CinemaSeat3D } from './CinemaSeat3D';
import { CinemaScreen3D } from './CinemaScreen3D';
import { AuditoriumEnvironment3D } from './AuditoriumEnvironment3D';
import { CinemaCameraControls } from './CinemaCameraControls';

export const AuditoriumCanvas = ({ 
  movie, 
  seats, 
  selectedSeatIds, 
  onToggleSeatSelect, 
  activeCameraPreset 
}) => {
  return (
    <div className="relative w-full h-full min-h-[500px] bg-[#06070a] select-none overflow-hidden">
      <Canvas
        camera={{ position: [0, 5.8, 16.2], fov: 48 }}
        dpr={[1, 1.5]}
        gl={{ 
          antialias: true, 
          alpha: false,
          powerPreference: 'high-performance' 
        }}
        shadows={false}
      >
        {/* Cinematic Ambient & Theater Atmosphere Lighting */}
        <ambientLight intensity={1.2} color="#ffffff" />
        <directionalLight position={[0, 10, 15]} intensity={1.8} color="#ffffff" />
        <directionalLight position={[0, 6, -3]} intensity={1.4} color="#60a5fa" />
        <pointLight position={[0, 5.0, 8.0]} intensity={1.5} distance={20} color="#f8fafc" />

        {/* 3D Scene Components */}
        <Suspense fallback={null}>
          <AuditoriumEnvironment3D />
          <CinemaScreen3D movie={movie} />

          {/* Render individual 3D selectable seats */}
          <group>
            {seats.map((seat) => (
              <CinemaSeat3D
                key={seat.id}
                seat={seat}
                isSelected={selectedSeatIds.includes(seat.id)}
                onToggleSelect={onToggleSeatSelect}
              />
            ))}
          </group>

          {/* Camera Controller with strict boundaries & 4 presets */}
          <CinemaCameraControls activePreset={activeCameraPreset} />
        </Suspense>
      </Canvas>
    </div>
  );
};
