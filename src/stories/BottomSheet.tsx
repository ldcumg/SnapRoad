import { Button } from './Button';
import { cn } from '@/lib/utils';
import { ReactNode, HTMLAttributes, useEffect, useState } from 'react';

interface BottomSheetProps extends HTMLAttributes<HTMLDivElement> {
  isOpen: boolean;
  onClose: () => void;
  onBack?: () => void;
  title: string;
  buttonLabel: string;
  onButtonClick: () => void;
  children: ReactNode;
  height?: 'full' | 'half';
}

export const BottomSheet = ({
  isOpen,
  onClose,
  onBack,
  title,
  buttonLabel,
  onButtonClick,
  children,
  height = 'half',
  ...props
}: BottomSheetProps) => {
  const [rendered, setRendered] = useState(isOpen);

  useEffect(() => {
    if (isOpen) {
      setRendered(true);
    } else {
      const timer = setTimeout(() => setRendered(false), 500);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  const baseStyle = 'fixed bottom-0 left-0 right-0 bg-white transition-all duration-500 ease-in-out z-50';
  const heightStyle = height === 'full' ? 'h-full' : 'h-1/2';
  const visibilityStyle = isOpen ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0';

  return (
    <>
      {/* 배경 */}
      {rendered && (
        <div
          className={`fixed inset-0 bg-black transition-opacity duration-500 ease-in-out ${
            isOpen ? 'opacity-50' : 'opacity-0'
          }`}
          onClick={onClose}
        ></div>
      )}

      {/* 바텀시트 */}
      {rendered && (
        <div
          className={cn(baseStyle, heightStyle, visibilityStyle, 'pb-16 z-50')}
          {...props}
        >
          <div className='flex items-center justify-between p-4 border-b border-gray-300'>
            <button
              onClick={onClose}
              aria-label='Close'
              className='text-gray-700'
            >
              <img
                src='/svgs/Arrow_Back_LG.svg'
                alt='뒤로가기'
                className='mr-2'
              />
            </button>

            {/* {onBack && (
              <button
                onClick={onBack}
                aria-label='Back'
                className='text-gray-700'
              >
                <img
                  src='/svgs/Arrow_Back_LG.svg'
                  alt='뒤로가기'
                  className='mr-2'
                />
              </button>
            )} */}

            <h2 className='text-center font-semibold -ml-3 flex-1'>{title}</h2>
          </div>

          <div className='p-4 text-gray-700'>{children}</div>

          <div className='absolute bottom-0 left-0 right-0 p-4 bg-white border-t border-gray-300'>
            <Button
              onClick={onButtonClick}
              variant='primary'
              size='large'
              className='w-full text-lg font-semibold'
            >
              {buttonLabel}
            </Button>
          </div>
        </div>
      )}
    </>
  );
};
