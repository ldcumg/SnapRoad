import { cn } from '@/lib/utils';
import React, { ReactNode, useEffect } from 'react';

interface ModalProps {
  isModalOpen: boolean;
  handleModalOpen: () => void;
  children: ReactNode;
}

const modalOverlayClass =
  'fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 transition-opacity duration-300 px-4';
const modalContentClass =
  'relative z-10 bg-white rounded-xl pb-4 px-4 shadow-lg max-w-md w-full transition-transform duration-300';
const closeButtonClass = 'absolute z-12 top-4 right-4 text-gray-500 hover:text-gray-700 focus:outline-none';
const closeIconClass = 'w-5 h-5';

export const Modal = ({ isModalOpen, handleModalOpen, children }: ModalProps) => {
  useEffect(() => {
    document.body.style.overflow = isModalOpen ? 'hidden' : '';

    return () => {
      document.body.style.overflow = '';
    };
  }, [isModalOpen]);

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
            width='19'
            height='19'
            viewBox='0 0 24 24'
            fill='none'
          >
            <path
              fillRule='evenodd'
              clipRule='evenodd'
              d='M2.64645 2.64645C2.84171 2.45118 3.15829 2.45118 3.35355 2.64645L12 11.2929L20.6464 2.64645C20.8417 2.45118 21.1583 2.45118 21.3536 2.64645C21.5488 2.84171 21.5488 3.15829 21.3536 3.35355L12.7071 12L21.3535 20.6463C21.5487 20.8416 21.5487 21.1582 21.3535 21.3535C21.1582 21.5487 20.8416 21.5487 20.6463 21.3535L12 12.7071L3.35355 21.3536C3.15829 21.5488 2.84171 21.5488 2.64645 21.3536C2.45118 21.1583 2.45118 20.8417 2.64645 20.6464L11.2929 12L2.64645 3.35355C2.45118 3.15829 2.45118 2.84171 2.64645 2.64645Z'
              fill='#121316'
            />
          </svg>
        </button>
        {children}
      </div>
    </div>
  );
};
