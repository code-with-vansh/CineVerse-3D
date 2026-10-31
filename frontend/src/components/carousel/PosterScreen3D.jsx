import React, { useRef, useState } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { Text } from '@react-three/drei';

// Helper to create a fallback canvas texture with title & gradient
function createPosterTexture(movie) {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 768;
  const ctx = canvas.getContext('2d');

  // Background gradient
  const grad = ctx.createLinearGradient(0, 0, 0, 768);
  grad.addColorStop(0, '#1f2538');
  grad.addColorStop(0.5, '#10131d');
  grad.addColorStop(1, '#06070a');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 512, 768);

  // Accent glow
  ctx.fillStyle = movie.accentColor || '#e50914';
  ctx.globalAlpha = 0.25;
  ctx.beginPath();
  ctx.arc(256, 384, 180, 0, Math.PI * 2);
  ctx.fill();
  ctx.globalAlpha = 1.0;

  // Title
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 36px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText(movie.title, 256, 384);

  // Language & Genre
  ctx.fillStyle = '#f59e0b';
  ctx.font = '22px sans-serif';
  ctx.fillText(`${movie.language} • ${movie.duration}`, 256, 430);

  const texture = new THREE.CanvasTexture(canvas);
  texture.needsUpdate = true;
  return texture;
}

const textureCache = new Map();

function getMovieTexture(movie) {
  if (textureCache.has(movie.id)) {
    return textureCache.get(movie.id);
  }
  const loader = new THREE.TextureLoader();
  loader.setCrossOrigin('anonymous');
  try {
    const tex = loader.load(
      movie.poster,
      undefined,
      undefined,
      () => {
        console.warn(`Fallback texture used for ${movie.title}`);
      }
    );
    tex.colorSpace = THREE.SRGBColorSpace;
    textureCache.set(movie.id, tex);
    return tex;
  } catch {
    const fallback = createPosterTexture(movie);
    textureCache.set(movie.id, fallback);
    return fallback;
  }
}

export const PosterScreen3D = ({ 
  movie, 
  position, 
  rotation, 
  isFront, 
  onSelect 
}) => {
  const meshRef = useRef();
  const [hovered, setHovered] = useState(false);
  const texture = getMovieTexture(movie);

  // Subtle breathing animation for the front or hovered card
  useFrame((state, delta) => {
    if (meshRef.current) {
      const targetScale = isFront ? (hovered ? 1.08 : 1.04) : (hovered ? 1.02 : 0.96);
      meshRef.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), delta * 6);
    }
  });

  return (
    <group position={position} rotation={rotation}>
      <group
        ref={meshRef}
        onPointerOver={(e) => {
          e.stopPropagation();
          setHovered(true);
          document.body.style.cursor = 'pointer';
        }}
        onPointerOut={(e) => {
          e.stopPropagation();
          setHovered(false);
          document.body.style.cursor = 'auto';
        }}
        onClick={(e) => {
          e.stopPropagation();
          onSelect(movie);
        }}
      >
        {/* Outer Curved Cinema Screen Frame */}
        <mesh position={[0, 0, -0.05]}>
          <boxGeometry args={[2.3, 3.4, 0.1]} />
          <meshStandardMaterial 
            color={hovered ? '#e50914' : isFront ? '#2b3145' : '#12151e'} 
            metalness={0.8} 
            roughness={0.2}
            emissive={hovered ? '#e50914' : isFront ? '#e50914' : '#000000'}
            emissiveIntensity={hovered ? 0.4 : isFront ? 0.2 : 0}
          />
        </mesh>

        {/* Poster Surface */}
        <mesh position={[0, 0, 0.02]}>
          <planeGeometry args={[2.16, 3.24]} />
          <meshBasicMaterial 
            map={texture} 
            toneMapped={false}
          />
        </mesh>

        {/* Glossy Screen Glass Reflection Overlay */}
        <mesh position={[0, 0, 0.03]}>
          <planeGeometry args={[2.16, 3.24]} />
          <meshPhysicalMaterial
            transparent
            opacity={0.12}
            roughness={0.1}
            transmission={0.4}
            thickness={0.2}
            reflectivity={0.6}
            clearcoat={1.0}
            clearcoatRoughness={0.1}
          />
        </mesh>

        {/* Cinematic Under-glow light when in front */}
        {isFront && (
          <pointLight 
            position={[0, -1.8, 0.8]} 
            intensity={1.2} 
            distance={4} 
            color={movie.accentColor || '#e50914'} 
          />
        )}

        {/* Floating 3D Badge Indicator for Format */}
        <group position={[0, 1.85, 0.1]}>
          <Text
            fontSize={0.16}
            color={isFront ? '#ffffff' : '#94a3b8'}
            anchorX="center"
            anchorY="middle"
            font="https://fonts.gstatic.com/s/plusjakartasans/v8/LDIbaomQNQcsA88c7O9yZ4KMCoOg4Ko20yw.woff"
          >
            {movie.formats?.[0] || 'IMAX 3D'}
          </Text>
        </group>
      </group>
    </group>
  );
};
