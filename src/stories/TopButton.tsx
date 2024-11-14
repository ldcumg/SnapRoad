'use client';

import { IconArrowUpMD } from '@/lib/icon/Icon_Arrow_Up_MD';

export const TopButton = () => {
  return (
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      className='fixed bottom-4 right-4 !z-50 rounded-[20px] bg-secondary-50 p-2 shadow-BG_TopButton'
    >
      <IconArrowUpMD />
    </button>
  );
};
