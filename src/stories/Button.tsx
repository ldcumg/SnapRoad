import { cn } from '@/lib/utils';
import React from 'react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outlinePink' | 'outlineGray';
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
  loading?: boolean;
  label: string;
  children?: React.ReactNode;
  className?: string;
  onClick?: () => void;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
  onFocus?: () => void;
  onBlur?: () => void;
}

/** Primary UI component for user interaction */
export const Button = ({
  type = 'button',
  variant = 'primary',
  size = 'medium',
  className,
  onClick,
  disabled = false,
  loading = false,
  label,
  children,
  onMouseEnter,
  onMouseLeave,
  onFocus,
  onBlur,
  ...props
}: ButtonProps) => {
  const baseStyle = 'inline-flex items-center justify-center rounded-lg font-semibold focus:outline-none';
  const sizeStyle = {
    small: 'px-3 py-1 text-sm',
    medium: 'px-4 py-2',
    large: 'px-6 py-3 text-lg',
  }[size];

  let colorStyle;
  let disabledStyle = 'cursor-not-allowed opacity-50';
  let loadingStyle = 'cursor-not-allowed opacity-50';

  switch (variant) {
    case 'primary':
      colorStyle = 'bg-[#006B49] text-white hover:bg-[#009E6C]';
      disabledStyle = 'bg-[#97D3C0] text-white hover:bg-[#DCF4EC] cursor-not-allowed';
      break;
    case 'secondary':
      colorStyle = 'bg-[#EB84DA] text-black hover:bg-[#C653B2]';
      disabledStyle = 'bg-[#FFABF1] text-gray-500 hover:bg-[#FFABF1] cursor-not-allowed';
      break;
    case 'outlinePink':
      colorStyle = 'bg-white text-[#EB84DA] border border-[#EB84DA] hover:bg-[#FCE3F8]';
      disabledStyle = 'bg-white text-[#FCE3F8] cursor-not-allowed';
      break;
    case 'outlineGray':
      colorStyle = 'bg-white text-[#40434F] border border-[#40434F] hover:bg-[#DDDFE3]';
      disabledStyle = 'bg-white text-[#F9FAFA] cursor-not-allowed';
      break;
    default:
      colorStyle = 'bg-transparent text-gray-700 border border-gray-300 hover:bg-gray-100';
  }

  return (
    <button
      type={type}
      className={cn(
        baseStyle,
        sizeStyle,
        colorStyle,
        { [disabledStyle]: disabled },
        { [loadingStyle]: loading },
        className,
      )}
      onClick={onClick}
      disabled={disabled || loading}
      aria-label={props['aria-label']}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      onFocus={onFocus}
      onBlur={onBlur}
      {...props}
    >
      {loading ? (
        '로딩 중...'
      ) : (
        <>
          {children && <span className={cn('mr-2 flex items-center')}>{children}</span>} {/* 아이콘 */}
          {label} {/* 버튼 텍스트 */}
        </>
      )}
    </button>
  );
};
