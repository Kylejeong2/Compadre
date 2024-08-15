'use client';

import { ReactLenis } from '@studio-freight/react-lenis';
import StyledComponentsRegistry from '@/lib/registry';
import { GlobalStyles } from './GlobalStyles';
import { Footer, Header, Preloader } from '..';
import { useState, useEffect } from 'react';
import { usePreloader } from '@/components/Layout/PreloaderContext';
import { usePathname } from 'next/navigation';

const Layout = ({ children }: { children: React.ReactNode }) => {
  const [complete, setComplete] = useState(false);
  const { hasPreloaded, setHasPreloaded } = usePreloader();
  const pathname = usePathname();

  useEffect(() => {
    if (pathname === '/' && !hasPreloaded) {
      setComplete(false);
    } else {
      setComplete(true);
    }
  }, [pathname, hasPreloaded]);

  const handlePreloaderComplete = () => {
    setComplete(true);
    setHasPreloaded(true);
  };

  return (
    <StyledComponentsRegistry>
      <ReactLenis
        root
        easing={(t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t))}
      >
        <GlobalStyles />
        {pathname === '/' && !hasPreloaded && (
          <Preloader setComplete={handlePreloaderComplete} />
        )}
        <div className={complete ? 'complete' : 'not_complete'}>
          <Header />
          {children}
          <Footer />
        </div>
      </ReactLenis>
    </StyledComponentsRegistry>
  );
};

export default Layout;