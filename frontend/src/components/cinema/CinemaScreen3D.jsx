import React, { useMemo } from 'react';
import * as THREE from 'three';
import { Text } from '@react-three/drei';

export const CinemaScreen3D = ({ movie }) => {
  // Load movie banner texture with fallback
  const screenTexture = useMemo(() => {
    if (!movie?.banner) return null;
    const loader = new THREE.TextureLoader();
    loader.setCrossOrigin('anonymous');
    try {
      const tex = loader.load(movie.banner);
      tex.colorSpace = THREE.SRGBColorSpace;
      return tex;
    } catch {
      return null;
    }
  }, [movie]);

  // Curved screen geometry (cylinder segment)
  const screenGeometry = useMemo(() => {
    // Radius 24, height 7.5, radial segments 48, open arc ~0.55 rad (32 degrees)
    return new THREE.CylinderGeometry(24, 24, 7.8, 48, 1, true, -0.28, 0.56);
  }, []);

  return (
    <group position={[0, 0, -2.8]}>
      {/* 1. Curved Screen Bezel / Black Frame */}
      <mesh position={[0, 4.4, 0]} rotation={[0, Math.PI, 0]}>
        <cylinderGeometry args={[23.92, 23.92, 8.1, 48, 1, true, -0.29, 0.58]} />
        <meshStandardMaterial color="#09090b" roughness={0.8} metalness={0.2} side={THREE.DoubleSide} />
      </mesh>

      {/* 2. Main Curved Cinema Screen Surface */}
      <mesh geometry={screenGeometry} position={[0, 4.4, 0]} rotation={[0, Math.PI, 0]}>
        <meshStandardMaterial
          map={screenTexture}
          color={screenTexture ? '#ffffff' : '#1e293b'}
          roughness={0.2}
          metalness={0.05}
          emissive={screenTexture ? '#ffffff' : '#334155'}
          emissiveMap={screenTexture}
          emissiveIntensity={0.65}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* 3. Screen Projection Glow Light casting forward into the auditorium */}
      <pointLight
        position={[0, 4.6, 2.0]}
        color={movie?.accentColor || '#60a5fa'}
        intensity={3.5}
        distance={25}
      />

      {/* 4. Front Cinema Stage Platform */}
      <group position={[0, 0, 0]}>
        {/* Main curved stage deck */}
        <mesh position={[0, 0.35, 1.2]} rotation={[-Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[11, 11, 0.7, 36, 1, false, 0, Math.PI]} />
          <meshStandardMaterial color="#12131a" roughness={0.7} metalness={0.3} />
        </mesh>

        {/* Glowing LED edge strip on stage apron */}
        <mesh position={[0, 0.72, 1.25]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[10.95, 11.05, 36, 1, 0, Math.PI]} />
          <meshBasicMaterial color="#e50914" toneMapped={false} />
        </mesh>
      </group>

      {/* 5. IMAX / 3D Badge on Screen Base */}
      <group position={[0, 0.85, 2.8]}>
        <Text
          fontSize={0.26}
          color="#ffffff"
          anchorX="center"
          anchorY="middle"
          letterSpacing={0.15}
        >
          {movie?.formats?.[0] ? `${movie.formats[0]} EXPERIENCE` : 'CINEVERSE 3D IMMERSIVE SCREEN'}
        </Text>
      </group>

      {/* 6. Professional Stage Subwoofers / Audio Stacks flanking the stage */}
      {[-8.5, 8.5].map((xPos, idx) => (
        <group key={idx} position={[xPos, 1.2, 0.5]}>
          <mesh castShadow>
            <boxGeometry args={[1.2, 2.2, 0.9]} />
            <meshStandardMaterial color="#0c0d12" roughness={0.8} metalness={0.2} />
          </mesh>
          <mesh position={[0, 0.4, 0.46]}>
            <circleGeometry args={[0.35, 24]} />
            <meshStandardMaterial color="#27272a" roughness={0.3} metalness={0.7} />
          </mesh>
          <mesh position={[0, -0.4, 0.46]}>
            <circleGeometry args={[0.35, 24]} />
            <meshStandardMaterial color="#27272a" roughness={0.3} metalness={0.7} />
          </mesh>
        </group>
      ))}
    </group>
  );
};
