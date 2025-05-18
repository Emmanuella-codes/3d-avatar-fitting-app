import { Box, CircularProgress } from "@mui/material";
import { useEffect, useRef } from "react";
import * as THREE from "three";
import { DRACOLoader, GLTFLoader, OrbitControls } from "three/examples/jsm/Addons.js";


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
  const controlsRef = useRef<OrbitControls | null>(null);
  const avatarRef = useRef<THREE.Object3D | null>(null);
  const clothingRef = useRef<THREE.Object3D | null>(null);
  const clothingMaterialRef = useRef<THREE.Material | null>(null);
  
  useEffect(() => {
    if (!containerRef.current) return;

    // create scene, camera, renderer, light
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x2a2a2a);
    sceneRef.current = scene;
    const camera = new THREE.PerspectiveCamera(
      75,
      containerRef.current.clientWidth / containerRef.current.clientHeight,
      0.1,
      1000
    );
    camera.position.set(0, 1, 2);
    cameraRef.current = camera;
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    containerRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(5, 10, 7.5);
    directionalLight.castShadow = true;
    directionalLight.shadow.mapSize.width = 1024;
    directionalLight.shadow.mapSize.height = 1024;
    scene.add(directionalLight);

    // orbit controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.minDistance = 1;
    controls.maxDistance = 10;
    controlsRef.current = controls;
    const gridHelper = new THREE.GridHelper(10, 10, 0x444444, 0x222222)
    scene.add(gridHelper);
    const animate = () => {
      requestAnimationFrame(animate);
      if (controlsRef.current) {
        controlsRef.current.update();
      }
      if (cameraRef.current && sceneRef.current && rendererRef.current) {
        rendererRef.current.render(sceneRef.current, cameraRef.current);
      }
    };
    animate();

    // resize window
    const handleResize = () => {
      if (!containerRef.current || !cameraRef.current || !rendererRef.current) return;
      const width = containerRef.current.clientWidth;
      const height = containerRef.current.clientHeight;
      cameraRef.current.aspect = width / height;
      cameraRef.current.updateProjectionMatrix();
      rendererRef.current.setSize(width, height);
    };
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize)
      if (rendererRef.current && containerRef.current) {
        containerRef.current.removeChild(rendererRef.current.domElement);
      }
      if (sceneRef.current) {
        sceneRef.current.traverse((object) => {
          if (object instanceof THREE.Mesh) {
            if (object.geometry) object.geometry.dispose();
            if (object.material) {
              if (Array.isArray(object.material)) {
                object.material.forEach(material => material.dispose());
              } else {
                object.material.dispose();
              }
            }
          }
        });
      }
      if (rendererRef.current) {
        rendererRef.current.dispose();
      }
    };

  }, []);

  // load avatar model
  useEffect(() => {
    if (!avatarUrl || !sceneRef.current) return;
    if (avatarRef.current) {
      sceneRef.current.remove(avatarRef.current);
      avatarRef.current = null;
    }
    const loader = new GLTFLoader();
    const dracoLoader = new DRACOLoader();
    dracoLoader.setDecoderPath('https://www.gstatic.com/draco/versioned/decoders/1.5.6/');
    loader.setDRACOLoader(dracoLoader);
    loader.load(
      avatarUrl,
      (gltf) => {
        const model = gltf.scene;
        const box = new THREE.Box3().setFromObject(model);
        const center = box.getCenter(new THREE.Vector3());
        const size = box.getSize(new THREE.Vector3());
        model.position.x = -center.x;
        model.position.y = -center.y;
        model.position.z = -center.z;
        
        // adjust camera & controls
        if (cameraRef.current && controlsRef) {
          const maxDim = Math.max(size.x, size.y, size.y);
          const fov = cameraRef.current.fov * (Math.PI / 180);
          const cameraDistance = maxDim / (2 * Math.tan(fov / 2));
          cameraRef.current.position.z = cameraDistance * 1.5;
          cameraRef.current.updateProjectionMatrix();
          controlsRef.current?.target.set(0, size.y / 2, 0);
          controlsRef.current?.update();
        }
        if (sceneRef.current) {
          sceneRef.current.add(model);
          avatarRef.current = model;
          if (!clothingUrl) {
            onLoadingComplete();
          }
        }
      },
      (xhr) => {
        console.log((xhr.loaded / xhr.total * 1000) + '% loaded');
      },
      (error) => {
        console.error('Error loading avatar model:', error);
        onLoadingComplete();
      }
    );
  }, [avatarUrl, onLoadingComplete, clothingUrl]);

  // load clothing model
  useEffect(() => {
    if (!clothingUrl || !sceneRef.current) return;
    if (clothingRef.current) {
      sceneRef.current.remove(clothingRef.current);
      clothingRef.current = null;
      clothingMaterialRef.current = null;
    }
    const loader = new GLTFLoader();
    const dracoLoader = new DRACOLoader();
    dracoLoader.setDecoderPath('https://www.gstatic.com/draco/versioned/decoders/1.5.6/');
    loader.setDRACOLoader(dracoLoader);
    loader.load(
      clothingUrl,
      (gltf) => {
        const model = gltf.scene;

        // clothing the material color
        model.traverse((object) => {
          if (object instanceof THREE.Mesh && object.material) {
            const newMaterial = new THREE.MeshStandardMaterial({
              color: new THREE.Color(clothingColor),
              roughness: 0.7,
              metalness: 0.2,
            });
            clothingMaterialRef.current = newMaterial;
            object.material = newMaterial;
          }
        });
        // position relative to the avatar
        if (avatarRef.current) {
          const avatarBox = new THREE.Box3().setFromObject(avatarRef.current);
          const clothingBox = new THREE.Box3().setFromObject(model);
          const avatarSize = avatarBox.getSize(new THREE.Vector3());
          const clothingSize = clothingBox.getSize(new THREE.Vector3());
          model.position.x = 0;
          model.position.y = avatarSize.y / 2 - clothingSize.y / 2;
          model.position.z = 0.05;
        }
        model.visible = isClothingVisible;
        if (sceneRef.current) {
          sceneRef.current.add(model);
          clothingRef.current = model;
          onLoadingComplete();
        }
      },
      (xhr) => {
        console.log((xhr.loaded / xhr.total * 1000) + '% loaded');
      },
      (error) => {
        console.error('Error loading avatar model:', error);
        onLoadingComplete();
      }
    );
  }, [clothingColor, clothingUrl, isClothingVisible, onLoadingComplete]);

  // clothing visibility
  useEffect(() => {
    if (clothingMaterialRef.current && clothingMaterialRef.current instanceof THREE.Material) {
      (clothingMaterialRef.current as THREE.MeshStandardMaterial).color.set(clothingColor);
    }
  }, [clothingColor])

  return (
    <Box
      ref={containerRef}
      sx={{
        width: '100%',
        height: '100%',
        position: 'relative'
      }}
    >
      {isLoading && (
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            zIndex: 10
          }}
        >
          <CircularProgress color="secondary" size={60} />
        </Box>
      )}
    </Box>
  )
}

