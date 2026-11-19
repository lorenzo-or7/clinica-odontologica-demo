/// <reference lib="webworker" />
import { computeToothArrays } from './toothGeometry';

// Gera a malha fora da thread principal para não travar a rolagem.
self.onmessage = (e: MessageEvent<{ resolution: number }>) => {
  const a = computeToothArrays(e.data.resolution);
  (self as unknown as DedicatedWorkerGlobalScope).postMessage(a, [a.pos.buffer, a.nor.buffer, a.col.buffer]);
};
