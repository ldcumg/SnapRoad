'use client';

import { useState, useEffect } from 'react';

const ScrollReactHeader = ({ children }: { children: React.ReactNode }) => {
  const [hasScrolled, setHasScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setHasScrolled(window.scrollY > 0);
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <header
      className={`z-2 fixed top-0 mx-auto flex w-full max-w-[1200px] flex-row justify-between bg-white px-4 py-2 transition-all duration-300 ${
        hasScrolled ? 'border-b border-gray-300' : 'border-b-0'
      }`}
    >
      {children}
    </header>
  );
};

export default ScrollReactHeader;
