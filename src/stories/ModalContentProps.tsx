import { cn } from '@/lib/utils';
import React from 'react';

interface ModalContentProps {
  title: string;
  content: string;
  onClose: () => void;
  className?: string;
}

export const ModalContent = ({ title, content, onClose, className }: ModalContentProps) => (
  <div className={cn('bg-white', className)}>
    <h2 className={cn('mt-8 text-lg font-semibold mb-2')}>{title}</h2>
    <p className={cn('text-gray-700 mb-4')}>{content}</p>
    <button
      onClick={onClose}
      className={cn('w-full mt-4 px-4 py-2 bg-primary-400 text-white rounded-md hover:bg-primary-600 transition')}
    >
      모달 닫기
    </button>
  </div>
);
