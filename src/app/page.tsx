import { Corners } from '@/components/Corners';
import { HowWeWork } from '@/components/HowWeWork';
import { ExplodeSection } from '@/components/ExplodeSection';
import { ImageSlot } from '@/components/ImageSlot';
import { TransitionLink } from '@/components/Transition';
import { routes, site } from '@/content/site';
import { JsonLd } from '@/components/JsonLd';
import { seo } from '@/content/seo';
import { breadcrumbJsonLd, howToJsonLd, pageMetadata } from '@/lib/seo';

export const metadata = pageMetadata(seo.home);

const TILES = [
  {
    href: routes.antennas,
    kind: 'antenna',
    n: '01',
    title: 'Разработка и производство антенн',
    sub: 'От прототипа до серии',
  },
  {
    href: routes.metal,
    kind: 'flange',
    n: '02',
    title: 'Металлообработка любой сложности',
    sub: 'Точность и надежность',
  },
  {
    href: routes.assembly,
    kind: 'pcb',
    n: '03',
    title: 'Контрактное производство электроники',
    sub: 'Сборка «под ключ»',
  },
  {
    href: routes.docs,
    kind: 'drawing',
    n: '04',
    title: 'Разработка документации КД и ТД',
    sub: 'По ГОСТ Р 2.102 / 3.102',
  },
] as const;

const MARQUEE = ['Инжиниринг', 'Производство', 'Сборка', 'Контроль ОТК'];

function MarqueeRow() {
  return (
    <span className="marquee-row">
      {MARQUEE.map((w) => (
        <span key={w} style={{ display: 'contents' }}>
          <span>{w}</span>
          <span className="marquee-dot">·</span>
        </span>
      ))}
    </span>
  );
}

