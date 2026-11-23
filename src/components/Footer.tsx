import { SHOP } from '../config';
import { DEPARTMENTS } from '../data/catalog';
import { whatsappChatUrl } from '../lib/whatsapp';
import { NAV_LINKS } from './Header';
import { InstagramIcon, PhoneIcon, PinIcon, WhatsAppIcon } from './Icons';
import { Logo } from './Logo';

export function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer id="contact" className="footer" aria-labelledby="contact-title">
      <div className="container footer__grid">
        <div className="footer__brand">
          <Logo />
          <p>
            Authentic Indian sweets and savoury namkeens, made with care for every celebration,
            festival and everyday moment of happiness.
          </p>
          <div className="footer__social">
            <a
              className="btn btn--whatsapp"
              href={whatsappChatUrl()}
              target="_blank"
              rel="noopener noreferrer"
            >
              <WhatsAppIcon /> Order on WhatsApp
            </a>
            <a
              className="icon-link"
              href={SHOP.instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
            >
              <InstagramIcon />
            </a>
          </div>
        </div>

        <nav aria-label="Quick links">
          <h3 className="footer__h">Quick Links</h3>
          <ul>
            {NAV_LINKS.map((l) => (
              <li key={l.href}>
                <a href={l.href}>{l.label}</a>
              </li>
            ))}
          </ul>
        </nav>

        {DEPARTMENTS.map((d) => (
          <nav key={d.id} aria-label={`${d.title} categories`}>
            <h3 className="footer__h">{d.title}</h3>
            <ul>
              {d.categories.map((c) => (
                <li key={c.id}>
                  <a href={`#${c.id}`}>{c.title}</a>
                </li>
              ))}
            </ul>
          </nav>
        ))}

        <div>
          <h3 id="contact-title" className="footer__h">
            Contact
          </h3>
          <ul className="footer__contact">
            <li>
              <PinIcon width={18} height={18} />
              <span>{SHOP.addressLines.join(', ')}</span>
            </li>
            <li>
              <PhoneIcon width={18} height={18} />
              <span>{SHOP.phoneDisplay}</span>
            </li>
            <li>
              <span className="footer__dot" aria-hidden="true" />
              <a href={`mailto:${SHOP.email}`}>{SHOP.email}</a>
            </li>
            <li>
              <span className="footer__dot" aria-hidden="true" />
              <span>{SHOP.hours}</span>
            </li>
          </ul>
        </div>
      </div>
      <div className="container footer__bottom">
        <p>
          © {year} {SHOP.name}. All rights reserved.
        </p>
        <p>
          <a href="/privacy.html">Privacy</a> · <a href="/credits.html">Photo credits</a>
        </p>
      </div>
    </footer>
  );
}
