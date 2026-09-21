import { JsonLd } from '@/components/JsonLd';
import { TransitionLink } from '@/components/Transition';
import { seo } from '@/content/seo';
import { routes } from '@/content/site';
import { breadcrumbJsonLd, pageMetadata, webPageJsonLd } from '@/lib/seo';

export const metadata = pageMetadata(seo.services);

const ROWS = [
  {
    href: routes.antennas,
    n: '01',
    title: 'Разработка и производство антенн',
    sub: 'От прототипа до серии',
    p: 'Проектируем и производим антенно-фидерные устройства для различных частотных диапазонов. Используем современное оборудование для настройки и тестирования параметров.',
  },
  {
    href: routes.metal,
    n: '02',
    title: 'Металлообработка любой сложности',
    sub: 'Точность и надежность',
    p: 'Оснастка, корпуса, кронштейны, фланцы и переходники — работаем с черными, нержавеющими и цветными металлами. Выполняем заказы любой сложности, от единичных прототипов до крупных партий.',
  },
  {
    href: routes.assembly,
    n: '03',
    title: 'Контрактное производство. Сборка электронных изделий',
    sub: 'Сборка «под ключ» по вашей документации',
    p: 'Оказываем услуги промышленного аутсорсинга. Вы предоставляете спецификацию и чертежи (сборочные схемы), мы берем на себя закупку компонентов, входной контроль, монтаж и испытания.',
  },
  {
    href: routes.docs,
    n: '04',
    title: 'Разработка документации (КД, ТД)',
    sub: 'Превратим идею в рабочие чертежи',
    p: 'Если у вас есть только концепция или опытный образец, мы поможем оформить её в соответствии с действующими национальными стандартами Российской федерации.',
  },
];

export default function ServicesPage() {
  return (
    <main data-screen-label="Услуги">
      <JsonLd
        data={[
          webPageJsonLd('CollectionPage', seo.services),
          breadcrumbJsonLd([
            { name: seo.home.crumb, path: seo.home.path },
            { name: seo.services.crumb, path: seo.services.path },
          ]),
        ]}
      />
      <section className="hero-root">
        <div className="hero-anim wrap hero-body">
          <span className="kicker kicker--300 mb24">Услуги</span>
          <h1 className="h1-page h1-lines">
            <span>Четыре направления.</span>
            <span>Один ответственный.</span>
          </h1>
          <p className="hero-sub">
            Наша специализация — создание сложных технических систем «под ключ»: от разработки
            конструкторской документации до серийного выпуска антенных систем и электронных
            модулей.
          </p>
        </div>
      </section>
      <section className="wrap sec-rows">
        {ROWS.map((r) => (
          <TransitionLink href={r.href} className="row-link" key={r.n}>
            <span className="row-n">{r.n}</span>
            <div>
              <h2 className="row-title">{r.title}</h2>
              <span className="row-sub">{r.sub}</span>
            </div>
            <p className="row-p">{r.p}</p>
            <span className="row-arrow">
              <span className="tile-arrow">→</span>
            </span>
          </TransitionLink>
        ))}
      </section>
    </main>
  );
}
