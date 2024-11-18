'use client';

import { IconArrowUpMD } from '@/lib/icon/Icon_Arrow_Up_MD';
import { debounce } from '@/utils/debounce';
import React, { useEffect, useState } from 'react';

export const TopButton = () => {
  const [showButton, setShowButton] = useState(false);

  const showButtonClick = () => {
    setShowButton(window.scrollY > 1);
  };

  useEffect(() => {
    const debouncedShowButtonClick = debounce(showButtonClick, 500);
    window.addEventListener('scroll', debouncedShowButtonClick);
    return () => {
      window.removeEventListener('scroll', debouncedShowButtonClick);
    };
  }, []);
  return (
    <>
      {showButton && (
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className='fixed bottom-4 right-4 !z-50 rounded-[20px] bg-secondary-50 p-2 shadow-BG_TopButton'
        >
          <IconArrowUpMD />
        </button>
      )}
    </>
  );
};
