import * as THREE from "three";

export function getContrastTextColor(hexColor: string): string {
  const hex = hexColor.replace('#', '');
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);
  const brightness = (r * 299 + g * 587 + b * 114) / 1000;

  // return black for bright colors, white for dark colors
  return brightness > 128 ? '#000000' : '#ffffff';
}

export function disposeSceneResources(scene: THREE.Scene) {
    scene.traverse((object) => {
      if (object instanceof THREE.Mesh) {
        if (object.geometry) {
          object.geometry.dispose();
        }
        if (object.material) {
          if (Array.isArray(object.material)) {
            object.material.forEach(material => material.dispose());
          } else {
            object.material.dispose();
          }
        }
      }
    });
  };

export function hideCoveredAvatarParts(avatarModel: THREE.Object3D | null, clothingModel: THREE.Object3D | null) {
    if (!avatarModel || !clothingModel) return;

    const coveredParts: string[] = [];
    const tolerance = 0.01; // Tolerance for overlap detection
    
    // Known part names that typically get covered by clothing
    const commonCoveredParts = ['torso', 'chest', 'body', 'upperBody'];
    
    avatarModel.traverse((avatarNode) => {
      if (!(avatarNode instanceof THREE.Mesh)) return;
      
      // Check for common names that should be hidden
      const nodeName = avatarNode.name.toLowerCase();
      if (commonCoveredParts.some(part => nodeName.includes(part))) {
        if (clothingModel.visible) {
          avatarNode.visible = false;
          coveredParts.push(avatarNode.name);
          return;
        }
      }
      
      // Otherwise use bounding box intersection
      const avatarBox = new THREE.Box3().setFromObject(avatarNode);
      
      let hasIntersection = false;
      clothingModel.traverse((clothingNode) => {
        if (hasIntersection || !(clothingNode instanceof THREE.Mesh)) return;
        const clothingBox = new THREE.Box3().setFromObject(clothingNode);
        
        // Expand clothing box slightly to ensure proper covering
        clothingBox.min.subScalar(tolerance);
        clothingBox.max.addScalar(tolerance);
        
        if (avatarBox.intersectsBox(clothingBox)) {
          hasIntersection = true;
        }
      });
      
      if (hasIntersection && clothingModel.visible) {
        avatarNode.visible = false;
        coveredParts.push(avatarNode.name);
      } else {
        avatarNode.visible = true;
      }
    });

    console.log('Hidden avatar parts:', coveredParts);
};

export function fitClothingToAvatar(
  clothingModel: THREE.Object3D, 
  avatarModel: THREE.Object3D,
  avatarSkeletonRef: React.RefObject<THREE.Skeleton | null>,
  avatarBonesRef: React.RefObject<Map<string, THREE.Bone>>
) {
    if (!clothingModel || !avatarModel) return;
    
    let hasBindableSkinnedMesh = false;
    
    clothingModel.traverse((node) => {
      if (node instanceof THREE.SkinnedMesh && avatarSkeletonRef.current) {
        hasBindableSkinnedMesh = true;
        console.log('Found skinned mesh in clothing:', node.name);
        
        try {
          // Try to bind the clothing's skinned mesh to the avatar's skeleton
          if (node.skeleton && avatarSkeletonRef.current) {
            console.log('Attempting to bind clothing to avatar skeleton');
            
            // Map clothing bones to avatar bones
            const clothingBones = node.skeleton.bones;
            const mappedBones: THREE.Bone[] = [];
            
            clothingBones.forEach(clothingBone => {
              // Try to find matching bone in avatar
              const matchingBone = avatarBonesRef.current.get(clothingBone.name);
              if (matchingBone) {
                mappedBones.push(matchingBone);
                console.log(`Mapped clothing bone ${clothingBone.name} to avatar bone`);
              } else {
                // If no direct match, try common bone mappings
                const lowercaseName = clothingBone.name.toLowerCase();
                
                // Try to find a similar bone by partial name matching
                let foundMatch = false;
                avatarBonesRef.current.forEach((bone, name) => {
                  if (!foundMatch) {
                    const lowerBoneName = name.toLowerCase();
                    
                    // Check for common naming patterns
                    if ((lowercaseName.includes('chest') && lowerBoneName.includes('spine')) || 
                        (lowercaseName.includes('shoulder') && lowerBoneName.includes('clavicle')) ||
                        (lowercaseName.includes('arm') && lowerBoneName.includes('arm')) ||
                        (lowercaseName.includes('leg') && lowerBoneName.includes('thigh'))) {
                      mappedBones.push(bone);
                      foundMatch = true;
                      console.log(`Mapped clothing bone ${clothingBone.name} to similar avatar bone ${name}`);
                    }
                  }
                });
                
                if (!foundMatch) {
                  // Use a placeholder if no match found
                  mappedBones.push(clothingBone);
                  console.log(`No matching bone found for ${clothingBone.name}`);
                }
              }
            });
            
            // Only proceed if we found enough bone mappings
            if (mappedBones.length > 0) {
              // Create a new skeleton with mapped bones
              const newSkeleton = new THREE.Skeleton(mappedBones, node.skeleton.boneInverses);
              node.bind(newSkeleton);
              console.log('Successfully bound clothing to avatar skeleton');
            }
          }
        } catch (error) {
          console.error('Error binding clothing to skeleton:', error);
        }
      }
    });
    if (!hasBindableSkinnedMesh) {
      console.log('No bindable skinned meshes found, using position-based fitting');
      
      // Position-based fitting as fallback
      const avatarBox = new THREE.Box3().setFromObject(avatarModel);
      const clothingBox = new THREE.Box3().setFromObject(clothingModel);

      const avatarSize = avatarBox.getSize(new THREE.Vector3());
      const clothingSize = clothingBox.getSize(new THREE.Vector3());
      
      // Scale clothing to match avatar proportions if needed
      if (clothingSize.y > 0 && avatarSize.y > 0) {
        const scaleY = avatarSize.y / clothingSize.y;
        clothingModel.scale.multiplyScalar(scaleY * 0.95); // Slightly smaller to fit better
      }
      
      // Center clothing on avatar's torso area
      const avatarCenter = avatarBox.getCenter(new THREE.Vector3());
      
      // Find torso region (upper half of the model)
      const torsoY = avatarBox.min.y + (avatarSize.y * 0.6);
      const torsoPosition = new THREE.Vector3(avatarCenter.x, torsoY, avatarCenter.z);
      
      // Update clothing position 
      const newClothingBox = new THREE.Box3().setFromObject(clothingModel);
      const clothingCenter = newClothingBox.getCenter(new THREE.Vector3());
      clothingModel.position.copy(torsoPosition).sub(clothingCenter);
    }
    
    // After fitting, hide avatar parts that would be covered by clothing
    hideCoveredAvatarParts(avatarModel, clothingModel);
};

export function createBoneMap(object: THREE.Object3D) {
  const boneMap = new Map<string, THREE.Bone>();
  object.traverse((node) => {
    if (node instanceof THREE.Bone) {
      boneMap.set(node.name, node);
    }
  });
  return boneMap;
};
