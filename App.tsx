import React, { useState, Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { Loader } from '@react-three/drei';
import Scene from './components/Scene';
import UIOverlay from './components/UIOverlay';

export default function App() {
  const [mode, setMode] = useState<'WISH' | 'CHAOS'>('WISH');
  const [blurLevel, setBlurLevel] = useState(0);
  const [snowSize, setSnowSize] = useState(0.5);
  const [title, setTitle] = useState('MERRY CHRISTMAS');
  const [subtitle, setSubtitle] = useState('HAUTE COUTURE');
  const [isFrozen, setIsFrozen] = useState(false);

  return (
    <div className="relative w-full h-screen bg-black text-white overflow-hidden">
      <Canvas
        dpr={[1, 2]} 
        camera={{ position: [0, 0, 22], fov: 40 }}
        gl={{ 
          antialias: true,
          stencil: false,
          depth: true,
          powerPreference: 'high-performance',
          alpha: false
        }}
      >
        <color attach="background" args={['#000000']} />
        <Suspense fallback={null}>
          <Scene 
            mode={mode} 
            blurLevel={blurLevel} 
            snowSize={snowSize} 
            isFrozen={isFrozen}
          />
        </Suspense>
      </Canvas>
      
      <Loader 
        containerStyles={{ background: 'black' }} 
        innerStyles={{ width: '200px', background: '#333' }}
        barStyles={{ background: '#fff' }}
        dataStyles={{ color: '#fff', fontFamily: 'Inter' }}
      />
      
      <UIOverlay 
        currentMode={mode} 
        setMode={setMode} 
        blurLevel={blurLevel}
        setBlurLevel={setBlurLevel}
        snowSize={snowSize}
        setSnowSize={setSnowSize}
        title={title}
        setTitle={setTitle}
        subtitle={subtitle}
        setSubtitle={setSubtitle}
        isFrozen={isFrozen}
        setIsFrozen={setIsFrozen}
      />
    </div>
  );
}