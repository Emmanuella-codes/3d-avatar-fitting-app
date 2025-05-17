import { Box } from "@mui/material";
import { useRef } from "react";
import * as THREE from "three";


interface SceneProps {
  avatarUrl: string | null;
  clothingUrl: string | null;
  isClothingVisible: boolean;
  onLoadingComplete: () => void;
  isLoading: boolean;
  clothingColor: string;
}

export default function Scene({
  avatarUrl,
  clothingUrl,
  isClothingVisible,
  onLoadingComplete,
  isLoading,
  clothingColor,
}: SceneProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  // const controlsRef = useRef<OrbitControls | null>(null);
  const avatarRef = useRef<THREE.Object3D | null>(null);
  const clothingRef = useRef<THREE.Object3D | null>(null);
  const clothingMaterialRef = useRef<THREE.Material | null>(null);
  
  return (
    <Box></Box>
  )
}

