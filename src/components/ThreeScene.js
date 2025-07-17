import React, { useRef, useEffect, useMemo, Suspense, useState } from 'react';
import { Canvas, useThree, useLoader } from '@react-three/fiber';
import {
  OrbitControls,
  Environment,
  AccumulativeShadows,
  RandomizedLight,
} from '@react-three/drei';
import * as THREE from 'three';
import { EffectComposer, GodRays, Bloom } from '@react-three/postprocessing';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader';
import { TextureLoader } from 'three';

function getMetalColor(metalName) {
  const metalColors = {
    
    
    YellowGold: '#f5c069',
    
    WhiteGold: '#dfdfdf',
    
    RoseGold: '#e4aa80',
  };
  return metalColors[metalName] || '#cccccc';
}



function Ground() {
  return (
    <>
      {/* Yatay zemin */}
      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, -0.32, 0]}
        receiveShadow
      >
        <planeGeometry args={[25,25]} />
        <meshStandardMaterial color="white" metalness={0}/>
      </mesh>

      
    </>
  );
}



const createMetalMaterial = (metalType, envMap) => {
  const params = {
    YellowGold: {  color: 0xf5c069, roughness: 0.05, metalness: 1.0 },
    WhiteGold: {  color: 0xdfdfdf, roughness: 0.05, metalness: 1.0 },
    RoseGold: {  color: 0xe4aa80, roughness: 0.05, metalness: 1.0 },
    
    
  };
  const materialParams = params[metalType] || params['WhiteGold'];

  return new THREE.MeshStandardMaterial({
    color: new THREE.Color(materialParams.color),
    roughness: materialParams.roughness,
    metalness: materialParams.metalness,
    envMap: envMap,
    envMapIntensity: 25,
    depthWrite: true,        // help prevent showing through diamond
    transparent: true,
    opacity: 0.9999,           // subtly trick transmission
  });
};

function createDiamondMaterial(envMap) {
  return new THREE.MeshPhysicalMaterial({
    color: new THREE.Color(0xffffff),     // Saf beyaz
    metalness: 0.0,                       // Pırlanta metal değildir
    roughness: 0.0,                       // Yüzey çok pürüzsüz
    transmission: 1,                     // Tam geçirgenlik (cam/elmas)
    thickness:1,                         // İç kırılmalar için
    ior: 2,                            // Elmas kırılma indisi
    envMap: envMap,
    envMapIntensity: 2.1,
    reflectivity: 0.12,                   // Parlaklık
    clearcoat: 1,
    clearcoatRoughness: 0.0,
    sheen: 1,
    sheenColor: new THREE.Color(0,0,0),
     iridescence: 1,                 // Etkinlik (0 ile 1 arası)
    iridescenceIOR: 0.26,              // Kırınım indeksi (default: 1.3)
    iridescenceThicknessRange: [100,800],                      // Hafif renk kırınımı
               // Ortalama kalınlık
    attenuationDistance: 0.1,
    attenuationColor: new THREE.Color(1, 1, 1),
    specularIntensity: 1.5,
    specularColor: new THREE.Color(0, 0, 0),
    transparent: true,
    opacity: 20,                          // Tam saydamlık (transmission ile birlikte)
    side: THREE.DoubleSide,
    emissive: new THREE.Color(0, 0, 0),
    shadowSide:THREE.FrontSide,
    depthWrite:true,
  });
}

function ModelLoader({ path, onLoaded }) {
  const gltf = useLoader(GLTFLoader, path);
  const { scene } = useThree();
  const [model, setModel] = useState(null);

  const diamondMaterial = useMemo(() => {
    if (!scene.environment) return null;
    return createDiamondMaterial(scene.environment);
  }, [scene.environment]);

  useEffect(() => {
    if (gltf && gltf.scene && diamondMaterial) {
      const cloned = gltf.scene.clone(true);
      cloned.traverse((child) => {
        if (child.isMesh) {
          child.material = diamondMaterial;
          child.castShadow = true;
          child.receiveShadow = true;
        }
      });
      if (onLoaded) onLoaded(cloned);
      setModel(cloned);
    }
  }, [gltf, diamondMaterial, onLoaded]);

  return model ? <primitive object={model} /> : null;
}

function MetalLoader({ path, metalType, onLoaded }) {
  const gltf = useLoader(GLTFLoader, path);
  const { scene } = useThree();
  const [model, setModel] = useState(null);

  // Yeni metal materyalini hesapla
  const metalMaterial = useMemo(() => {
    if (!scene.environment) return null;
    return createMetalMaterial(metalType, scene.environment);
  }, [scene.environment, metalType]);

  // İlk yüklemede modeli oluştur ve materyali uygula
  useEffect(() => {
    if (gltf && gltf.scene && metalMaterial) {
      const cloned = gltf.scene.clone(true);
      cloned.traverse((child) => {
        if (child.isMesh) {
          child.material = metalMaterial;
          child.castShadow = true;
          child.receiveShadow = true;
        }
      });
      if (onLoaded) onLoaded(cloned);
      setModel(cloned);
    }
  }, [gltf, metalMaterial, onLoaded]);

  // metalMaterial değiştiğinde mevcut modele materyali tekrar uygula
  useEffect(() => {
    if (model && metalMaterial) {
      model.traverse((child) => {
        if (child.isMesh) {
          child.material = metalMaterial;
        }
      });
    }
  }, [metalMaterial]);

  return model ? <primitive object={model} /> : null;
}


