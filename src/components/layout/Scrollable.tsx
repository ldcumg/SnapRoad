import { useState, useEffect } from 'react';

const Scrollable = ({ children }: { children: React.ReactNode }) => {
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
      className={`fixed top-0 left-0 right-0 bg-white transition-all duration-300 ${
        hasScrolled ? 'border-b  border-red-600 border-gray-300' : 'border-b-0'
      }`}
    >
      {children}
    </div>
  );
};

export default Scrollable;
