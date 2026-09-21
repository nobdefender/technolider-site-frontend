import type { Metadata } from 'next';
import { Corners } from '@/components/Corners';
import { TransitionLink } from '@/components/Transition';
import { routes, site } from '@/content/site';

// noindex для 404 Next.js добавляет сам
export const metadata: Metadata = {
  title: 'Страница не найдена',
};

export default function NotFound() {
  return (
    <main data-screen-label="404">
      <section className="hero-root">
        <div className="hero-anim wrap hero-body">
          <span className="kicker kicker--300 mb24">Ошибка 404</span>
          <h1 className="h1-page">Такого листа в комплекте нет</h1>
          <p className="hero-sub">
            Страница удалена или адрес введён с ошибкой. Перейдите на главную или посмотрите, чем мы
            можем быть полезны.
          </p>
          <div className="actions" style={{ marginTop: 40 }}>
            <TransitionLink href={routes.home} className="btn btn-primary blueprint btn-cta2">
              На главную
              <Corners />
            </TransitionLink>
            <TransitionLink href={routes.services} className="btn btn-ghost-dark">
              Услуги
            </TransitionLink>
          </div>
        </div>
      </section>
      <section className="wrap sec-rows">
        <div className="sheet-head">
          <span className="tech tech-700">Связаться</span>
          <span className="tech">{site.hours}</span>
        </div>
        <p className="p-muted mb0">
          Телефон{' '}
          <a href={site.phoneHref} className="w500">
            {site.phone}
          </a>
          , почта <a href={`mailto:${site.email}`}>{site.email}</a>.
        </p>
      </section>
    </main>
  );
}
