import { Corners } from '@/components/Corners';
import { CopyButton } from '@/components/CopyButton';
import { JsonLd } from '@/components/JsonLd';
import { LeadForm } from '@/components/LeadForm';
import { seo } from '@/content/seo';
import { mapLink, requisitesText, site } from '@/content/site';
import { breadcrumbJsonLd, pageMetadata, webPageJsonLd } from '@/lib/seo';

export const metadata = pageMetadata(seo.contacts);

export default function ContactsPage() {
  return (
    <main data-screen-label="Контакты">
      <JsonLd
        data={[
          webPageJsonLd('ContactPage', seo.contacts),
          breadcrumbJsonLd([
            { name: seo.home.crumb, path: seo.home.path },
            { name: seo.contacts.crumb, path: seo.contacts.path },
          ]),
        ]}
      />
      <section className="hero-root">
        <div className="hero-anim wrap contacts-hero">
          <div>
            <span className="kicker kicker--300 mb24">Контакты</span>
            <h1 className="h1-page w24">Готовы обсудить ваш проект?</h1>
            <p className="hero-sub w46">
              Неважно, нужна вам одна сложная деталь или крупная партия антенн — мы найдем
              решение.
            </p>
          </div>
          <div className="c-list">
            <div className="c-row">
              <span className="c-label">Телефон</span>
              <a href={site.phoneHref} className="c-phone">
                {site.phone}
              </a>
            </div>
            <div className="c-row">
              <span className="c-label">Email</span>
              <a href={`mailto:${site.email}`} className="c-mail">
                {site.email}
              </a>
            </div>
            <div className="c-row">
              <span className="c-label">Адрес</span>
              <CopyButton text={site.address} title="Скопировать адрес">
                {site.address}
              </CopyButton>
            </div>
            <div className="c-row">
              <span className="c-label">Режим</span>
              <span className="c-val">{site.hours}</span>
            </div>
          </div>
        </div>
      </section>

      <div className="map-wrap">
        {/* Сам iframe карты живёт в layout (components/MapHost.tsx) и накладывается на этот блок */}
        <div className="map-shade" />
        <div className="blueprint map-card">
          <Corners />
          <span className="map-k">Производство</span>
          <span className="map-city">г. Тула</span>
          <span className="map-addr">{site.map.address}</span>
          <a href={mapLink} target="_blank" rel="noopener noreferrer" className="map-link">
            Открыть в Яндекс Картах <span className="tile-arrow">→</span>
          </a>
        </div>
      </div>

      <section className="wrap sec-form">
        <div>
          <span className="kicker kicker--700 mb20">Оставить заявку</span>
          <h2 className="h2-sm mb20">Опишите задачу — ответим в рабочий день</h2>
          <p className="p-muted mb0">
            Пришлите ТЗ, эскиз или описание изделия. Мы определим возможность изготовления и
            стоимость.
          </p>
        </div>
        <LeadForm />
      </section>

      <section className="wrap sec-req">
        <div className="req-head">
          <span className="kicker-inline">Реквизиты</span>
          <CopyButton text={requisitesText} title="Скопировать реквизиты" className="tech copy-700">
            Скопировать реквизиты
          </CopyButton>
        </div>
        <div className="req-grid">
          <div className="req">
            <span className="req-k">Полное наименование</span>
            <span className="req-v">{site.legalFull}</span>
          </div>
          <div className="req">
            <span className="req-k">ИНН / КПП</span>
            <span className="req-v tnum">
              {site.inn} / {site.kpp}
            </span>
          </div>
          <div className="req">
            <span className="req-k">ОГРН</span>
            <span className="req-v tnum">{site.ogrn}</span>
          </div>
          <div className="req">
            <span className="req-k">Юридический адрес</span>
            <span className="req-v">{site.address}</span>
          </div>
        </div>
      </section>
    </main>
  );
}
