import React, { ReactNode } from 'react';
import { Disclosure } from '@headlessui/react';
import { Bars3Icon, XMarkIcon, MagnifyingGlassIcon, ChartBarIcon } from '@heroicons/react/24/outline';
import { Link, useLocation } from 'react-router-dom';
import './Layout.css';

interface LayoutProps {
  children: ReactNode;
}

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: ChartBarIcon },
  { name: 'Search', href: '/search', icon: MagnifyingGlassIcon },
];

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ');
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const location = useLocation();

  return (
    <div className="min-h-full">
      <Disclosure as="nav" className="navbar">
        {({ open }) => (
          <>
            <div className="navbar-container">
              <div className="navbar-content">
                <div className="navbar-mobile-button">
                  <Disclosure.Button className="mobile-menu-button">
                    <span className="sr-only">Open main menu</span>
                    {open ? (
                      <XMarkIcon className="menu-icon" aria-hidden="true" />
                    ) : (
                      <Bars3Icon className="menu-icon" aria-hidden="true" />
                    )}
                  </Disclosure.Button>
                </div>
                <div className="navbar-brand">
                  <Link to="/" className="brand-link">
                    <span className="brand-text">🌶️ Spice</span>
                  </Link>
                </div>
                <div className="navbar-menu-desktop">
                  <div className="nav-links">
                    {navigation.map((item) => {
                      const isActive = location.pathname === item.href;
                      return (
                        <Link
                          key={item.name}
                          to={item.href}
                          className={classNames(
                            isActive ? 'nav-link-active' : 'nav-link',
                            'nav-link-base'
                          )}
                        >
                          <item.icon className="nav-icon" aria-hidden="true" />
                          {item.name}
                        </Link>
                      );
                    })}
                  </div>
                </div>

              </div>
            </div>

            <Disclosure.Panel className="mobile-menu">
              <div className="mobile-nav-links">
                {navigation.map((item) => {
                  const isActive = location.pathname === item.href;
                  return (
                    <Disclosure.Button
                      key={item.name}
                      as={Link}
                      to={item.href}
                      className={classNames(
                        isActive ? 'mobile-nav-link-active' : 'mobile-nav-link',
                        'mobile-nav-link-base'
                      )}
                    >
                      <item.icon className="mobile-nav-icon" aria-hidden="true" />
                      {item.name}
                    </Disclosure.Button>
                  );
                })}
              </div>
            </Disclosure.Panel>
          </>
        )}
      </Disclosure>

      <main className="main-content">
        <div className="content-container">
          {children}
        </div>
      </main>
    </div>
  );
};

export default Layout;