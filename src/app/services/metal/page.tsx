import { ExplodeSection } from '@/components/ExplodeSection';
import { JsonLd } from '@/components/JsonLd';
import { NextService } from '@/components/NextService';
import { ServiceHero, ServiceIntro, WidePhoto } from '@/components/ServiceIntro';
import { seo } from '@/content/seo';
import { routes } from '@/content/site';
import { breadcrumbJsonLd, pageMetadata, serviceJsonLd } from '@/lib/seo';

export const metadata = pageMetadata(seo.metal);

const DIMS = [
  { side: 'l', b: 'Ø84 H7', s: 'Посадочное место' },
  { side: 'r', b: '172 × 126', s: 'Габарит корпуса' },
  { side: 'l', b: '230 × 170', s: 'Плита основания' },
  { side: 'r', b: '6 × M8', s: 'Крепёж' },
  { side: 'l', b: 'Ra 1,6', s: 'Шероховатость' },
];

export default function MetalPage() {
  return (
    <main data-screen-label="Металлообработка">
      <JsonLd
        data={[
          serviceJsonLd('metal'),
          breadcrumbJsonLd([
            { name: seo.home.crumb, path: seo.home.path },
            { name: seo.services.crumb, path: seo.services.path },
            { name: seo.metal.crumb, path: seo.metal.path },
          ]),
        ]}
      />
      <ServiceHero
        kind="flange"
        index="02"
        title="Металлообработка любой сложности"
        tag="Точность и надежность"
      />
      <WidePhoto id="v2-metal-hero" placeholder="Широкое фото: фрезерный станок в работе" />
      <ServiceIntro
        lead="Оснастка, корпуса, кронштейны, фланцы и переходники — работаем с черными, нержавеющими и цветными металлами. Выполняем заказы любой сложности, от единичных прототипов до крупных партий."
        listTitle="Возможности"
        items={[
          { n: '01', text: 'Токарная и фрезерная, сверлильная обработка' },
          { n: '02', text: 'Резка, гибка, сварка' },
          { n: '03', text: 'Работа с допусками по высокому классу точности' },
          { n: '04', text: 'Финишная обработка (покраска, гальваника)' },
        ]}
      />
      <ExplodeSection
        kind="dims"
        height="340vh"
        canvasHead="Размеры · корпусная деталь"
        head="Контролируемые размеры"
        headRight="Размеры в мм"
        title="Точность по чертежу"
        lead="Посадочные размеры по 7-му квалитету, плоскостность основания 0,02 мм, шероховатость сопрягаемых поверхностей Ra 1,6."
        steps={[
          { n: '01', t: 'Посадочное место Ø84', tech: 'H7 · расточка' },
          { n: '02', t: 'Габарит корпуса 172 × 126', tech: 'Фрезеровка' },
          { n: '03', t: 'Плита основания 230 × 170', tech: 'Плоскостность 0,02' },
          { n: '04', t: 'Крепёж 6 × M8', tech: 'Резьба' },
          { n: '05', t: 'Шероховатость Ra 1,6', tech: 'Сопрягаемые поверхности' },
        ]}
        canvasExtra={DIMS.map((d, i) => (
          <div className="dim" data-dim={i} data-side={d.side} key={i}>
            <i className="dim-dot" />
            <span className="dim-leader" />
            <span className="dim-text">
              <b>{d.b}</b>
              <small>{d.s}</small>
            </span>
          </div>
        ))}
      />
      <NextService
        num="03"
        of="03 из 04"
        href={routes.assembly}
        title="Контрактное производство. Сборка электронных изделий"
      />
    </main>
  );
}
