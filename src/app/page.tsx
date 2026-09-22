import { Corners } from '@/components/Corners';
import { HowWeWork } from '@/components/HowWeWork';
import { ExplodeSection } from '@/components/ExplodeSection';
import { ImageSlot } from '@/components/ImageSlot';
import { TransitionLink } from '@/components/Transition';
import { routes, site } from '@/content/site';
import { JsonLd } from '@/components/JsonLd';
import { seo } from '@/content/seo';
import { breadcrumbJsonLd, howToJsonLd, pageMetadata } from '@/lib/seo';
import hero from '@/styles/hero.module.css';
import shared from '@/styles/shared.module.css';
import styles from './page.module.css';

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
    <span className={styles.marqueeRow}>
      {MARQUEE.map((w) => (
        <span key={w} style={{ display: 'contents' }}>
          <span>{w}</span>
          <span className={styles.marqueeDot}>·</span>
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
      <section className={`${hero.heroRoot} ${styles.heroHome}`} data-hero>
        <div className={styles.heroShade} />
        <tile-3d kind="array" mode="hero" data-role="hero" className={styles.hero3d} />
        <div className={`${hero.heroAnim} wrap ${styles.heroHomeBody}`}>
          <span className="kicker kicker--300 mb28">
            ООО НПП «Технолидер» · Радиоэлектроника и механосборка
          </span>
          <h1 className={styles.h1Home}>Инжиниринг. Производство. Сборка.</h1>
          <div className={styles.heroRow}>
            <p className={styles.heroLead}>
              Берем на себя полный цикл: от идеи и чертежа до готовой серийной партии
              металлоконструкций и электроники.
            </p>
            <div className={styles.heroActions}>
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
      <section className={`wrap ${styles.secDirs}`}>
        <div className="sheet-head">
          <span className="tech tech-700">01 · Направления</span>
          <span className="tech">Лист 01 / 05 · Формат А1 · Масштаб 1:1</span>
        </div>
        <div className={styles.secIntroBlock}>
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
        <div className={site.servicesLayout === 'grid' ? `${styles.tiles} ${styles.tiles2x2}` : styles.tiles}>
          {TILES.map((t) => (
            <TransitionLink href={t.href} className={styles.tile} data-tile key={t.n}>
              <div className={styles.tileImg} />
              <div className={styles.tileShade} />
              <tile-3d kind={t.kind} className={styles.tileObj} />
              <span className={styles.tileN}>{t.n}</span>
              <div className={styles.tileBody}>
                <h3 lang="ru" className={styles.tileTitle}>
                  {t.title}
                </h3>
                <span className={styles.tileFoot}>
                  <span>{t.sub}</span>
                  <span className={styles.tileArrow}>→</span>
                </span>
              </div>
            </TransitionLink>
          ))}
        </div>
      </section>

      {/* 02 · Предприятие в цифрах */}
      <section className={`wrap ${styles.secStats}`}>
        <div className="sheet-head">
          <span className="tech tech-700">02 · Предприятие в цифрах</span>
          <span className="tech">Лист 02 / 05 · Показатели предприятия</span>
        </div>
        <div className={styles.stats}>
          <div className={styles.stat}>
            <span className={styles.statN}>24 ч</span>
            <span className={styles.statL}>ответ на заявку</span>
            <span className={styles.statS}>оценка сроков и стоимости по чертежу</span>
          </div>
          <div className={styles.stat}>
            <span className={styles.statN}>от 1</span>
            <span className={styles.statL}>партия, штук</span>
            <span className={styles.statS}>опытные образцы и мелкие серии</span>
          </div>
          <div className={styles.stat}>
            <span className={styles.statN}>ОТК</span>
            <span className={styles.statL}>собственный отдел технического контроля</span>
            <span className={styles.statS}>каждый узел проходит контроль</span>
          </div>
          <div className={styles.stat}>
            <span className={styles.statN} data-count="100" data-suffix="%">
              0%
            </span>
            <span className={styles.statL}>полный цикл</span>
            <span className={styles.statS}>от документации до серийного выпуска</span>
          </div>
        </div>
      </section>

      {/* Бегущая строка */}
      <section className={styles.marquee} data-marquee aria-hidden="true">
        <div className={styles.marqueeTrack}>
          <MarqueeRow />
          <MarqueeRow />
        </div>
      </section>

      {/* 03 · О предприятии */}
      <section className={styles.secAboutHome}>
        <div className={`wrap ${styles.aboutHomeGrid}`}>
          <figure className={`blueprint duotone ${styles.aboutFig}`}>
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
      <section className={`wrap ${styles.secPhotos}`}>
        <div className="sheet-head">
          <span className="tech tech-700">05 · Производство</span>
          <span className="tech">Лист 05 / 05 · Фото: цех, сборочный участок, станок</span>
        </div>
        <div className={shared.photoGrid}>
          <div className={`duotone ${shared.photoCell} ${shared.photo43}`} data-photo>
            <ImageSlot id="v2-shop-1" placeholder="Фото: станочный парк" />
          </div>
          <div className={`duotone ${shared.photoCell} ${shared.photo43}`} data-photo>
            <ImageSlot id="v2-shop-2" placeholder="Фото: монтажный участок" />
          </div>
          <div className={`duotone ${shared.photoCell} ${shared.photo43}`} data-photo>
            <ImageSlot id="v2-shop-3" placeholder="Фото: испытательное оборудование" />
          </div>
        </div>
      </section>

      {/* Связаться с нами */}
      <section className={styles.secCta}>
        <div className={`wrap ${styles.ctaGrid}`}>
          <div>
            <span className="kicker kicker--300 mb20">Связаться с нами</span>
            <h2 className={`h2-lg ${styles.ctaTitle}`}>Готовы обсудить ваш проект?</h2>
            <p className={styles.ctaP}>
              Неважно, нужна вам одна сложная деталь или крупная партия антенн — мы найдем
              решение.
            </p>
          </div>
          <div className={styles.ctaList}>
            <a href={site.phoneHref} className={styles.ctaRow}>
              <span className={styles.ctaLabel}>Телефон</span>
              <span className={`${styles.ctaVal} ${styles.ctaValPhone}`}>{site.phone}</span>
            </a>
            <a href={`mailto:${site.email}`} className={`${styles.ctaRow} ${styles.ctaRowMail}`}>
              <span className={styles.ctaLabel}>Почта</span>
              <span className={`${styles.ctaVal} ${styles.ctaValMail}`}>{site.email}</span>
            </a>
            <TransitionLink
              href={routes.contacts}
              className={`btn btn-primary blueprint btn-cta ${styles.ctaBtn}`}
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
