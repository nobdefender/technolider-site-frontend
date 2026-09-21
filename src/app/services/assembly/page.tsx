import { ExplodeSection } from '@/components/ExplodeSection';
import { JsonLd } from '@/components/JsonLd';
import { NextService } from '@/components/NextService';
import { ServiceHero, ServiceIntro, WidePhoto } from '@/components/ServiceIntro';
import { seo } from '@/content/seo';
import { routes } from '@/content/site';
import { breadcrumbJsonLd, pageMetadata, serviceJsonLd } from '@/lib/seo';

export const metadata = pageMetadata(seo.assembly);

export default function AssemblyPage() {
  return (
    <main data-screen-label="Контрактная сборка">
      <JsonLd
        data={[
          serviceJsonLd('assembly'),
          breadcrumbJsonLd([
            { name: seo.home.crumb, path: seo.home.path },
            { name: seo.services.crumb, path: seo.services.path },
            { name: seo.assembly.crumb, path: seo.assembly.path },
          ]),
        ]}
      />
      <ServiceHero
        kind="pcb"
        index="03"
        title="Контрактное производство. Сборка электронных изделий"
        tag="Сборка «под ключ» по вашей документации"
      />
      <WidePhoto
        id="v2-assembly-hero"
        placeholder="Широкое фото: монтаж печатных плат / шкаф управления"
      />
      <ServiceIntro
        lead="Оказываем услуги промышленного аутсорсинга. Вы предоставляете спецификацию и чертежи (сборочные схемы), мы берем на себя закупку компонентов, входной контроль, монтаж и испытания."
        listTitle="Производим сборку изделий любой сложности"
        items={[
          { n: '01', text: 'Монтаж печатных плат (поверхностный и выводной)' },
          { n: '02', text: 'Сборка шкафов, стоек и пультов управления' },
          { n: '03', text: 'Монтаж жгутов и кабелей' },
          { n: '04', text: 'Полный цикл электрического контроля и тестирования готовых блоков' },
        ]}
      />
      <ExplodeSection
        kind="pcbasm"
        height="340vh"
        canvasHead="Монтаж · печатный узел"
        head="Сборочный чертёж"
        headRight="5 позиций"
        title="Печатный узел в сборке"
        lead="Компоненты устанавливаются на плату в порядке технологического маршрута — от поверхностного монтажа до экранов и разъёмов, с контролем после каждой операции."
        steps={[
          { n: '01', t: 'Печатная плата', tech: 'Входной контроль' },
          { n: '02', t: 'Микросхема BGA', tech: 'Поверхностный монтаж' },
          { n: '03', t: 'Пассивные компоненты', tech: 'Пайка оплавлением' },
          { n: '04', t: 'Разъёмы и конденсаторы', tech: 'Выводной монтаж' },
          { n: '05', t: 'Экран ЭМС', tech: 'Финальная сборка · тест' },
        ]}
      />
      <NextService num="04" of="04 из 04" href={routes.docs} title="Разработка документации (КД, ТД)" />
    </main>
  );
}
