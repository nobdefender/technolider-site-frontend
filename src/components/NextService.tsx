import { routes, site } from '@/content/site';
import { Corners } from './Corners';
import { TransitionLink } from './Transition';

type Props = {
  num: string;
  of: string;
  href: string;
  title: string;
};

/** Блок «Следующая услуга» в конце страницы услуги. */
export function NextService({ num, of, href, title }: Props) {
  return (
    <section data-dark className="next-sec">
      <div className="wrap">
        <div className="sheet-head mb0">
          <span className="tech tech-300">Следующая услуга</span>
          <span className="tech">{of}</span>
        </div>
        <TransitionLink href={href} className="next-link">
          <span className="next-num">{num}</span>
          <h2 className="next-title">{title}</h2>
          <span className="next-arrow">→</span>
        </TransitionLink>
        <div className="next-foot">
          <span className="next-note">
            Пришлите чертёж, спецификацию или образец — оценим сроки и стоимость.
          </span>
          <div className="next-actions">
            <a href={site.phoneHref} className="next-phone">
              {site.phone}
            </a>
            <TransitionLink href={routes.contacts} className="btn btn-primary blueprint btn-cta2">
              Обсудить проект
              <Corners />
            </TransitionLink>
          </div>
        </div>
      </div>
    </section>
  );
}
