import { cn } from '@/lib/utils';
import { ReactNode, HTMLAttributes, useEffect, useState } from 'react';

interface BottomSheetProps extends HTMLAttributes<HTMLDivElement> {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  buttonLabel: string;
  onButtonClick: () => void;
  children: ReactNode;
}

export const BottomSheet = ({
  isOpen,
  onClose,
  title,
  buttonLabel,
  onButtonClick,
  children,
  ...props
}: BottomSheetProps) => {
  const [isVisible, setIsVisible] = useState(isOpen);

  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
    } else {
      const timer = setTimeout(() => setIsVisible(false), 300); // 닫힐 때 300ms 지연
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  return (
    <>
      {/* 배경 */}
      {isVisible && (
        <div
          className={`fixed inset-0 bg-black transition-opacity duration-300 ease-in-out ${
            isOpen ? 'opacity-50' : 'opacity-0 hidden'
          }`}
          onClick={onClose}
        ></div>
      )}

      {/* 바텀시트 */}
      {isVisible && (
        <div
          className={cn(
            'fixed bottom-0 left-0 right-0 bg-white rounded-t-2xl transition-transform duration-300 ease-in-out transform',
            isOpen ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0',
            'pb-8 z-50',
          )}
          style={{ visibility: isOpen ? 'visible' : 'hidden' }}
          {...props}
        >
          <div className='w-12 h-1 bg-gray-300 mx-auto my-2 rounded'></div>

          <div className='flex items-center justify-between px-4 py-2 border-b border-gray-200'>
            <h2 className='text-lg font-semibold'>{title}</h2>
            <button
              onClick={onClose}
              aria-label='Close'
              className='text-gray-500'
            >
              ×
            </button>
          </div>

          <div className='p-4'>{children}</div>

          <div className='absolute bottom-0 left-0 right-0 p-4 bg-white border-t border-gray-200'>
            <button
              onClick={onButtonClick}
              className='w-full bg-blue-500 text-white py-2 rounded-lg'
            >
              {buttonLabel}
            </button>
          </div>
        </div>
      )}
    </>
  );
};