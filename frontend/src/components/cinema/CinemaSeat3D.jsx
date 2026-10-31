import React, { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

// Procedural realistic 3D cinema seat
export const CinemaSeat3D = ({ 
  seat, 
  isSelected, 
  onToggleSelect 
}) => {
  const groupRef = useRef();
  const [hovered, setHovered] = useState(false);

  const isOccupied = seat.status === 'occupied';

  // Determine material color based on seat state
  const getSeatColor = () => {
    if (isSelected) return '#0284c7'; // Vibrant Blue
    if (isOccupied) return '#b91c1c'; // Muted Crimson / Red
    return '#10b981'; // Vibrant Emerald / Green
  };

  const getEmissive = () => {
    if (isSelected) return '#38bdf8';
    if (hovered && !isOccupied) return '#34d399';
    return '#000000';
  };

  const getEmissiveIntensity = () => {
    if (isSelected) return 0.55;
    if (hovered && !isOccupied) return 0.35;
    return 0;
  };

  // Subtle bounce / breathing animation when selected
  useFrame((_, delta) => {
    if (groupRef.current) {
      const targetScale = isSelected ? (hovered ? 1.08 : 1.04) : (hovered ? 1.03 : 1.0);
      groupRef.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), delta * 8);
    }
  });

  const handleClick = (e) => {
    e.stopPropagation();
    onToggleSelect(seat);
  };

  return (
    <group 
      ref={groupRef} 
      position={seat.position}
      onClick={handleClick}
      onPointerOver={(e) => {
        e.stopPropagation();
        setHovered(true);
        if (!isOccupied) {
          document.body.style.cursor = 'pointer';
        } else {
          document.body.style.cursor = 'not-allowed';
        }
      }}
      onPointerOut={(e) => {
        e.stopPropagation();
        setHovered(false);
        document.body.style.cursor = 'auto';
      }}
    >
      {/* 1. Seat Cushion (Padded bottom) */}
      <mesh position={[0, 0.42, 0.05]} castShadow receiveShadow>
        <boxGeometry args={[0.62, 0.12, 0.52]} />
        <meshStandardMaterial 
          color={getSeatColor()}
          roughness={0.4}
          metalness={0.1}
          emissive={getEmissive()}
          emissiveIntensity={getEmissiveIntensity()}
        />
      </mesh>

      {/* 2. Seat Backrest (Tilted slightly back) */}
      <mesh position={[0, 0.78, -0.2]} rotation={[-0.12, 0, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.62, 0.68, 0.12]} />
        <meshStandardMaterial 
          color={getSeatColor()}
          roughness={0.4}
          metalness={0.1}
          emissive={getEmissive()}
          emissiveIntensity={getEmissiveIntensity()}
        />
      </mesh>

      {/* 3. Left Armrest with cup holder styling */}
      <mesh position={[-0.34, 0.54, 0]} castShadow>
        <boxGeometry args={[0.08, 0.22, 0.48]} />
        <meshStandardMaterial color="#18181b" roughness={0.6} metalness={0.2} />
      </mesh>

      {/* 4. Right Armrest */}
      <mesh position={[0.34, 0.54, 0]} castShadow>
        <boxGeometry args={[0.08, 0.22, 0.48]} />
        <meshStandardMaterial color="#18181b" roughness={0.6} metalness={0.2} />
      </mesh>

      {/* 5. Central Steel Pedestal Base (Bolted to floor) */}
      <mesh position={[0, 0.2, 0]}>
        <cylinderGeometry args={[0.045, 0.055, 0.4, 8]} />
        <meshStandardMaterial color="#27272a" roughness={0.3} metalness={0.8} />
      </mesh>

      {/* Floor Plate Base */}
      <mesh position={[0, 0.01, 0]}>
        <boxGeometry args={[0.2, 0.02, 0.2]} />
        <meshStandardMaterial color="#18181b" roughness={0.5} metalness={0.7} />
      </mesh>

      {/* Glow aura underneath if selected */}
      {isSelected && (
        <pointLight
          position={[0, 0.5, 0]}
          color="#38bdf8"
          intensity={1.2}
          distance={1.6}
        />
      )}
    </group>
  );
};
