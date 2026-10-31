import React, { useRef, useEffect } from 'react';
import { useThree, useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import { CAMERA_PRESETS } from '../../data/cinemaHallData';

export const CinemaCameraControls = ({ activePreset }) => {
  const { camera } = useThree();
  const controlsRef = useRef();

  // Target positions for smooth lerping
  const targetCamPos = useRef(new THREE.Vector3(...CAMERA_PRESETS[activePreset].position));
  const targetLookAt = useRef(new THREE.Vector3(...CAMERA_PRESETS[activePreset].target));
  const isTransitioning = useRef(true);

  // Update target when activePreset changes
  useEffect(() => {
    const preset = CAMERA_PRESETS[activePreset] || CAMERA_PRESETS.overview;
    targetCamPos.current.set(...preset.position);
    targetLookAt.current.set(...preset.target);
    isTransitioning.current = true;
  }, [activePreset]);

  useFrame((_, delta) => {
    // 1. Smooth preset transition animation
    if (isTransitioning.current && controlsRef.current) {
      camera.position.lerp(targetCamPos.current, delta * 4.5);
      controlsRef.current.target.lerp(targetLookAt.current, delta * 4.5);

      if (
        camera.position.distanceTo(targetCamPos.current) < 0.04 &&
        controlsRef.current.target.distanceTo(targetLookAt.current) < 0.04
      ) {
        camera.position.copy(targetCamPos.current);
        controlsRef.current.target.copy(targetLookAt.current);
        isTransitioning.current = false;
      }
    }

    // 2. CRITICAL CAMERA COLLISION & BOUNDARY CLAMPING
    // Ensures camera physically NEVER passes through auditorium walls, floor, screen, or ceiling!
    // Hall dimensions: X = [-12.2, 12.2], Y = [0, 8.6], Z = [-2.8 (Screen), 21.2 (Back Wall)]
    const clampedX = THREE.MathUtils.clamp(camera.position.x, -10.4, 10.4);
    const clampedY = THREE.MathUtils.clamp(camera.position.y, 0.85, 7.8);
    const clampedZ = THREE.MathUtils.clamp(camera.position.z, -1.8, 19.8);

    camera.position.set(clampedX, clampedY, clampedZ);

    if (controlsRef.current) {
      // Clamp target to remain focused inside the hall
      controlsRef.current.target.x = THREE.MathUtils.clamp(controlsRef.current.target.x, -7.0, 7.0);
      controlsRef.current.target.y = THREE.MathUtils.clamp(controlsRef.current.target.y, 0.2, 5.5);
      controlsRef.current.target.z = THREE.MathUtils.clamp(controlsRef.current.target.z, -2.5, 18.5);
      controlsRef.current.update();
    }
  });

  return (
    <OrbitControls
      ref={controlsRef}
      enableDamping={true}
      dampingFactor={0.08}
      enablePan={false} // Disable unbounded panning to prevent flying outside the hall
      minDistance={2.0} // Prevents camera from zooming through a seat mesh
      maxDistance={18.5} // Prevents pulling camera outside the back wall or roof
      minPolarAngle={Math.PI * 0.04} // Prevents upside down camera flips
      maxPolarAngle={Math.PI * 0.485} // Strictly prevents camera from penetrating the floor
      rotateSpeed={0.65}
      zoomSpeed={0.8}
    />
  );
};
