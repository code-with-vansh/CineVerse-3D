import React from 'react';
import { Text } from '@react-three/drei';

export const AuditoriumEnvironment3D = () => {
  // Stepped tiers for rows A to L
  const tiers = [
    { zStart: 3.5, zEnd: 4.8, y: 0.1, label: 'ROW A' },
    { zStart: 4.8, zEnd: 6.2, y: 0.35, label: 'ROW B' },
    { zStart: 6.2, zEnd: 7.8, y: 0.6, label: 'ROW C' },
    { zStart: 7.8, zEnd: 9.4, y: 0.9, label: 'ROW D' },
    { zStart: 9.4, zEnd: 10.8, y: 1.2, label: 'ROW E' },
    { zStart: 10.8, zEnd: 12.2, y: 1.5, label: 'ROW F' },
    { zStart: 12.2, zEnd: 13.6, y: 1.8, label: 'ROW G' },
    { zStart: 13.6, zEnd: 15.2, y: 2.1, label: 'ROW H' },
    // Balcony Tier
    { zStart: 15.8, zEnd: 17.4, y: 3.0, label: 'BALCONY J' },
    { zStart: 17.4, zEnd: 18.8, y: 3.5, label: 'BALCONY K' },
    { zStart: 18.8, zEnd: 20.8, y: 4.0, label: 'BALCONY L' }
  ];

  return (
    <group>
      {/* 1. Base Ground / Auditorium Sub-Floor */}
      <mesh position={[0, -0.1, 9.5]} receiveShadow>
        <boxGeometry args={[26, 0.2, 26]} />
        <meshStandardMaterial color="#06070a" roughness={0.9} />
      </mesh>

      {/* 2. Stepped Riser Tiers for Seating Bowl */}
      {tiers.map((t, idx) => (
        <group key={idx}>
          {/* Main Tier Floor Deck */}
          <mesh 
            position={[0, t.y / 2, (t.zStart + t.zEnd) / 2]} 
            receiveShadow
          >
            <boxGeometry args={[23.5, t.y, t.zEnd - t.zStart]} />
            <meshStandardMaterial 
              color="#0f1118" 
              roughness={0.8} 
              metalness={0.1} 
            />
          </mesh>

          {/* Stepped LED Aisle Guide Strips (Blue/Amber floor lights on step edges) */}
          {[-3.0, 3.2].map((aisleX, aIdx) => (
            <mesh 
              key={aIdx} 
              position={[aisleX, t.y + 0.01, t.zStart + 0.05]}
            >
              <boxGeometry args={[0.3, 0.015, 0.04]} />
              <meshBasicMaterial color="#38bdf8" toneMapped={false} />
            </mesh>
          ))}

          {/* Floating Row Indicator on Aisle Walls */}
          {[-7.4, 7.4].map((labelX, lIdx) => (
            <group key={lIdx} position={[labelX, t.y + 0.3, (t.zStart + t.zEnd) / 2]}>
              <Text
                fontSize={0.2}
                color="#71717a"
                anchorX="center"
                anchorY="middle"
                rotation={[0, lIdx === 0 ? Math.PI / 2 : -Math.PI / 2, 0]}
              >
                {t.label.split(' ')[1]}
              </Text>
            </group>
          ))}
        </group>
      ))}

      {/* 3. Left Auditorium Wall with Acoustic Panels & Sconces (x = -12.5) */}
      <group position={[-12.2, 4.2, 9.5]}>
        {/* Main Wall Surface */}
        <mesh receiveShadow>
          <boxGeometry args={[0.4, 8.8, 25]} />
          <meshStandardMaterial color="#0c0e14" roughness={0.9} />
        </mesh>

        {/* Vertical Decorative Acoustic Slat Panels */}
        {[-8, -4, 0, 4, 8].map((zOffset, idx) => (
          <group key={idx} position={[0.22, 0, zOffset]}>
            <mesh>
              <boxGeometry args={[0.08, 6.5, 1.8]} />
              <meshStandardMaterial color="#1a1c24" roughness={0.7} metalness={0.2} />
            </mesh>
            {/* Warm Cinema Wall Sconce Light */}
            <mesh position={[0.06, 0.6, 0]}>
              <boxGeometry args={[0.05, 0.6, 0.3]} />
              <meshBasicMaterial color="#fef08a" />
            </mesh>
            <pointLight position={[0.4, 0.6, 0]} color="#fef08a" intensity={0.75} distance={4.5} />
          </group>
        ))}
      </group>

      {/* 4. Right Auditorium Wall with Acoustic Panels & Sconces (x = 12.5) */}
      <group position={[12.2, 4.2, 9.5]}>
        {/* Main Wall Surface */}
        <mesh receiveShadow>
          <boxGeometry args={[0.4, 8.8, 25]} />
          <meshStandardMaterial color="#0c0e14" roughness={0.9} />
        </mesh>

        {/* Vertical Decorative Acoustic Panels */}
        {[-8, -4, 0, 4, 8].map((zOffset, idx) => (
          <group key={idx} position={[-0.22, 0, zOffset]}>
            <mesh>
              <boxGeometry args={[0.08, 6.5, 1.8]} />
              <meshStandardMaterial color="#1a1c24" roughness={0.7} metalness={0.2} />
            </mesh>
            {/* Warm Cinema Wall Sconce */}
            <mesh position={[-0.06, 0.6, 0]}>
              <boxGeometry args={[0.05, 0.6, 0.3]} />
              <meshBasicMaterial color="#fef08a" />
            </mesh>
            <pointLight position={[-0.4, 0.6, 0]} color="#fef08a" intensity={0.75} distance={4.5} />
          </group>
        ))}
      </group>

      {/* 5. Rear Wall with Projection Booth & Exit Doors (z = 21.0) */}
      <group position={[0, 4.5, 21.2]}>
        <mesh receiveShadow>
          <boxGeometry args={[25, 9.2, 0.4]} />
          <meshStandardMaterial color="#090a0f" roughness={0.9} />
        </mesh>

        {/* Projection Booth Glass Window */}
        <mesh position={[0, 2.2, -0.22]}>
          <boxGeometry args={[3.2, 1.2, 0.05]} />
          <meshStandardMaterial 
            color="#38bdf8" 
            roughness={0.1} 
            metalness={0.9} 
            emissive="#38bdf8" 
            emissiveIntensity={0.8} 
          />
        </mesh>

        {/* Projector Light Beam originating from booth window pointing to front screen */}
        <spotLight
          position={[0, 6.6, 20.8]}
          target-position={[0, 4.4, -2.8]}
          color="#e0f2fe"
          intensity={2.2}
          distance={28}
          angle={0.42}
          penumbra={0.6}
        />

        {/* Illuminated Emergency Exit Signs */}
        {[-9, 9].map((exitX, eIdx) => (
          <group key={eIdx} position={[exitX, -1.2, -0.22]}>
            <mesh>
              <boxGeometry args={[1.2, 0.45, 0.08]} />
              <meshStandardMaterial color="#052e16" emissive="#22c55e" emissiveIntensity={0.8} />
            </mesh>
            <Text
              position={[0, 0, 0.06]}
              fontSize={0.2}
              color="#ffffff"
              anchorX="center"
              anchorY="middle"
              fontWeight="bold"
            >
              EXIT →
            </Text>
          </group>
        ))}
      </group>

      {/* 6. Balcony Terrace Structure & Safety Handrail (Separates Ground & Balcony) */}
      <group position={[0, 2.2, 15.4]}>
        {/* Terrace Step Wall */}
        <mesh position={[0, 0.4, 0]}>
          <boxGeometry args={[23.5, 1.8, 0.3]} />
          <meshStandardMaterial color="#18181b" roughness={0.7} metalness={0.3} />
        </mesh>

        {/* Modern Glass Handrail with illuminated Chrome Rail */}
        <mesh position={[0, 1.6, 0]}>
          <boxGeometry args={[22.5, 0.7, 0.06]} />
          <meshPhysicalMaterial
            transparent
            opacity={0.35}
            roughness={0.1}
            transmission={0.8}
            thickness={0.1}
          />
        </mesh>
        <mesh position={[0, 1.95, 0]}>
          <cylinderGeometry args={[0.04, 0.04, 22.6, 16]} rotation={[0, 0, Math.PI / 2]} />
          <meshStandardMaterial color="#cbd5e1" metalness={0.9} roughness={0.2} />
        </mesh>
      </group>

      {/* 7. Cinema Ceiling with Acoustic Baffles & Downlights (y = 8.6) */}
      <mesh position={[0, 8.6, 9.5]}>
        <boxGeometry args={[24.8, 0.2, 24.8]} />
        <meshStandardMaterial color="#08090c" roughness={0.95} />
      </mesh>
    </group>
  );
};
