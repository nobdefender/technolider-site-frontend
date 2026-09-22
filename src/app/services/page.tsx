import { JsonLd } from '@/components/JsonLd';
import { TransitionLink } from '@/components/Transition';
import { seo } from '@/content/seo';
import { routes } from '@/content/site';
import { breadcrumbJsonLd, pageMetadata, webPageJsonLd } from '@/lib/seo';
import hero from '@/styles/hero.module.css';
import shared from '@/styles/shared.module.css';
import styles from './page.module.css';

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
      <section className={hero.heroRoot} data-hero>
        <div className={`${hero.heroAnim} wrap ${hero.heroBody}`}>
          <span className="kicker kicker--300 mb24">Услуги</span>
          <h1 className={`${hero.h1Page} ${hero.h1Lines}`}>
            <span>Четыре направления.</span>
            <span>Один ответственный.</span>
          </h1>
          <p className={hero.heroSub}>
            Наша специализация — создание сложных технических систем «под ключ»: от разработки
            конструкторской документации до серийного выпуска антенных систем и электронных
            модулей.
          </p>
        </div>
      </section>
      <section className={`wrap ${shared.secRows}`}>
        {ROWS.map((r) => (
          <TransitionLink href={r.href} className={styles.rowLink} key={r.n}>
            <span className={styles.rowN}>{r.n}</span>
            <div>
              <h2 className={styles.rowTitle}>{r.title}</h2>
              <span className={styles.rowSub}>{r.sub}</span>
            </div>
            <p className={styles.rowP}>{r.p}</p>
            <span className={styles.rowArrow}>
              <span className={styles.arrow}>→</span>
            </span>
          </TransitionLink>
        ))}
      </section>
    </main>
  );
}
