import { requisitesText, routes, site } from '@/content/site';
import { CopyButton } from './CopyButton';
import { TransitionLink } from './Transition';
import styles from './Footer.module.css';

export function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={`wrap ${styles.footerGrid}`}>
        <div>
          <span className={styles.footerBrand}>Технолидер</span>
          <p className={styles.footerDesc}>
            Научно-производственное предприятие полного цикла в сфере радиоэлектроники и
            механо-сборочных работ.
          </p>
        </div>
        <nav className={styles.footerCol} aria-label="Услуги">
          <span className={styles.footerH}>Услуги</span>
          <TransitionLink href={routes.antennas} className={styles.footerLink}>
            Антенны
          </TransitionLink>
          <TransitionLink href={routes.metal} className={styles.footerLink}>
            Металлообработка
          </TransitionLink>
          <TransitionLink href={routes.assembly} className={styles.footerLink}>
            Контрактная сборка
          </TransitionLink>
          <TransitionLink href={routes.docs} className={styles.footerLink}>
            Документация КД, ТД
          </TransitionLink>
        </nav>
        <nav className={styles.footerCol} aria-label="Компания">
          <span className={styles.footerH}>Компания</span>
          <TransitionLink href={routes.about} className={styles.footerLink}>
            О компании
          </TransitionLink>
          <TransitionLink href={routes.services} className={styles.footerLink}>
            Услуги
          </TransitionLink>
          <TransitionLink href={routes.contacts} className={styles.footerLink}>
            Контакты
          </TransitionLink>
        </nav>
        <address className={styles.footerCol}>
          <span className={styles.footerH}>Связаться</span>
          <a href={site.phoneHref} className={styles.footerPhone}>
            {site.phone}
          </a>
          <a href={`mailto:${site.email}`} className={styles.footerMail}>
            {site.email}
          </a>
          <span className={styles.footerAddr}>{site.address}</span>
          <span className={styles.footerHours}>{site.hours}</span>
        </address>
      </div>
      <div className={`wrap ${styles.footerBottom}`}>
        <span className="tech tech-500">
          © {site.legalShort}, {site.year}
        </span>
        <CopyButton text={requisitesText} title="Скопировать реквизиты" className="tech tech-500">
          ИНН&nbsp;{site.inn} · КПП&nbsp;{site.kpp} · ОГРН&nbsp;{site.ogrn}
        </CopyButton>
        <TransitionLink href={routes.privacy} className={`tech ${styles.footerPrivacy}`}>
          Политика конфиденциальности
        </TransitionLink>
      </div>
    </footer>
  );
}
