import { Corners } from '@/components/Corners';
import { ImageSlot } from '@/components/ImageSlot';
import { JsonLd } from '@/components/JsonLd';
import { TransitionLink } from '@/components/Transition';
import { seo } from '@/content/seo';
import { routes } from '@/content/site';
import { breadcrumbJsonLd, pageMetadata, webPageJsonLd } from '@/lib/seo';

export const metadata = pageMetadata(seo.about);

const COMPETENCIES = [
  'Проектирование антенно-фидерных устройств любого диапазона.',
  'Металлообработка с высокой точностью.',
  'Контрактная сборка электроники по документации заказчика.',
  'Разработка полного пакета конструкторской и технологической документации согласно действующим национальным стандартам Российской федерации.',
];

const SYSTEM = [
  {
    n: '1',
    t: 'Инжиниринг',
    p: 'Не просто берем ваш чертеж — мы можем его улучшить, сделав конструкцию технологичнее и дешевле в производстве.',
  },
  {
    n: '2',
    t: 'Производство',
    p: 'Собственный цех позволяет нам оперативно вносить правки и не зависеть от поставщиков-посредников.',
  },
  {
    n: '3',
    t: 'Ответственность',
    p: 'Несем полную ответственность за финальную сборку изделия, будь то антенная решетка или шкаф управления. Каждый узел проходит отдел технического контроля.',
  },
];

export default function AboutPage() {
  return (
    <main data-screen-label="О компании">
      <JsonLd
        data={[
          webPageJsonLd('AboutPage', seo.about),
          breadcrumbJsonLd([
            { name: seo.home.crumb, path: seo.home.path },
            { name: seo.about.crumb, path: seo.about.path },
          ]),
        ]}
      />
      <section className="hero-root">
        <div className="hero-anim wrap hero-body">
          <span className="kicker kicker--300 mb24">О компании</span>
          <h1 className="h1-page">ООО НПП «Технолидер»</h1>
          <p className="hero-sub">
            Научно-производственное предприятие полного цикла в сфере радиоэлектроники и
            механо-сборочных работ.
          </p>
        </div>
      </section>
      <div className="duotone photo-cell photo-wide">
        <ImageSlot id="v2-about-hero" placeholder="Широкое фото: производственный цех" />
      </div>

      <section className="wrap sec-about-intro">
        <h2 className="h2-sm">
          Объединяем инженерную мысль и современное промышленное оборудование
        </h2>
        <div>
          <p className="p-body">
            Наша специализация — создание сложных технических систем «под ключ»: от разработки
            конструкторской документации до серийного выпуска антенных систем и электронных
            модулей.
          </p>
          <p className="p-muted">
            Предприятие оснащено собственным парком металлообрабатывающих станков, монтажными
            участками, испытательным и контрольным оборудованием, что позволяет жестко
            контролировать качество на всех этапах — от заготовки до финишного тестирования
            готового изделия.
          </p>
          <p className="p-muted mb0">
            Работаем с оборонными, телекоммуникационными и промышленными предприятиями, решая
            задачи, где важна не просто деталь, а гарантированный результат в заданные сроки.
          </p>
        </div>
      </section>

      <section className="wrap sec-comp">
        <span className="kicker kicker--700 mb40">Ключевые компетенции</span>
        <div className="comp-grid">
          {COMPETENCIES.map((c, i) => (
            <div className="comp" key={i}>
              <span className="comp-n">{String(i + 1).padStart(2, '0')}</span>
              <p className="comp-p">{c}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="sec-system">
        <div className="wrap system-grid">
          <div>
            <span className="kicker kicker--700 mb20">Наша система</span>
            <h2 className="h2-lg h2-fit mb24">В&nbsp;производстве нет места компромиссам</h2>
            <p className="p-muted mb0">
              Понимаем, что в производстве нет места компромиссам. Поэтому выстроили систему.
            </p>
          </div>
          <ol className="num-list">
            {SYSTEM.map((s) => (
              <li className="sys-item" key={s.n}>
                <span className="sys-n">{s.n}</span>
                <div>
                  <h3 className="sys-t">{s.t}</h3>
                  <p className="p-muted mb0">{s.p}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="wrap sec-prod">
        <span className="kicker kicker--700 mb24">Производство</span>
        <div className="photo-grid">
          <div className="duotone photo-cell photo-43">
            <ImageSlot id="v2-about-1" placeholder="Фото: станочный парк" />
          </div>
          <div className="duotone photo-cell photo-43">
            <ImageSlot id="v2-about-2" placeholder="Фото: монтажный участок" />
          </div>
          <div className="duotone photo-cell photo-43">
            <ImageSlot id="v2-about-3" placeholder="Фото: испытательное оборудование" />
          </div>
        </div>
        <div className="about-close">
          <p className="about-quote">
            Наше предприятие создано для решения нестандартных задач. Если ваше изделие требует
            высокой точности и надежности — готовы стать вашим технологическим партнером.
          </p>
          <div className="about-close-actions">
            <TransitionLink href={routes.contacts} className="btn btn-primary blueprint btn-cta2">
              Связаться с нами
              <Corners />
            </TransitionLink>
          </div>
        </div>
      </section>
    </main>
  );
}
