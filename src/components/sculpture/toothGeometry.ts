import { Color, MeshBasicMaterial } from 'three';
import { MarchingCubes } from 'three/examples/jsm/objects/MarchingCubes.js';

/**
 * Molar procedural.
 * A forma é descrita por uma função de distância com sinal (SDF): coroa arredondada,
 * quatro cúspides, sulcos oclusais, colo e três raízes unidas por mínimos suaves.
 * O campo é poligonizado uma única vez com Marching Cubes e convertido em BufferGeometry estática.
 */

const R = 1.5; // meia aresta do volume amostrado, em unidades de cena

const clamp = (v: number, a: number, b: number) => Math.min(Math.max(v, a), b);

function smin(a: number, b: number, k: number) {
  const h = Math.max(k - Math.abs(a - b), 0) / k;
  return Math.min(a, b) - h * h * k * 0.25;
}
/** Subtração suave: remove b de a. */
function ssub(a: number, b: number, k: number) {
  return -smin(-a, b, k);
}

function sphere(x: number, y: number, z: number, cx: number, cy: number, cz: number, r: number) {
  return Math.hypot(x - cx, y - cy, z - cz) - r;
}

/** Cápsula com raio variável entre A e B (aproximação suficiente para campo implícito). */
function cone(
  x: number, y: number, z: number,
  ax: number, ay: number, az: number,
  bx: number, by: number, bz: number,
  ra: number, rb: number,
) {
  const px = x - ax, py = y - ay, pz = z - az;
  const dx = bx - ax, dy = by - ay, dz = bz - az;
  const h = clamp((px * dx + py * dy + pz * dz) / (dx * dx + dy * dy + dz * dz), 0, 1);
  return Math.hypot(px - dx * h, py - dy * h, pz - dz * h) - (ra + (rb - ra) * h);
}

function roundBox(x: number, y: number, z: number, bx: number, by: number, bz: number, r: number) {
  const qx = Math.abs(x) - bx, qy = Math.abs(y) - by, qz = Math.abs(z) - bz;
  const outside = Math.hypot(Math.max(qx, 0), Math.max(qy, 0), Math.max(qz, 0));
  return outside + Math.min(Math.max(qx, qy, qz), 0) - r;
}

export function toothSDF(x: number, y: number, z: number) {
  // Coroa: caixa arredondada que se estreita em direção ao colo.
  const t = 1 - 0.22 * clamp((0.42 - y) / 0.42, 0, 1);
  const cx = x / t, cz = z / t;
  let crown = roundBox(cx, y - 0.46, cz, 0.36, 0.16, 0.3, 0.26) * t;

  // Bojo vestibular e lingual leves.
  crown = smin(crown, sphere(x, y, z, 0, 0.45, 0.22, 0.42), 0.18);
  crown = smin(crown, sphere(x, y, z, 0, 0.45, -0.2, 0.42), 0.18);

  // Quatro cúspides.
  crown = smin(crown, sphere(x, y, z, 0.27, 0.66, 0.21, 0.25), 0.14);
  crown = smin(crown, sphere(x, y, z, -0.27, 0.65, 0.22, 0.24), 0.14);
  crown = smin(crown, sphere(x, y, z, 0.28, 0.67, -0.2, 0.26), 0.14);
  crown = smin(crown, sphere(x, y, z, -0.26, 0.64, -0.21, 0.24), 0.14);

  // Sulcos oclusais em cruz e fossa central.
  crown = ssub(crown, cone(x, y, z, -0.42, 0.9, 0.0, 0.42, 0.9, 0.02, 0.06, 0.06), 0.09);
  crown = ssub(crown, cone(x, y, z, 0.01, 0.9, -0.36, -0.01, 0.9, 0.36, 0.055, 0.055), 0.09);
  crown = ssub(crown, sphere(x, y, z, 0, 0.84, 0, 0.1), 0.08);

  // Colo.
  const neck = cone(x, y, z, 0, 0.3, 0, 0, -0.12, 0, 0.44, 0.38);
  let d = smin(crown, neck, 0.16);

  // Raízes: mesial, distal e palatina, cada uma em dois segmentos levemente curvos.
  const mesial = smin(
    cone(x, y, z, 0.2, -0.02, 0.04, 0.3, -0.66, 0.06, 0.25, 0.165),
    cone(x, y, z, 0.3, -0.66, 0.06, 0.25, -1.3, 0.1, 0.165, 0.055),
    0.08,
  );
  const distal = smin(
    cone(x, y, z, -0.2, -0.02, 0.04, -0.31, -0.62, 0.05, 0.25, 0.165),
    cone(x, y, z, -0.31, -0.62, 0.05, -0.37, -1.22, 0.0, 0.165, 0.055),
    0.08,
  );
  const palatal = smin(
    cone(x, y, z, 0, -0.04, -0.16, 0.02, -0.6, -0.33, 0.23, 0.15),
    cone(x, y, z, 0.02, -0.6, -0.33, 0.04, -1.16, -0.4, 0.15, 0.05),
    0.08,
  );
  const roots = smin(smin(mesial, distal, 0.14), palatal, 0.14);
  d = smin(d, roots, 0.2);
  return d;
}

const enamel = new Color('#f4f0e8');
const dentin = new Color('#e2d1b4');
const tmp = new Color();

export type ToothArrays = { pos: Float32Array; nor: Float32Array; col: Float32Array };

/** Gera os atributos da malha. `resolution` controla o detalhe (64 no celular, 84 no desktop). */
export function computeToothArrays(resolution = 84): ToothArrays {
  const mc = new MarchingCubes(resolution, new MeshBasicMaterial(), false, false, 120000);
  const size = mc.size;
  const half = size / 2;
  const iso = mc.isolation;
  const field = mc.field;
  for (let k = 0; k < size; k++) {
    const z = ((k - half) / half) * R;
    for (let j = 0; j < size; j++) {
      const y = ((j - half) / half) * R - 0.18;
      const off = k * size * size + j * size;
      for (let i = 0; i < size; i++) {
        const x = ((i - half) / half) * R;
        const d = toothSDF(x, y, z);
        field[off + i] = iso - clamp(d, -0.25, 0.25) * 320;
      }
    }
  }
  mc.update();

  const count = mc.count;
  const srcPos = mc.geometry.getAttribute('position').array as Float32Array;
  const srcNor = mc.geometry.getAttribute('normal').array as Float32Array;
  const pos = new Float32Array(count * 3);
  const nor = new Float32Array(count * 3);
  const col = new Float32Array(count * 3);
  for (let v = 0; v < count; v++) {
    const px = srcPos[v * 3] * R;
    const py = srcPos[v * 3 + 1] * R;
    const pz = srcPos[v * 3 + 2] * R;
    pos[v * 3] = px;
    pos[v * 3 + 1] = py;
    pos[v * 3 + 2] = pz;
    nor[v * 3] = srcNor[v * 3];
    nor[v * 3 + 1] = srcNor[v * 3 + 1];
    nor[v * 3 + 2] = srcNor[v * 3 + 2];
    // Esmalte na coroa, tom de dentina/cemento nas raízes, transição suave no colo.
    const wy = py - 0.18;
    const m = clamp((wy + 0.12) / 0.32, 0, 1);
    tmp.copy(dentin).lerp(enamel, m * m * (3 - 2 * m));
    col[v * 3] = tmp.r;
    col[v * 3 + 1] = tmp.g;
    col[v * 3 + 2] = tmp.b;
  }
  mc.geometry.dispose();
  (mc.material as MeshBasicMaterial).dispose();
  return { pos, nor, col };
}
