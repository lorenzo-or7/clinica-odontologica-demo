import { BufferAttribute, BufferGeometry } from 'three';
import { computeToothArrays, type ToothArrays } from './toothGeometry';

function toGeometry({ pos, nor, col }: ToothArrays) {
  const g = new BufferGeometry();
  g.setAttribute('position', new BufferAttribute(pos, 3));
  g.setAttribute('normal', new BufferAttribute(nor, 3));
  g.setAttribute('color', new BufferAttribute(col, 3));
  g.computeBoundingBox();
  g.center();
  g.computeBoundingSphere();
  return g;
}

/** Constrói a geometria em um Web Worker; sem suporte, cai para a thread principal. */
export function buildToothAsync(resolution: number): Promise<BufferGeometry> {
  if (typeof Worker === 'undefined') return Promise.resolve(toGeometry(computeToothArrays(resolution)));
  return new Promise((resolve) => {
    let worker: Worker;
    try {
      worker = new Worker(new URL('./tooth.worker.ts', import.meta.url), { type: 'module' });
    } catch {
      resolve(toGeometry(computeToothArrays(resolution)));
      return;
    }
    worker.onmessage = (e: MessageEvent<ToothArrays>) => {
      resolve(toGeometry(e.data));
      worker.terminate();
    };
    worker.onerror = () => {
      worker.terminate();
      resolve(toGeometry(computeToothArrays(resolution)));
    };
    worker.postMessage({ resolution });
  });
}
