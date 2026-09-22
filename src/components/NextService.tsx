import { routes, site } from '@/content/site';
import { Corners } from './Corners';
import { TransitionLink } from './Transition';
import styles from './NextService.module.css';

type Props = {
  num: string;
  of: string;
  href: string;
  title: string;
};

/** Блок «Следующая услуга» в конце страницы услуги. */
export function NextService({ num, of, href, title }: Props) {
  return (
    <section data-dark className={styles.nextSec}>
      <div className="wrap">
        <div className="sheet-head mb0">
          <span className="tech tech-300">Следующая услуга</span>
          <span className="tech">{of}</span>
        </div>
        <TransitionLink href={href} className={styles.nextLink}>
          <span className={styles.nextNum}>{num}</span>
          <h2 className={styles.nextTitle}>{title}</h2>
          <span className={styles.nextArrow}>→</span>
        </TransitionLink>
        <div className={styles.nextFoot}>
          <span className={styles.nextNote}>
            Пришлите чертёж, спецификацию или образец — оценим сроки и стоимость.
          </span>
          <div className={styles.nextActions}>
            <a href={site.phoneHref} className={styles.nextPhone}>
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
