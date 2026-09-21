import type { DetailedHTMLProps, HTMLAttributes } from 'react';

type Tile3DKind =
  | 'antenna'
  | 'flange'
  | 'pcb'
  | 'drawing'
  | 'array'
  | 'housing'
  | 'mast'
  | 'dims'
  | 'pcbasm'
  | 'docs';

declare module 'react' {
  namespace JSX {
    interface IntrinsicElements {
      'tile-3d': DetailedHTMLProps<HTMLAttributes<HTMLElement>, HTMLElement> & {
        kind: Tile3DKind;
        mode?: 'tile' | 'hero' | 'explode';
        'data-role'?: 'hero' | 'page';
      };
    }
  }
}
