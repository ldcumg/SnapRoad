import { cn } from '@/lib/utils';
import React from 'react';

export const TopButton = () => {
  return (
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      className={cn('fixed bottom-4 right-4 p-2 rounded-[20px] bg-secondary-50 shadow-BG_TopButton')}
    >
      <svg
        xmlns='http://www.w3.org/2000/svg'
        width='24'
        height='24'
        viewBox='0 0 24 24'
        fill='none'
      >
        <path
          fillRule='evenodd'
          clipRule='evenodd'
          d='M11.6464 6.64645C11.8417 6.45118 12.1583 6.45118 12.3536 6.64645L19.3536 13.6464C19.5488 13.8417 19.5488 14.1583 19.3536 14.3536C19.1583 14.5488 18.8417 14.5488 18.6464 14.3536L12 7.70711L5.35355 14.3536C5.15829 14.5488 4.84171 14.5488 4.64645 14.3536C4.45118 14.1583 4.45118 13.8417 4.64645 13.6464L11.6464 6.64645Z'
          fill='#FFABF1'
        />
      </svg>
    </button>
  );
};
