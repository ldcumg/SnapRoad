import MyPageBack from '@/components/myPage/MyPageBack';
import { cn } from '@/lib/utils';
import { ReactNode, HTMLAttributes, useEffect, useState } from 'react';

interface BottomSheetProps extends HTMLAttributes<HTMLDivElement> {
  isOpen: boolean;
  onClose: () => void;
  onBack?: () => void;
  title: string;
  buttonLabel?: string;
  onButtonClick: () => void;
  children: ReactNode;
  height?: 'full' | 'half';
}

export const AgreeBottomSheet = ({
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
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
      const timer = setTimeout(() => setRendered(false), 500);
      return () => clearTimeout(timer);
    }
    return () => {
      document.body.style.overflow = 'auto'; // 컴포넌트 언마운트 시에도 외부 스크롤 해제??
    };
  }, [isOpen]);

  const baseStyle =
    'fixed bottom-0 left-0 right-0 bg-white transition-transform transition-opacity duration-500 ease-in-out';
  const heightStyle = height === 'full' ? 'h-full' : 'h-1/2';
  const visibilityStyle = isOpen ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0';

  return (
    <>
      {/* 배경 */}
      {rendered && (
        <div
          className={`fixed inset-0 bg-black transition-opacity duration-500 ease-in-out ${
            isOpen ? 'opacity-50' : 'opacity-0 hidden'
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
          <div className='w-12 h-1 bg-gray-300 mx-auto my-2'></div>

          {/* <div className='flex items-center justify-between px-4 py-2 border-b border-gray-300'>
            {onBack && (
              <img
                src='/svgs/Arrow_Back_LG.svg'
                alt='뒤로가기'
                className='absolute left-0 cursor-pointer'
                onClick={onClose}
              />
            )}

            <h2 className='text-center font-semibold flex-1'>{title}</h2>

            <button
              onClick={onClose}
              aria-label='Close'
              className='text-gray-700'
            >
              × 닫기
            </button>
          </div> */}

          <div className='flex items-center py-4 relative'>
            <img
              src='/svgs/Arrow_Back_LG.svg'
              alt='뒤로가기'
              className='absolute left-0 cursor-pointer'
              onClick={onClose}
            />
            <span className='text-gray-900 text-label_md mx-auto'>개인정보 수집·이용 약관 동의</span>
          </div>

          <div className='p-4 text-gray-700 overflow-y-auto max-h-[calc(100vh-200px)]'>{children}</div>
        </div>
      )}
    </>
  );
};
