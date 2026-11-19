import { useState, type ImgHTMLAttributes } from 'react';
import { img, srcSet } from '../../lib/img';

type Props = Omit<ImgHTMLAttributes<HTMLImageElement>, 'src' | 'srcSet'> & {
  name: string;
  alt: string;
  sizes?: string;
  priority?: boolean;
};

/**
 * Fotografia responsiva com estado de falha: se o arquivo não carregar,
 * o espaço mantém a proporção e mostra uma superfície neutra rotulada.
 */
export function Picture({ name, alt, sizes = '100vw', priority, className = '', style, ...rest }: Props) {
  const [failed, setFailed] = useState(false);
  if (failed) {
    return (
      <div className={`grid place-items-center bg-surface-2 text-ink-2 t-small ${className}`} style={style}>
        <span className="px-4 text-center">Imagem indisponível{alt ? `: ${alt}` : ''}</span>
      </div>
    );
  }
  return (
    <img
      src={img(name, 'lg')}
      srcSet={srcSet(name)}
      sizes={sizes}
      alt={alt}
      loading={priority ? 'eager' : 'lazy'}
      decoding={priority ? 'sync' : 'async'}
      fetchPriority={priority ? 'high' : 'auto'}
      onError={() => setFailed(true)}
      className={className}
      style={style}
      {...rest}
    />
  );
}
