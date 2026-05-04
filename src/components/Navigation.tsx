'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import styles from './Navigation.module.css';

const MOBILE_BREAKPOINT = 1024;
const SECTION_IDS = ['home', 'about', 'projects', 'contact'] as const;

const Navigation = () => {
  const [isMobile, setIsMobile] = useState(false);
  const [hash, setHash] = useState('');
  const pathname = usePathname();

  const navItems = [
    { href: '/#home', label: 'HOME' },
    { href: '/#about', label: 'ABOUT' },
    { href: '/#projects', label: 'PROJECTS' },
    { href: '/#contact', label: 'CONTACT' }
  ];

  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth <= MOBILE_BREAKPOINT);
    };

    checkIfMobile();
    window.addEventListener('resize', checkIfMobile);

    return () => window.removeEventListener('resize', checkIfMobile);
  }, []);

  useEffect(() => {
    const updateHash = () => {
      setHash(window.location.hash || '#home');
    };

    updateHash();
    window.addEventListener('hashchange', updateHash);

    return () => window.removeEventListener('hashchange', updateHash);
  }, []);

  useEffect(() => {
    if (pathname !== '/') {
      return;
    }

    let isTicking = false;

    const getHeaderOffset = () => {
      const header = document.querySelector('.app-header-wrap') as HTMLElement | null;
      return header?.offsetHeight ?? (isMobile ? 110 : 140);
    };

    const getActiveSectionId = () => {
      const anchorOffset = getHeaderOffset() + 24;
      let activeSectionId = 'home';

      for (const sectionId of SECTION_IDS) {
        const section = document.getElementById(sectionId);

        if (!section) {
          continue;
        }

        const sectionTop = section.getBoundingClientRect().top;

        if (sectionTop - anchorOffset <= 0) {
          activeSectionId = sectionId;
        }
      }

      return activeSectionId;
    };

    const syncActiveSection = () => {
      isTicking = false;

      const activeSectionId = getActiveSectionId();
      const nextHash = `#${activeSectionId}`;

      setHash((previousHash) => (previousHash === nextHash ? previousHash : nextHash));

      if (window.location.hash !== nextHash) {
        window.history.replaceState(null, '', `/${nextHash}`);
      }
    };

    const requestSync = () => {
      if (isTicking) {
        return;
      }

      isTicking = true;
      window.requestAnimationFrame(syncActiveSection);
    };

    requestSync();
    window.addEventListener('scroll', requestSync, { passive: true });
    window.addEventListener('resize', requestSync);

    return () => {
      window.removeEventListener('scroll', requestSync);
      window.removeEventListener('resize', requestSync);
    };
  }, [pathname, isMobile]);

  const isActivePath = (href: string) => {
    if (pathname !== '/') {
      return false;
    }

    return hash === href.replace('/', '');
  };

  const getTabClassName = (href: string) => {
    const isActive = isActivePath(href);
    const activeClass = isMobile ? styles.tabActiveMobile : styles.tabActiveDesktop;

    return [
      styles.tab,
      isMobile ? styles.tabMobile : styles.tabDesktop,
      isActive ? activeClass : styles.tabInactive
    ].join(' ');
  };

  const handleSectionClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (pathname !== '/') {
      return;
    }

    e.preventDefault();
    const targetId = href.replace('/#', '');

    if (targetId === 'home') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      window.history.replaceState(null, '', '/#home');
      setHash('#home');
      return;
    }

    const targetSection = document.getElementById(targetId);

    if (targetSection) {
      targetSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
      window.history.replaceState(null, '', href);
      setHash(`#${targetId}`);
    }
  };

  if (isMobile) {
    return (
      <nav className={styles.navMobile}>
        <div className={styles.mobileTopStrip} />
        <div className={styles.tabsRowMobile}>
          {navItems.map((item) => {
            return (
              <Link
                key={item.href}
                href={item.href}
                className={getTabClassName(item.href)}
                onClick={(e) => handleSectionClick(e, item.href)}
              >
                {item.label}
              </Link>
            );
          })}
        </div>
      </nav>
    );
  }

  return (
    <nav className={styles.navDesktop}>
      <div className={styles.tabsRowDesktop}>
        {navItems.map((item) => {
          return (
            <Link
              key={item.href}
              href={item.href}
              className={getTabClassName(item.href)}
              onClick={(e) => handleSectionClick(e, item.href)}
            >
              {item.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
};

export default Navigation;