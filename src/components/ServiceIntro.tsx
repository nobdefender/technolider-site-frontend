import type { ReactNode } from 'react';
import { routes } from '@/content/site';
import { Corners } from './Corners';
import { ImageSlot } from './ImageSlot';
import type { ImageSlotId } from '@/content/images';
import { TransitionLink } from './Transition';

type HeroProps = {
  kind: 'antenna' | 'flange' | 'pcb' | 'drawing';
  index: string;
  title: string;
  tag: string;
};

/** Первый экран страницы услуги: 3D-объект справа, заголовок и подпись. */
export function ServiceHero({ kind, index, title, tag }: HeroProps) {
  return (
    <section className="hero-root hero-service">
      <tile-3d kind={kind} mode="hero" data-role="page" className="page-3d" />
      <div className="hero-anim wrap hero-body">
        <span className="kicker kicker--300 mb24">
          <TransitionLink href={routes.services} className="kicker-link">
            Услуги
          </TransitionLink>
          {' · '}
          {index}
        </span>
        <h1 className="h1-page">{title}</h1>
        <p className="hero-tag">{tag}</p>
      </div>
    </section>
  );
}

/** Широкое фото под первым экраном. */
export function WidePhoto({ id, placeholder }: { id: ImageSlotId; placeholder: string }) {
  return (
    <div className="duotone photo-cell photo-wide">
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
    <section className="wrap sec-intro">
      <div>
        <p className="intro-lead">{lead}</p>
        <div className="actions">
          <TransitionLink href={routes.contacts} className="btn btn-primary blueprint btn-cta2">
            Обсудить проект
            <Corners />
          </TransitionLink>
        </div>
      </div>
      <div>
        <span className="kicker kicker--700 mb8">{listTitle}</span>
        <ol className="num-list">
          {items.map((it) => (
            <li className="num-item" key={it.n}>
              <span className="num-n">{it.n}</span>
              <span>{it.text}</span>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
