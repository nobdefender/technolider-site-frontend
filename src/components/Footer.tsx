import { requisitesText, routes, site } from '@/content/site';
import { CopyButton } from './CopyButton';
import { TransitionLink } from './Transition';

export function Footer() {
  return (
    <footer className="footer">
      <div className="wrap footer-grid">
        <div>
          <span className="footer-brand">Технолидер</span>
          <p className="footer-desc">
            Научно-производственное предприятие полного цикла в сфере радиоэлектроники и
            механо-сборочных работ.
          </p>
        </div>
        <nav className="footer-col" aria-label="Услуги">
          <span className="footer-h">Услуги</span>
          <TransitionLink href={routes.antennas} className="footer-link">
            Антенны
          </TransitionLink>
          <TransitionLink href={routes.metal} className="footer-link">
            Металлообработка
          </TransitionLink>
          <TransitionLink href={routes.assembly} className="footer-link">
            Контрактная сборка
          </TransitionLink>
          <TransitionLink href={routes.docs} className="footer-link">
            Документация КД, ТД
          </TransitionLink>
        </nav>
        <nav className="footer-col" aria-label="Компания">
          <span className="footer-h">Компания</span>
          <TransitionLink href={routes.about} className="footer-link">
            О компании
          </TransitionLink>
          <TransitionLink href={routes.services} className="footer-link">
            Услуги
          </TransitionLink>
          <TransitionLink href={routes.contacts} className="footer-link">
            Контакты
          </TransitionLink>
        </nav>
        <address className="footer-col">
          <span className="footer-h">Связаться</span>
          <a href={site.phoneHref} className="footer-phone">
            {site.phone}
          </a>
          <a href={`mailto:${site.email}`} className="footer-mail">
            {site.email}
          </a>
          <span className="footer-addr">{site.address}</span>
          <span className="footer-hours">{site.hours}</span>
        </address>
      </div>
      <div className="wrap footer-bottom">
        <span className="tech tech-500">
          © {site.legalShort}, {site.year}
        </span>
        <CopyButton text={requisitesText} title="Скопировать реквизиты" className="tech tech-500">
          ИНН&nbsp;{site.inn} · КПП&nbsp;{site.kpp} · ОГРН&nbsp;{site.ogrn}
        </CopyButton>
        <TransitionLink href={routes.privacy} className="tech footer-privacy">
          Политика конфиденциальности
        </TransitionLink>
      </div>
    </footer>
  );
}
