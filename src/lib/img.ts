/** Fotografias em public/images/<nome>-{sm,lg}.webp (geradas por scripts/fetch-images.mjs). */
const base = import.meta.env.BASE_URL;

export const img = (name: string, size: 'sm' | 'lg' = 'lg') => `${base}images/${name}-${size}.webp`;

export const srcSet = (name: string) => `${img(name, 'sm')} 800w, ${img(name, 'lg')} 1800w`;
