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
    <div
      className={`fixed z-[2] top-0 left-0 right-0 bg-white transition-all duration-300 py-2 px-4 flex flex-row justify-between ${
        hasScrolled ? 'border-b border-gray-300' : 'border-b-0'
      }`}
    >
      {children}
    </div>
  );
};

export default ScrollReactHeader;
