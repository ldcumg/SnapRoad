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

  // 애니메이션 트리거 설정
  useEffect(() => {
    if (isOpen) {
      setRendered(true);
    } else {
      const timer = setTimeout(() => setRendered(false), 500);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  const baseStyle = 'fixed bottom-0 left-0 right-0 bg-white transition-all duration-500 ease-in-out';
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
          className={cn(baseStyle, heightStyle, visibilityStyle, 'pb-16')}
          {...props}
        >
          <div className='w-12 h-1 bg-gray-300 mx-auto my-2'></div>

          <div className='flex items-center justify-between px-4 py-2 border-b border-gray-300'>
            {onBack && (
              <button
                onClick={onBack}
                aria-label='Back'
                className='text-gray-700'
              >
                ← 뒤로가기
              </button>
            )}

            <h2 className='text-center font-semibold flex-1'>{title}</h2>

            <button
              onClick={onClose}
              aria-label='Close'
              className='text-gray-700'
            >
              × 닫기
            </button>
          </div>

          <div className='p-4 text-gray-700'>{children}</div>

          <div className='absolute bottom-0 left-0 right-0 p-4 bg-white border-t border-gray-300'>
            <button
              onClick={onButtonClick}
              className='w-full bg-gray-200 text-gray-700 py-2 rounded'
            >
              {buttonLabel}
            </button>
          </div>
        </div>
      )}
    </>
  );
};
