import { Corners } from '@/components/Corners';
import { CopyButton } from '@/components/CopyButton';
import { JsonLd } from '@/components/JsonLd';
import { LeadForm } from '@/components/LeadForm';
import { seo } from '@/content/seo';
import { mapLink, requisitesText, site } from '@/content/site';
import { breadcrumbJsonLd, pageMetadata, webPageJsonLd } from '@/lib/seo';
import hero from '@/styles/hero.module.css';
import styles from './page.module.css';

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
      <section className={hero.heroRoot} data-hero>
        <div className={`${hero.heroAnim} wrap ${styles.contactsHero}`}>
          <div>
            <span className="kicker kicker--300 mb24">Контакты</span>
            <h1 className={`${hero.h1Page} ${hero.w24}`}>Готовы обсудить ваш проект?</h1>
            <p className={`${hero.heroSub} ${hero.w46}`}>
              Неважно, нужна вам одна сложная деталь или крупная партия антенн — мы найдем
              решение.
            </p>
          </div>
          <div className={styles.cList}>
            <div className={styles.cRow}>
              <span className={styles.cLabel}>Телефон</span>
              <a href={site.phoneHref} className={styles.cPhone}>
                {site.phone}
              </a>
            </div>
            <div className={styles.cRow}>
              <span className={styles.cLabel}>Email</span>
              <a href={`mailto:${site.email}`} className={styles.cMail}>
                {site.email}
              </a>
            </div>
            <div className={styles.cRow}>
              <span className={styles.cLabel}>Адрес</span>
              <CopyButton text={site.address} title="Скопировать адрес">
                {site.address}
              </CopyButton>
            </div>
            <div className={styles.cRow}>
              <span className={styles.cLabel}>Режим</span>
              <span className={styles.cVal}>{site.hours}</span>
            </div>
          </div>
        </div>
      </section>

      <div className={styles.mapWrap} data-map>
        {/* Сама карта живёт в layout (components/MapHost.tsx) и накладывается на этот блок */}
        <div className={styles.mapShade} />
        <div className={`blueprint ${styles.mapCard}`}>
          <Corners />
          <span className={styles.mapK}>Производство</span>
          <span className={styles.mapCity}>г. Тула</span>
          <span className={styles.mapAddr}>{site.map.address}</span>
          <a href={mapLink} target="_blank" rel="noopener noreferrer" className={styles.mapLink}>
            Открыть в Яндекс Картах <span className={styles.arrow}>→</span>
          </a>
        </div>
      </div>

      <section className={`wrap ${styles.secForm}`}>
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

      <section className={`wrap ${styles.secReq}`}>
        <div className={styles.reqHead}>
          <span className="kicker-inline">Реквизиты</span>
          <CopyButton text={requisitesText} title="Скопировать реквизиты" className="tech" variant="accent">
            Скопировать реквизиты
          </CopyButton>
        </div>
        <div className={styles.reqGrid}>
          <div className={styles.req}>
            <span className={styles.reqK}>Полное наименование</span>
            <span className={styles.reqV}>{site.legalFull}</span>
          </div>
          <div className={styles.req}>
            <span className={styles.reqK}>ИНН / КПП</span>
            <span className={`${styles.reqV} tnum`}>
              {site.inn} / {site.kpp}
            </span>
          </div>
          <div className={styles.req}>
            <span className={styles.reqK}>ОГРН</span>
            <span className={`${styles.reqV} tnum`}>{site.ogrn}</span>
          </div>
          <div className={styles.req}>
            <span className={styles.reqK}>Юридический адрес</span>
            <span className={styles.reqV}>{site.address}</span>
          </div>
        </div>
      </section>
    </main>
  );
}
