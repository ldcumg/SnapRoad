import { cn } from '@/lib/utils';
import React, { ReactNode } from 'react';

interface ModalProps {
  isModalOpen: boolean;
  handleModalOpen: () => void;
  children: ReactNode;
}

const modalOverlayClass =
  'fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 transition-opacity duration-300';
const modalContentClass =
  'relative z-10 bg-white rounded-xl p-6 shadow-lg max-w-md w-full transition-transform duration-300';
const closeButtonClass = 'absolute top-4 right-4 text-gray-500 hover:text-gray-700 focus:outline-none';
const closeIconClass = 'w-5 h-5';

export const Modal = ({ isModalOpen, handleModalOpen, children }: ModalProps) => {
  return (
    <div
      className={cn(
        modalOverlayClass,
        isModalOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none',
      )}
    >
      <div
        className='absolute inset-0'
        onClick={handleModalOpen}
      ></div>

      <div className={cn(modalContentClass, isModalOpen ? 'translate-y-0 opacity-100' : '-translate-y-10 opacity-0')}>
        <button
          onClick={handleModalOpen}
          className={closeButtonClass}
          aria-label='Close modal'
        >
          <svg
            xmlns='http://www.w3.org/2000/svg'
            fill='none'
            viewBox='0 0 24 24'
            strokeWidth='2'
            stroke='currentColor'
            className={closeIconClass}
          >
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              d='M6 18L18 6M6 6l12 12'
            />
          </svg>
        </button>

        {children}
      </div>
    </div>
  );
};
