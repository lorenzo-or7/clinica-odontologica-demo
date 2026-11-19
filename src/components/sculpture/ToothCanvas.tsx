import { Canvas, useFrame, useThree } from '@react-three/fiber';
import type { MotionValue } from 'motion/react';
import { useEffect, useRef, useState } from 'react';
import {
  type BufferGeometry,
  type Group,
  MathUtils,
  type Mesh,
  type MeshBasicMaterial,
  type MeshPhysicalMaterial,
  PMREMGenerator,
} from 'three';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import { buildToothAsync } from './buildTooth';

type Props = {
  progress: MotionValue<number>;
  active: boolean;
  reduced: boolean;
  compact: boolean;
  onReady?: () => void;
};

const smooth = (a: number, b: number, v: number) => {
  const t = MathUtils.clamp((v - a) / (b - a), 0, 1);
  return t * t * (3 - 2 * t);
};

function Environment() {
  const { gl, scene } = useThree();
  useEffect(() => {
    const pmrem = new PMREMGenerator(gl);
    const env = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
    // oxlint-disable-next-line react/immutability -- a cena do R3F é mutável por definição
    scene.environment = env;
    scene.environmentIntensity = 0.55;
    return () => {
      scene.environment = null;
      env.dispose();
      pmrem.dispose();
    };
  }, [gl, scene]);
  return null;
}

type ToothProps = Omit<Props, 'active' | 'onReady'> & { geometry: BufferGeometry };

/** Gera a malha no worker e só então monta o objeto. */
function ToothLoader({ onReady, ...props }: Omit<Props, 'active'>) {
  const [geometry, setGeometry] = useState<BufferGeometry | null>(null);
  const { compact } = props;
  useEffect(() => {
    let alive = true;
    let built: BufferGeometry | null = null;
    buildToothAsync(compact ? 64 : 84).then((g) => {
      built = g;
      if (alive) setGeometry(g);
      else g.dispose();
    });
    return () => {
      alive = false;
      built?.dispose();
    };
  }, [compact]);
  useEffect(() => {
    if (!geometry) return;
    const id = requestAnimationFrame(() => onReady?.());
    return () => cancelAnimationFrame(id);
  }, [geometry, onReady]);
  return geometry ? <Tooth geometry={geometry} {...props} /> : null;
}

function Tooth({ progress, reduced, compact, geometry }: ToothProps) {
  const group = useRef<Group>(null);
  const solid = useRef<MeshPhysicalMaterial>(null);
  const wire = useRef<MeshBasicMaterial>(null);
  const ring = useRef<Mesh>(null);
  const ringMat = useRef<MeshBasicMaterial>(null);
  const pointer = useRef({ x: 0, y: 0 });
  const { size } = useThree();

  useEffect(() => {
    if (reduced || compact) return;
    const onMove = (e: PointerEvent) => {
      pointer.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      pointer.current.y = (e.clientY / window.innerHeight) * 2 - 1;
    };
    window.addEventListener('pointermove', onMove, { passive: true });
    return () => window.removeEventListener('pointermove', onMove);
  }, [reduced, compact]);

  // A câmera usa FOV vertical: só reduzimos quando o palco fica estreito demais para a largura do dente.
  const scale = Math.min(0.84, (size.width / Math.max(size.height, 1)) * 1.1);

  useFrame((state, delta) => {
    const g = group.current;
    if (!g) return;
    const p = progress.get();
    const t = state.clock.elapsedTime;
    const dt = Math.min(delta, 1 / 20);

    // Três momentos: forma (0–.36), precisão (.36–.68), resultado (.68–1).
    const scan = smooth(0.3, 0.42, p) * (1 - smooth(0.62, 0.74, p));
    const result = smooth(0.66, 0.8, p);

    const targetY = reduced ? -0.55 + p * 1.4 : p * Math.PI * 2.1 - 0.5 + t * 0.05;
    const targetX = 0.12 + result * 0.42 + (reduced ? 0 : pointer.current.y * 0.08);
    const targetZ = -0.08 + (reduced ? 0 : pointer.current.x * -0.06);
    g.rotation.y = MathUtils.damp(g.rotation.y, targetY, 4, dt);
    g.rotation.x = MathUtils.damp(g.rotation.x, targetX, 4, dt);
    g.rotation.z = MathUtils.damp(g.rotation.z, targetZ, 4, dt);
    g.position.y = MathUtils.damp(g.position.y, -0.05 + result * 0.12 + (reduced ? 0 : Math.sin(t * 0.8) * 0.02), 4, dt);

    if (solid.current) {
      solid.current.opacity = MathUtils.damp(solid.current.opacity, 1 - scan * 0.78, 6, dt);
      solid.current.depthWrite = solid.current.opacity > 0.98;
      solid.current.clearcoat = MathUtils.damp(solid.current.clearcoat, 0.45 + result * 0.55, 4, dt);
    }
    if (wire.current) wire.current.opacity = MathUtils.damp(wire.current.opacity, scan * 0.55, 6, dt);
    if (ring.current && ringMat.current) {
      const sweep = reduced ? 0.2 : Math.sin(t * 1.1) * 0.95;
      ring.current.position.y = sweep;
      ring.current.scale.setScalar(0.92 + (1 - Math.abs(sweep)) * 0.12);
      ringMat.current.opacity = MathUtils.damp(ringMat.current.opacity, scan * 0.9, 6, dt);
    }
  });

  return (
    <group scale={scale}>
      <group ref={group} rotation={[0.12, -0.5, -0.08]}>
        <mesh geometry={geometry} renderOrder={1}>
          <meshPhysicalMaterial
            ref={solid}
            vertexColors
            roughness={0.3}
            metalness={0}
            clearcoat={0.45}
            clearcoatRoughness={0.22}
            sheen={0.6}
            sheenRoughness={0.5}
            sheenColor="#fff3df"
            specularIntensity={0.6}
            transparent
          />
        </mesh>
        <mesh geometry={geometry} renderOrder={2}>
          <meshBasicMaterial ref={wire} wireframe color="#a4c4b2" transparent opacity={0} depthWrite={false} />
        </mesh>
      </group>
      <mesh ref={ring} rotation={[Math.PI / 2, 0, 0]} renderOrder={3}>
        <torusGeometry args={[0.98, 0.004, 8, 160]} />
        <meshBasicMaterial ref={ringMat} color="#a4c4b2" transparent opacity={0} depthWrite={false} />
      </mesh>
    </group>
  );
}

/** Canvas WebGL carregado sob demanda (chunk separado). */
export default function ToothCanvas({ progress, active, reduced, compact, onReady }: Props) {
  return (
    <Canvas
      dpr={compact ? [1, 1.5] : [1, 2]}
      frameloop={active ? 'always' : 'never'}
      camera={{ position: [0, 0, 4.6], fov: 32 }}
      gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
      aria-hidden
    >
      <Environment />
      <ambientLight intensity={0.35} />
      <directionalLight position={[3, 4, 5]} intensity={2.2} color="#fff3e2" />
      <directionalLight position={[-4, 1.5, -3]} intensity={1.6} color="#a4c4b2" />
      <directionalLight position={[0, -4, 2]} intensity={0.35} color="#ffffff" />
      <ToothLoader progress={progress} reduced={reduced} compact={compact} onReady={onReady} />
    </Canvas>
  );
}
