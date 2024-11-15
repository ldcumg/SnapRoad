import { Button } from './Button';
import { IconArrowBackLG } from '@/lib/icon/Icon_Arrow_Back_LG';
import { IconCloseLG } from '@/lib/icon/Icon_Close_LG';
import { cn } from '@/lib/utils';
import { ReactNode, HTMLAttributes, useEffect, useState } from 'react';

interface BottomSheetProps extends HTMLAttributes<HTMLDivElement> {
  isOpen: boolean;
  onClose?: () => void;
  onConfirm?: () => void;
  title?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  height?: 'full' | 'half' | 'custom';
  customHeight?: string;
  children: ReactNode;
  rounded?: boolean;
  border?: boolean;
  hideTitle?: boolean;
  singleButton?: boolean; // 버튼 하나만 표시하는 옵션 추가
  showHeader?: boolean; // 상단 헤더 표시 여부
  showBackButton?: boolean; // 뒤로가기 버튼 표시 여부
  showCloseButton?: boolean; // 닫기 버튼 표시 여부
  onconfirmButtonClick?: () => void;
  oncancelButtonClick?: () => void;
  hasButton?: boolean;
  className?: string;
  backdrop?: boolean;
  titleClassName?: string;
  headerClassName?: string;
}

export const BottomSheet = ({
  isOpen,
  onClose,
  onConfirm,
  title = '',
  confirmLabel = '확인',
  cancelLabel = '취소',
  height = 'half',
  customHeight = '50%',
  children,
  rounded = false,
  border = true,
  hideTitle = false,
  singleButton = false, // 버튼 하나만 표시 여부
  showHeader = true, // 기본값으로 상단 헤더를 표시
  showBackButton = true, // 기본값으로 뒤로가기 버튼 표시
  showCloseButton = true, // 기본값으로 닫기 버튼 표시
  onconfirmButtonClick,
  oncancelButtonClick,
  hasButton = true,
  className,
  backdrop = true,
  titleClassName,
  headerClassName,
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
  const heightStyle = height === 'custom' ? customHeight : height === 'full' ? 'h-full' : 'h-1/2';
  // const visibilityStyle = isOpen ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0';
  const visibilityStyle = isOpen ? 'translate-y-0 opacity-100' : 'translate-y-full';
  const roundedStyle = rounded ? 'rounded-t-3xl' : '';

  return (
    <>
      {/* 배경 */}
      {rendered && (
        <div
          className={`fixed inset-0 bg-black transition-opacity duration-500 ease-in-out ${
            backdrop && isOpen ? 'opacity-50' : 'opacity-0'
          }`}
          onClick={onClose}
        ></div>
      )}

      {/* 바텀시트 */}
      {rendered && (
        <div
          className={cn(baseStyle, heightStyle, visibilityStyle, roundedStyle, 'z-50 pb-16')}
          style={{ height: height === 'custom' ? customHeight : undefined }}
          {...props}
        >
          {/* 타이틀 및 취소/닫기 버튼 - showHeader가 true일 때만 렌더링 */}
          {showHeader && !hideTitle && (
            <div className={`${headerClassName} flex items-center justify-between p-4`}>
              {showBackButton && (
                <button
                  onClick={onClose}
                  aria-label='Back'
                  className='text-gray-700'
                >
                  <IconArrowBackLG />
                </button>
              )}
              <h2 className={titleClassName ?? '-ml-3 flex-1 text-center font-semibold'}>{title}</h2>
              {showCloseButton && (
                <button
                  onClick={onClose}
                  aria-label='Close'
                  className='text-gray-700'
                >
                  <IconCloseLG />
                </button>
              )}
            </div>
          )}

          <div className={`${className} mb-5 p-4 text-gray-700`}>{children}</div>

          {hasButton && (
            <div className='absolute bottom-0 left-0 right-0 flex space-x-4 border-t border-gray-300 bg-white p-4'>
              {singleButton ? (
                <Button
                  onClick={onConfirm || onClose}
                  variant='primary'
                  size='large'
                  className='w-full text-lg font-semibold'
                >
                  {confirmLabel}
                </Button>
              ) : (
                <>
                  <Button
                    onClick={onClose}
                    variant='outlineGray'
                    size='large'
                    className='w-1/2 text-lg font-semibold'
                  >
                    {cancelLabel}
                  </Button>
                  <Button
                    onClick={onConfirm}
                    variant='primary'
                    size='large'
                    className='w-1/2 text-lg font-semibold'
                  >
                    {confirmLabel}
                  </Button>
                </>
              )}
            </div>
          )}
        </div>
      )}
    </>
  );
};
