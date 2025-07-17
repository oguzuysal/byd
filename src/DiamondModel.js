import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import {
  OrbitControls,
  Environment,
  useGLTF,
  MeshTransmissionMaterial,
  AccumulativeShadows,
  RandomizedLight
} from '@react-three/drei';
import { EffectComposer, Bloom } from '@react-three/postprocessing';

/**
 * Tek dosyalık tam çözüm – App.js
 *
 * Gereken public dosyalar:
 *   /ST.glb            → pırlanta modeli
 *   /env-gem-1.hdr     → HDRI ortam haritası (örn. polyhaven studio_small_03)
 *
 * Gerekli paketler:
 *   npm i three @react-three/fiber @react-three/drei @react-three/postprocessing
 */

function DiamondModel() {
  // GLB yüklenir
  const { nodes } = useGLTF('/ST.glb');

  /**
   * Bazı GLB dosyaları birden fazla mesh içerir, ilk görünen Mesh'i alıyoruz.
   * Konsoldan adını öğrenip, gerekirse özel bir mesh adıyla değiştirebilirsin.
   */
  const mesh = Object.values(nodes).find((n) => n.isMesh);

  if (!mesh?.geometry) {
    console.warn('Pırlanta mesh geometry bulunamadı – GLB yapısını kontrol et');
    return null;
  }

  return (
    <mesh geometry={mesh.geometry} scale={10} castShadow receiveShadow>
      <MeshTransmissionMaterial
        thickness={2.5}
        transmission={1}
        roughness={0}
        ior={2.417}
        chromaticAberration={0.03}
        anisotropy={0.1}
        distortion={0.02}
        temporalDistortion={0.05}
        backside
      />
    </mesh>
  );
}

export default function App() {
  return (
    <div style={{ width: '100vw', height: '100vh', margin: 0, overflow: 'hidden' }}>
      <Canvas
        shadows
        dpr={[1, 2]}
        camera={{ position: [0, 0.15, 1.6], fov: 40 }}
        gl={{ preserveDrawingBuffer: true }}
      >
        <Suspense fallback={null}>
          {/* HDR ortam aydınlatması */}
          <Environment files="/env-gem-1.hdr" background blur={0.4} />

          {/* Yumuşak gölgeler için ışık set‑up */}
          <AccumulativeShadows
            temporal
            frames={120}
            color="#ffffff"
            colorBlend={2}
            toneMapped
            alphaTest={0.9}
            scale={12}
          >
            <RandomizedLight
              amount={8}
              radius={4}
              intensity={1}
              ambient={0.5}
              position={[5, 5, -10]}
            />
          </AccumulativeShadows>

          {/* Pırlanta modeli */}
          <DiamondModel />

          {/* Işıltı efekti */}
          <EffectComposer>
            <Bloom intensity={1.2} luminanceThreshold={0.15} mipmapBlur />
          </EffectComposer>

          {/* Kamera kontrolü */}
          <OrbitControls enablePan={false} enableZoom enableRotate makeDefault />
        </Suspense>
      </Canvas>
    </div>
  );
}

/**
 * Global stil – index.css veya App.css sonuna ekle:
 *
 * html, body, #root {
 *   width: 100%;
 *   height: 100%;
 *   margin: 0;
 *   overflow: hidden;
 * }
 */
