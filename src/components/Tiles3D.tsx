'use client';

import { useEffect } from 'react';

/**
 * Регистрирует кастомный элемент <tile-3d> (three.js) только на клиенте.
 * Сами элементы уже есть в разметке — после регистрации они «оживают».
 */
export function Tiles3D() {
  useEffect(() => {
    import('@/lib/tiles3d');
  }, []);
  return null;
}
