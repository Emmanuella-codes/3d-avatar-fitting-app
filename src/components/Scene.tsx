import { Box, CircularProgress } from "@mui/material";
import { useEffect, useRef } from "react";
import * as THREE from "three";
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { DRACOLoader } from 'three/addons/loaders/DRACOLoader.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

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
  const animationFrameIdRef = useRef<number | null>(null);
  const loaderRef = useRef<GLTFLoader | null>(null);
  const isInitializedRef = useRef<boolean>(false);
  const dracoLoader = useRef<DRACOLoader | null>(null);

  useEffect(() => {
    if (isInitializedRef.current) return;
    isInitializedRef.current = true;

    if (animationFrameIdRef.current !== null) {
      cancelAnimationFrame(animationFrameIdRef.current);
      animationFrameIdRef.current = null;
    }

    const gltfLoader = new GLTFLoader();
    dracoLoader.current = new DRACOLoader();
    dracoLoader.current.setDecoderPath('/draco-gltf/');
    gltfLoader.setDRACOLoader(dracoLoader.current);
    loaderRef.current = gltfLoader;

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
    containerRef.current?.appendChild(renderer.domElement);
    rendererRef.current = renderer;
    
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(5, 10, 7.5);
    directionalLight.castShadow = true;
    directionalLight.shadow.mapSize.width = 1024;
    directionalLight.shadow.mapSize.height = 1024;
    scene.add(directionalLight);

    const fillLight = new THREE.DirectionalLight(0xffffff, 0.5);
    fillLight.position.set(-5, 5, -7.5);
    scene.add(fillLight);

    // orbit controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.minDistance = 1;
    controls.maxDistance = 10;
    controlsRef.current = controls;

    const gridHelper = new THREE.GridHelper(10, 10, 0x444444, 0x222222)
    scene.add(gridHelper);

    function startAnimationLoop() {
      const animate = () => {
        if (!sceneRef.current || !cameraRef.current || !rendererRef.current) return;
        animationFrameIdRef.current = requestAnimationFrame(animate);

        controlsRef.current?.update();
        rendererRef.current.render(sceneRef.current, cameraRef.current);
      };
      animate();
    }

    startAnimationLoop();

    const handleResize = () => {
      if (!containerRef.current || !cameraRef.current || !rendererRef.current) return;
      const width = containerRef.current.clientWidth;
      const height = containerRef.current.clientHeight;
      cameraRef.current.aspect = width / height;
      cameraRef.current.updateProjectionMatrix();
      rendererRef.current.setSize(width, height);
    };

    window.addEventListener('resize', handleResize);
    const container = containerRef.current;

    return () => {
      isInitializedRef.current = false;
      if (animationFrameIdRef.current !== null) {
        cancelAnimationFrame(animationFrameIdRef.current);
        animationFrameIdRef.current = null;
      }

      window.removeEventListener('resize', handleResize);
      if (rendererRef.current && container) {
        container.removeChild(rendererRef.current.domElement);
      }

      sceneRef.current?.traverse((obj) => {
        if (obj instanceof THREE.Mesh) {
          obj.geometry?.dispose();
          if (Array.isArray(obj.material)) {
            obj.material.forEach((mat) => mat.dispose());
          } else {
            obj.material?.dispose();
          }
        }
      });

      rendererRef.current?.dispose();
      dracoLoader.current?.dispose();

      sceneRef.current = null;
      cameraRef.current = null;
      rendererRef.current = null;
      controlsRef.current = null;
      avatarRef.current = null;
      clothingRef.current = null;
      clothingMaterialRef.current = null;
      loaderRef.current = null;
      dracoLoader.current = null;
    };
  }, []);

  // 🧠 Reusable outside helper function
  // const hideCoveredAvatarParts = (avatarModel: THREE.Object3D | null, clothingModel: THREE.Object3D | null) => {
  //   if (!avatarModel || !clothingModel) return;

  //   const coveredParts: string[] = [];

  //   avatarModel.traverse((avatarNode) => {
  //     if (!(avatarNode instanceof THREE.Mesh)) return;
  //     const avatarBox = new THREE.Box3().setFromObject(avatarNode);

  //     clothingModel.traverse((clothingNode) => {
  //       if (!(clothingNode instanceof THREE.Mesh)) return;
  //       const clothingBox = new THREE.Box3().setFromObject(clothingNode);

  //       if (avatarBox.intersectsBox(clothingBox)) {
  //         avatarNode.visible = false;
  //         coveredParts.push(avatarNode.name);
  //       }
  //     });
  //   });

  //   console.log('Dynamically hidden parts:', coveredParts);
  // };

  useEffect(() => {
    if (!avatarUrl || !sceneRef.current || !loaderRef.current) return;

    if (avatarRef.current) {
      sceneRef.current.remove(avatarRef.current);
      avatarRef.current = null;
    }

    loaderRef.current.load(
      avatarUrl,
      (gltf) => {
        const model = gltf.scene;
        if (!model) {
          console.error('No model in GLTF scene');
          onLoadingComplete();
          return;
        }

        model.traverse((node) => {
          if (node instanceof THREE.Mesh) {
            console.log('Mesh found in avatar:', node.name);
            
            // handle transparency issues
            if (node.material) {
              if (Array.isArray(node.material)) {
                node.material.forEach(mat => {
                  if (mat.transparent) {
                    mat.alphaTest = 0.5;
                  }
                });
              } else if (node.material.transparent) {
                node.material.alphaTest = 0.5;
              }
            }

            node.castShadow = true;
            node.receiveShadow = true;
          }
        });

        
        // positioning
        model.position.set(0, 0, 0);
        model.scale.set(1, 1, 1);

        const box = new THREE.Box3().setFromObject(model);
        // const center = box.getCenter(new THREE.Vector3());
        const size = box.getSize(new THREE.Vector3());
        console.log('Bounding box size:', size);
        
        // model.position.set(0, 0, 0);
        // model.position.x = -center.x;
        // model.position.y = -center.y;
        // model.position.z = -center.z;
        if (cameraRef.current && controlsRef.current) {
          const maxDim = Math.max(size.x, size.y, size.y);
          const fov = cameraRef.current.fov * (Math.PI / 180);
          const cameraDistance = maxDim / (2 * Math.tan(fov / 2));
          cameraRef.current.position.z = cameraDistance * 1.5;
          cameraRef.current.updateProjectionMatrix();
          controlsRef.current.target.set(0, size.y / 2, 0);
          controlsRef.current.update();
        }

        if (sceneRef.current) {
          sceneRef.current.add(model);
          avatarRef.current = model;
          if (!clothingUrl) {
            onLoadingComplete();
          }
        }
        if (rendererRef.current && cameraRef.current && sceneRef.current) {
          rendererRef.current.render(sceneRef.current, cameraRef.current)
        }

      },
      (xhr) => {
        console.log((xhr.loaded / xhr.total * 100).toFixed(2) + '% loaded');
      },
      (error) => {
        console.error('Error loading avatar model:', error);
        onLoadingComplete();
      }
    );
  }, [avatarUrl, onLoadingComplete]);

  // Clothing model loader
  useEffect(() => {
    if (!clothingUrl || !sceneRef.current || !loaderRef.current) return;

    if (clothingRef.current) {
      sceneRef.current.remove(clothingRef.current);
      clothingRef.current = null;
      clothingMaterialRef.current = null;
    }

    loaderRef.current.load(
      clothingUrl,
      (gltf) => {
        const model = gltf.scene;
        model.rotation.y = Math.PI;

        model.traverse((obj) => {
          if (obj instanceof THREE.Mesh) {
            const material = new THREE.MeshStandardMaterial({
              color: new THREE.Color(clothingColor),
              roughness: 0.7,
              metalness: 0.2,
              polygonOffset: true,
              polygonOffsetFactor: 1,
              polygonOffsetUnits: 1,
              depthTest: true,
            });
            obj.material = material;
            clothingMaterialRef.current = material;
            obj.castShadow = true;
            obj.receiveShadow = false;
          }
        });

        if (avatarRef.current) {
          const avatarBox = new THREE.Box3().setFromObject(avatarRef.current);
          const clothingBox = new THREE.Box3().setFromObject(model);

          const avatarMax = Math.max(...avatarBox.getSize(new THREE.Vector3()).toArray());
          const clothingMax = Math.max(...clothingBox.getSize(new THREE.Vector3()).toArray());

          if (clothingMax > 0) {
            const scale = (avatarMax / clothingMax) * 0.7;
            model.scale.setScalar(scale);

            const newClothingBox = new THREE.Box3().setFromObject(model);
            const avatarCenter = avatarBox.getCenter(new THREE.Vector3());
            const clothingCenter = newClothingBox.getCenter(new THREE.Vector3());

            model.position.copy(avatarCenter).sub(clothingCenter);
          }
        }

        model.visible = isClothingVisible;

        if (sceneRef.current) {
          sceneRef.current.add(model);
          clothingRef.current = model;
          // hideCoveredAvatarParts(avatarRef.current, model);
        }

        onLoadingComplete();
      },
      undefined,
      (err) => {
        console.error('Error loading clothing model:', err);
        onLoadingComplete();
      }
    );
  }, [clothingColor, clothingUrl, isClothingVisible, onLoadingComplete]);

  useEffect(() => {
    if (clothingMaterialRef.current && clothingMaterialRef.current instanceof THREE.Material) {
      (clothingMaterialRef.current as THREE.MeshStandardMaterial).color.set(clothingColor);
    }
  }, [clothingColor]);

  return (
    <Box
      ref={containerRef}
      sx={{
        width: "100%",
        height: "100%",
        position: "relative",
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
            zIndex: 10,
          }}
        >
          <CircularProgress color="secondary" size={60} />
        </Box>
      )}
    </Box>
  );
}
