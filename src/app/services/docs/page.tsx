import { ExplodeSection } from '@/components/ExplodeSection';
import { JsonLd } from '@/components/JsonLd';
import { NextService } from '@/components/NextService';
import { ServiceHero, ServiceIntro, WidePhoto } from '@/components/ServiceIntro';
import { seo } from '@/content/seo';
import { routes } from '@/content/site';
import { breadcrumbJsonLd, pageMetadata, serviceJsonLd } from '@/lib/seo';

export const metadata = pageMetadata(seo.docs);

export default function DocsPage() {
  return (
    <main data-screen-label="Документация КД/ТД">
      <JsonLd
        data={[
          serviceJsonLd('docs'),
          breadcrumbJsonLd([
            { name: seo.home.crumb, path: seo.home.path },
            { name: seo.services.crumb, path: seo.services.path },
            { name: seo.docs.crumb, path: seo.docs.path },
          ]),
        ]}
      />
      <ServiceHero
        kind="drawing"
        index="04"
        title="Разработка документации (КД, ТД)"
        tag="Превратим идею в рабочие чертежи"
      />
      <WidePhoto id="v2-docs-hero" placeholder="Широкое фото: чертёж / 3D-модель сборки" />
      <ServiceIntro
        lead="Если у вас есть только концепция или опытный образец, мы поможем оформить её в соответствии с действующими национальными стандартами Российской федерации."
        listTitle="Разрабатываем"
        items={[
          {
            n: 'КД',
            text: (
              <>
                <strong className="w500">
                  Конструкторскую документацию (КД) в соответствии с ГОСТ Р 2.102:
                </strong>{' '}
                электронные модели и чертежи деталей и сборочных единиц; электромонтажные чертежи
                и схемы; ведомости; технические условия; программы и методики испытаний;
                эксплуатационную документацию
              </>
            ),
          },
          {
            n: 'ТД',
            text: (
              <>
                <strong className="w500">
                  Технологическую документацию (ТД) в соответствии с ГОСТ Р 3.102:
                </strong>{' '}
                карты технологических процессов, маршрутные карты и т.д
              </>
            ),
          },
        ]}
      />
      <ExplodeSection
        kind="docs"
        height="360vh"
        canvasHead="Чертёж · корпусная деталь"
        head="Комплект КД"
        headRight="Формат А3"
        title="От модели к чертежу"
        lead="Электронная модель становится комплектом документов: виды и разрезы по ГОСТ 2.305, штриховка по 2.306, размеры и допуски по 2.307, основная надпись и спецификация по 2.104 и 2.106."
        steps={[
          { n: '01', t: 'Электронная модель', tech: 'Исходные данные' },
          { n: '02', t: 'Вид сверху', tech: 'Проекция на лист' },
          { n: '03', t: 'Главный вид и вид слева', tech: 'ГОСТ 2.305' },
          { n: '04', t: 'Разрез А–А', tech: 'Штриховка · ГОСТ 2.306' },
          { n: '05', t: 'Размеры, допуски, шероховатость', tech: 'ГОСТ 2.307 · 2.309' },
          { n: '06', t: 'Основная надпись и спецификация', tech: 'ГОСТ 2.104 · 2.106' },
        ]}
      />
      <NextService num="01" of="01 из 04" href={routes.antennas} title="Разработка и производство антенн" />
    </main>
  );
}
