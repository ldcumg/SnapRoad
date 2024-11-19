import { cn } from '@/lib/utils';
import Link from 'next/link';
import React from 'react';

export interface LinkButtonProps extends Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, 'type'> {
  variant?: 'primary' | 'secondary' | 'outlinePink' | 'outlineGray';
  size?: 'small' | 'medium' | 'large' | 'full';
  loading?: boolean;
  label?: string;
  children?: React.ReactNode;
  className?: string;
  onClick?: () => void;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
  onFocus?: () => void;
  onBlur?: () => void;
  href: string;
}

export const LinkButton = ({
  variant = 'primary',
  size = 'medium',
  className,
  onClick,
  loading = false,
  label,
  children,
  onMouseEnter,
  onMouseLeave,
  onFocus,
  onBlur,
  href,
  ...props
}: LinkButtonProps) => {
  const baseStyle = 'inline-flex items-center justify-center focus:outline-none';
  const sizeStyle = {
    small: 'px-4 py-2 text-label_sm rounded-[4px]',
    medium: 'px-5 py-3 text-label_md rounded-[8px]',
    large: 'px-6 py-3 text-title_lg rounded-[12px]',
    full: 'px-5 py-3  ssm:text-label_md text-[13px] rounded-[8px] w-full',
  }[size];

  let colorStyle;
  let loadingStyle = 'cursor-not-allowed opacity-50';

  switch (variant) {
    case 'primary':
      colorStyle = 'bg-primary-400 text-white hover:bg-primary-600';
      loadingStyle = 'bg-primary-200 text-white hover:bg-primary-200 cursor-not-allowed';
      break;
    case 'secondary':
      colorStyle = 'bg-secondary-100 text-black hover:bg-secondary-600';
      loadingStyle = 'bg-secondary-100 text-gray-500 hover:bg-secondary-100 cursor-not-allowed';
      break;
    case 'outlinePink':
      colorStyle = 'bg-white text-secondary-400 border border-secondary-400 hover:bg-secondary-50';
      loadingStyle = 'bg-white text-secondary-50 border border-secondary-50 hover:bg-white cursor-not-allowed';
      break;
    case 'outlineGray':
      colorStyle = 'bg-white text-gray-700 border border-gray-700 hover:bg-gray-100';
      loadingStyle = 'bg-white text-gray-100 border border-gray-100 hover:bg-white cursor-not-allowed';
      break;
    default:
      colorStyle = 'bg-transparent text-gray-700 border border-gray-300 hover:bg-gray-100';
  }

  return (
    <Link
      href={href}
      className={cn(baseStyle, sizeStyle, colorStyle, { [loadingStyle]: loading }, className)}
      onClick={onClick}
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
          {children && <span className={cn('mr-2 flex items-center')}>{children}</span>}
          {label}
        </>
      )}
    </Link>
  );
};
