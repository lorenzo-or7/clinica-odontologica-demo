import { site } from '../config/site';

/** Monta o link do WhatsApp somente quando há número configurado. */
export function whatsappLink(message: string) {
  const n = site.contact.whatsapp;
  if (!n) return null;
  return `https://wa.me/${n}?text=${encodeURIComponent(message)}`;
}

export function phoneLink() {
  const n = site.contact.phone;
  return n ? `tel:+${n}` : null;
}

export function routesLink() {
  const q = site.address.mapsQuery;
  return q ? `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(q)}` : null;
}

export const hasAddress = () => Boolean(site.address.street);
