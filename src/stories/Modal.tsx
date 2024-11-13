import { IconCloseLG } from '@/lib/icon/Icon_Close_LG';
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
        isModalOpen ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-0',
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
          <IconCloseLG />
        </button>
        {children}
      </div>
    </div>
  );
};
