import type { CSSProperties } from 'react';
import { imageAlts, imagePositions, images, type ImageSlotId } from '@/content/images';
import styles from './ImageSlot.module.css';

type Props = {
  id: ImageSlotId;
  placeholder: string;
  className?: string;
  style?: CSSProperties;
};

/**
 * Слот изображения из макета (<image-slot>). Пока файл не задан в content/images.ts,
 * показывается плейсхолдер с подписью — как в дизайне.
 */
export function ImageSlot({ id, placeholder, className, style }: Props) {
  const src = images[id];
  const position = imagePositions[id];
  return (
    <div
      className={[styles.imageSlot, className].filter(Boolean).join(' ')}
      data-slot={id}
      data-filled={src ? '' : undefined}
      style={style}
    >
      <div className={styles.imageSlotFrame}>
        {src ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={src}
            alt={imageAlts[id] || ''}
            loading="lazy"
            decoding="async"
            draggable={false}
            style={position ? { objectPosition: position } : undefined}
          />
        ) : (
          <div className={styles.imageSlotEmpty} aria-hidden="true">
            <svg
              width="28"
              height="28"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect x="3" y="3" width="18" height="18" rx="2" />
              <circle cx="8.5" cy="8.5" r="1.5" />
              <path d="m21 15-5-5L5 21" />
            </svg>
            <div className={styles.cap}>{placeholder}</div>
          </div>
        )}
      </div>
      <span className={styles.imageSlotRing} />
    </div>
  );
}