export default function HomePage() {
  return (
    <main data-screen-label="Главная">
      <JsonLd
        data={[breadcrumbJsonLd([{ name: seo.home.crumb, path: seo.home.path }]), howToJsonLd()]}
      />
      {/* Главный экран */}
      <section className="hero-root hero-home">
        <div className="hero-shade" />
        <tile-3d kind="array" mode="hero" data-role="hero" className="hero-3d" />
        <div className="hero-anim wrap hero-home-body">
          <span className="kicker kicker--300 mb28">
            ООО НПП «Технолидер» · Радиоэлектроника и механосборка
          </span>
          <h1 className="h1-home">Инжиниринг. Производство. Сборка.</h1>
          <div className="hero-row">
            <p className="hero-lead">
              Берем на себя полный цикл: от идеи и чертежа до готовой серийной партии
              металлоконструкций и электроники.
            </p>
            <div className="hero-actions">
              <TransitionLink href={routes.contacts} className="btn btn-primary blueprint btn-cta">
                Обсудить проект
                <Corners />
              </TransitionLink>
              <TransitionLink href={routes.services} className="btn btn-ghost-dark">
                Направления
              </TransitionLink>
            </div>
          </div>
        </div>
      </section>

      {/* 01 · Направления */}
      <section className="wrap sec-dirs">
        <div className="sheet-head">
          <span className="tech tech-700">01 · Направления</span>
          <span className="tech">Лист 01 / 05 · Формат А1 · Масштаб 1:1</span>
        </div>
        <div className="sec-intro-block">
          <h2 className="h2-xl">
            Четыре направления.
            <br />
            Один ответственный.
          </h2>
          <p className="lead-lg">
            Наша специализация — создание сложных технических систем «под ключ»: от разработки
            конструкторской документации до серийного выпуска антенных систем и электронных
            модулей.
          </p>
        </div>
        <div className={site.servicesLayout === 'grid' ? 'tiles tiles--2x2' : 'tiles'}>
          {TILES.map((t) => (
            <TransitionLink href={t.href} className="tile" key={t.n}>
              <div className="tile-img" />
              <div className="tile-shade" />
              <tile-3d kind={t.kind} className="tile-obj" />
              <span className="tile-n">{t.n}</span>
              <div className="tile-body">
                <h3 lang="ru" className="tile-title">
                  {t.title}
                </h3>
                <span className="tile-foot">
                  <span>{t.sub}</span>
                  <span className="tile-arrow">→</span>
                </span>
              </div>
            </TransitionLink>
          ))}
        </div>
      </section>

      {/* 02 · Предприятие в цифрах */}
      <section className="wrap sec-stats">
        <div className="sheet-head">
          <span className="tech tech-700">02 · Предприятие в цифрах</span>
          <span className="tech">Лист 02 / 05 · Показатели предприятия</span>
        </div>
        <div className="stats">
          <div className="stat">
            <span className="stat-n">24 ч</span>
            <span className="stat-l">ответ на заявку</span>
            <span className="stat-s">оценка сроков и стоимости по чертежу</span>
          </div>
          <div className="stat">
            <span className="stat-n">от 1</span>
            <span className="stat-l">партия, штук</span>
            <span className="stat-s">опытные образцы и мелкие серии</span>
          </div>
          <div className="stat">
            <span className="stat-n">ОТК</span>
            <span className="stat-l">собственный отдел технического контроля</span>
            <span className="stat-s">каждый узел проходит контроль</span>
          </div>
          <div className="stat">
            <span className="stat-n" data-count="100" data-suffix="%">
              0%
            </span>
            <span className="stat-l">полный цикл</span>
            <span className="stat-s">от документации до серийного выпуска</span>
          </div>
        </div>
      </section>

      {/* Бегущая строка */}
      <section className="marquee" aria-hidden="true">
        <div className="marquee-track">
          <MarqueeRow />
          <MarqueeRow />
        </div>
      </section>

      {/* 03 · О предприятии */}
      <section className="sec-about-home">
        <div className="wrap about-home-grid">
          <figure className="blueprint duotone about-fig">
            <ImageSlot id="v2-about-photo" placeholder="Фото: производственный цех, крупный план" />
            <Corners />
          </figure>
          <div>
            <span className="tech tech-700 mb20" style={{ display: 'block' }}>
              03 · О предприятии · Лист 03 / 05
            </span>
            <h2 className="h2-lg h2-fit-wide">Научно-производственное предприятие полного&nbsp;цикла</h2>
            <p className="p-19">
              ООО НПП «ТЕХНОЛИДЕР» — это научно-производственное предприятие полного цикла в
              сфере радиоэлектроники и механо-сборочных работ.
            </p>
            <p className="p-muted">
              Предприятие оснащено собственным парком металлообрабатывающих станков, монтажными
              участками, испытательным и контрольным оборудованием, что позволяет жестко
              контролировать качество на всех этапах — от заготовки до финишного тестирования
              готового изделия.
            </p>
            <p className="p-muted mb40">
              Работаем с оборонными, телекоммуникационными и промышленными предприятиями, решая
              задачи, где важна не просто деталь, а гарантированный результат в заданные сроки.
            </p>
            <TransitionLink href={routes.about} className="btn btn-secondary btn-outline-dark">
              О компании
            </TransitionLink>
          </div>
        </div>
      </section>

      {/* 04 · Как мы работаем */}
      <HowWeWork />

      {/* Разнесённый вид · корпусная деталь */}
      <ExplodeSection
        kind="housing"
        height="360vh"
        canvasHead="Разнесённый вид · корпусная деталь"
        head="Конструкция"
        headRight="Порядок разборки"
        title="Корпус в разборе"
        lead="Фрезеровка, расточка посадочных мест, сборка узла и контроль на каждой операции."
        steps={[
          { n: '01', t: 'Изделие в сборе', tech: 'Контроль ОТК' },
          { n: '02', t: 'Крепёж', tech: '6 × M8' },
          { n: '03', t: 'Крышка с уплотнением', tech: 'Токарная' },
          { n: '04', t: 'Подшипниковый узел', tech: 'Расточка' },
          { n: '05', t: 'Плита основания', tech: 'Фрезеровка' },
        ]}
      />

      {/* 05 · Производство */}
      <section className="wrap sec-photos">
        <div className="sheet-head">
          <span className="tech tech-700">05 · Производство</span>
          <span className="tech">Лист 05 / 05 · Фото: цех, сборочный участок, станок</span>
        </div>
        <div className="photo-grid">
          <div className="duotone photo-cell photo-43">
            <ImageSlot id="v2-shop-1" placeholder="Фото: станочный парк" />
          </div>
          <div className="duotone photo-cell photo-43">
            <ImageSlot id="v2-shop-2" placeholder="Фото: монтажный участок" />
          </div>
          <div className="duotone photo-cell photo-43">
            <ImageSlot id="v2-shop-3" placeholder="Фото: испытательное оборудование" />
          </div>
        </div>
      </section>

      {/* Связаться с нами */}
      <section className="sec-cta">
        <div className="wrap cta-grid">
          <div>
            <span className="kicker kicker--300 mb20">Связаться с нами</span>
            <h2 className="h2-lg cta-title">Готовы обсудить ваш проект?</h2>
            <p className="cta-p">
              Неважно, нужна вам одна сложная деталь или крупная партия антенн — мы найдем
              решение.
            </p>
          </div>
          <div className="cta-list">
            <a href={site.phoneHref} className="cta-row">
              <span className="cta-label">Телефон</span>
              <span className="cta-val cta-val-phone">{site.phone}</span>
            </a>
            <a href={`mailto:${site.email}`} className="cta-row cta-row-mail">
              <span className="cta-label">Почта</span>
              <span className="cta-val cta-val-mail">{site.email}</span>
            </a>
            <TransitionLink
              href={routes.contacts}
              className="btn btn-primary blueprint btn-cta cta-btn"
            >
              Оставить заявку
              <Corners />
            </TransitionLink>
          </div>
        </div>
      </section>
    </main>
  );
}
