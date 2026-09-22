import type { ReactNode } from 'react';
import { routes } from '@/content/site';
import { Corners } from './Corners';
import { ImageSlot } from './ImageSlot';
import type { ImageSlotId } from '@/content/images';
import { TransitionLink } from './Transition';
import hero from '@/styles/hero.module.css';
import shared from '@/styles/shared.module.css';
import styles from './ServiceIntro.module.css';

type HeroProps = {
  kind: 'antenna' | 'flange' | 'pcb' | 'drawing';
  index: string;
  title: string;
  tag: string;
};

/** Первый экран страницы услуги: 3D-объект справа, заголовок и подпись. */
export function ServiceHero({ kind, index, title, tag }: HeroProps) {
  return (
    <section className={`${hero.heroRoot} ${hero.heroService}`} data-hero>
      <tile-3d kind={kind} mode="hero" data-role="page" className={hero.page3d} />
      <div className={`${hero.heroAnim} wrap ${hero.heroBody}`}>
        <span className="kicker kicker--300 mb24">
          <TransitionLink href={routes.services} className="kicker-link">
            Услуги
          </TransitionLink>
          {' · '}
          {index}
        </span>
        <h1 className={hero.h1Page}>{title}</h1>
        <p className={hero.heroTag}>{tag}</p>
      </div>
    </section>
  );
}

/** Широкое фото под первым экраном. */
export function WidePhoto({ id, placeholder }: { id: ImageSlotId; placeholder: string }) {
  return (
    <div className={`duotone ${shared.photoCell} ${shared.photoWide}`} data-photo>
      <ImageSlot id={id} placeholder={placeholder} />
    </div>
  );
}

type IntroProps = {
  lead: string;
  listTitle: string;
  items: { n: string; text: ReactNode }[];
};

/** Описание услуги + нумерованный список возможностей. */
export function ServiceIntro({ lead, listTitle, items }: IntroProps) {
  return (
    <section className={`wrap ${styles.secIntro}`}>
      <div>
        <p className={styles.introLead}>{lead}</p>
        <div className={shared.actions}>
          <TransitionLink href={routes.contacts} className="btn btn-primary blueprint btn-cta2">
            Обсудить проект
            <Corners />
          </TransitionLink>
        </div>
      </div>
      <div>
        <span className="kicker kicker--700 mb8">{listTitle}</span>
        <ol className={shared.numList}>
          {items.map((it) => (
            <li className={styles.numItem} key={it.n}>
              <span className={styles.numN}>{it.n}</span>
              <span>{it.text}</span>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
