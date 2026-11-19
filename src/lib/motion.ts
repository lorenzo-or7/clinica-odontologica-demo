/** Sistema de movimento: durações em segundos e curvas compartilhadas. */
export const ease = {
  out: [0.22, 1, 0.36, 1] as const,
  inOut: [0.65, 0, 0.35, 1] as const,
  expo: [0.16, 1, 0.3, 1] as const,
};

export const dur = {
  micro: 0.2, // microinterações (150–250 ms)
  reveal: 0.7, // revelações (450–800 ms)
  editorial: 1.0, // transições editoriais (700–1100 ms)
};

export const spring = { type: 'spring', stiffness: 420, damping: 30, mass: 0.7 } as const;
