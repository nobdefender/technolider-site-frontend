import { ExplodeSection } from '@/components/ExplodeSection';
import { JsonLd } from '@/components/JsonLd';
import { NextService } from '@/components/NextService';
import { ServiceHero, ServiceIntro, WidePhoto } from '@/components/ServiceIntro';
import { seo } from '@/content/seo';
import { routes } from '@/content/site';
import { breadcrumbJsonLd, pageMetadata, serviceJsonLd } from '@/lib/seo';

export const metadata = pageMetadata(seo.antennas);

export default function AntennasPage() {
  return (
    <main data-screen-label="Антенны">
      <JsonLd
        data={[
          serviceJsonLd('antennas'),
          breadcrumbJsonLd([
            { name: seo.home.crumb, path: seo.home.path },
            { name: seo.services.crumb, path: seo.services.path },
            { name: seo.antennas.crumb, path: seo.antennas.path },
          ]),
        ]}
      />
      <ServiceHero
        kind="antenna"
        index="01"
        title="Разработка и производство антенн"
        tag="От прототипа до серии"
      />
      <WidePhoto id="v2-antennas-hero" placeholder="Широкое фото: антенная решётка в цехе" />
      <ServiceIntro
        lead="Проектируем и производим антенно-фидерные устройства для различных частотных диапазонов. Используем современное оборудование для настройки и тестирования параметров."
        listTitle="Делаем"
        items={[
          { n: '01', text: 'Разработка эскизных и технических проектов антенн' },
          { n: '02', text: 'Изготовление вибраторов, рефлекторов и антенных решеток' },
          { n: '03', text: 'Настройка коэффициента стоячей волны и диаграммы направленности' },
          { n: '04', text: 'Производство антенн для навигации и специальной техники' },
        ]}
      />
      <ExplodeSection
        kind="mast"
        height="360vh"
        canvasHead="Разнесённый вид · антенно-мачтовый узел"
        head="Состав изделия"
        headRight="Порядок разборки"
        title="Антенна в разборе"
        lead="Каждый элемент изготавливается и настраивается у нас: от мачтовой опоры до вибратора."
        steps={[
          { n: '01', t: 'Изделие в сборе', tech: 'Настройка КСВ' },
          { n: '02', t: 'Рефлектор и вибратор', tech: 'Настройка ДН' },
          { n: '03', t: 'Директоры', tech: 'Настройка ДН' },
          { n: '04', t: 'Узел крепления с траверсой', tech: 'Снятие с мачты' },
          { n: '05', t: 'Хомут раскрывается', tech: 'Траверса свободна' },
        ]}
      />
      <NextService num="02" of="02 из 04" href={routes.metal} title="Металлообработка любой сложности" />
    </main>
  );
}