function SceneContent({
  cameraType = '3D',
  stoneType = 'RO',
  stoneSize = '5',
  stoneCode = '6868',
  yuvaType = 'AH-NO',
  yuvaMetal = 'WhiteGold18k',
  bandType = '7',
  bandMetal = 'RoseGold14k'
}) {
  const { gl, camera, scene } = useThree();
  const [sunMesh, setSunMesh] = useState(null);

  const cameraPositions = {
    '3D': {
      position: new THREE.Vector3(0, 2.3, 3.5),
      target: new THREE.Vector3(0, 0, 0),
    },
    'X':{
      position: new THREE.Vector3(-0.8,0.8,0.8),
      target:new THREE.Vector3(0,0,0),
    },
    'Y':{
      position: new THREE.Vector3(0.2,1,0),
      target:new THREE.Vector3(0,0,0),
    },
    'Z':{
      position: new THREE.Vector3(0,1,0),
      target:new THREE.Vector3(0,0,0),
    },
    
  };

  useEffect(() => {
    const config = cameraPositions[cameraType];
    if (config) {
      camera.position.copy(config.position);
      camera.lookAt(config.target);
      camera.updateProjectionMatrix();
      
    }
  }, [cameraType]);

  const mainStonePath = `/models/yuvalar/${stoneType}/${stoneSize}/ST/ST.glb`;
  const hlStonePath = `/models/yuvalar/${stoneType}/${stoneSize}/ST/HL.glb`;
  const yuvaPath = `/models/yuvalar/${stoneType}/${stoneSize}/OO/${stoneType}-${yuvaType}-${stoneCode}.glb`;
  //const yuvaPath = `/models/yuvalar/${stoneType}/${stoneSize}/OO/RO-AH-NO-6868.glb`;
  const bandPath = `/models/kollar/OO/${bandType}.glb`;
  const bandStonePath = `/models/kollar/ST/${bandType}.glb`;


  


  return (
    <>
      <Environment files="/metal_01.hdr" background={false} />
      <Suspense fallback={null}>
        <ModelLoader
          path={mainStonePath}
          onLoaded={(model) => {
            model.scale.set(30,30,30);
            const mesh = model.children.find((c) => c.isMesh);
            if (mesh) setSunMesh(mesh);
            
          }}
        />

        {yuvaType.includes('HL') && (
          <ModelLoader
            path={hlStonePath}
            materialType="diamond"
            onLoaded={(model) => model.scale.set(30,30,30)}
          />
        )}

        {['5', '6', '7','8'].some(val => bandType.includes(val)) && (
          <ModelLoader
            path={bandStonePath}
            materialType="diamond"
            onLoaded={(model) => model.scale.set(30,30,30)}

          />
        )}
        

        <MetalLoader
          metalType={yuvaMetal}
          path={yuvaPath}
          onLoaded={(model) => {
            model.scale.set(30,30,30);
            const mesh = model.children.find((c) => c.isMesh);
            if (mesh) setSunMesh(mesh);
          }}
        />

        <MetalLoader
          metalType={bandMetal}
          path={bandPath}
          onLoaded={(model) => {
            model.scale.set(30,30,30);
            const mesh = model.children.find((c) => c.isMesh);
            if (mesh) setSunMesh(mesh);
          }}
        />

        
          
       
      </Suspense>

      <OrbitControls
         enabled={!(cameraType === 'X' || cameraType === 'Y' || cameraType === 'Z')} 
        args={[camera, gl.domElement]}
        enableDamping
        dampingFactor={0.1}
        minDistance={0.95}
        maxDistance={1.1}
        zoomSpeed={0.8}
        mouseButtons={{
          LEFT: THREE.MOUSE.ROTATE,
          MIDDLE: null,
          RIGHT: null,
        }}
        enablePan={false}
        autoRotate
        autoRotateSpeed={4}
        minPolarAngle={0} // 0 radians = straight up
        maxPolarAngle={Math.PI / 7}
      />

      <EffectComposer>
        
        
      </EffectComposer>
    </>
  );
}

function ThreeScene(props) {
  const canvasRef = useRef();
  const resizeObserver = useRef(null);

  useEffect(() => {
    if (canvasRef.current) {
      const parent = canvasRef.current.parentElement;
      resizeObserver.current = new ResizeObserver(() => {
        const width = parent.clientWidth;
        const height = parent.clientHeight;
        if (canvasRef.current) {
          canvasRef.current.style.width = `${width}px`;
          canvasRef.current.style.height = `${height}px`;
        }
      });
      resizeObserver.current.observe(parent);
    }
    return () => {
      if (resizeObserver.current) {
        resizeObserver.current.disconnect();
      }
    };
  }, []);

  return (
    <Canvas
    
      shadows
      ref={canvasRef}
      gl={{
        antialias: true,
        alpha: true,
        powerPreference: 'high-performance',
        outputColorSpace: THREE.SRGBColorSpace,
        toneMapping: THREE.ACESFilmicToneMapping,
        toneMappingExposure:0.04,
        physicallyCorrectLights: true,
        shadowMap: { enabled: true, type: THREE.PCFShadowMap },
      }}
      camera={{ fov: 55, near: 0.01, far: 100 }}
      dpr={window.devicePixelRatio > 1 ? 1.5 : 1.5}
    >
      <ambientLight intensity={40}
       />
      <directionalLight
  position={[3.8, 0, 0]}
  intensity={1}
  
  castShadow
/>

       <Ground /> 
      <SceneContent {...props} />
    </Canvas>
  );
}

export default ThreeScene;
