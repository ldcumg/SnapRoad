import { cn } from '@/lib/utils';

export interface ButtonProps extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'type'> {
  variant?: 'primary' | 'secondary' | 'outlinePink' | 'outlineGray';
  size?: 'small' | 'medium' | 'large' | 'full';
  disabled?: boolean;
  loading?: boolean;
  label?: string;
  children?: React.ReactNode;
  className?: string;
  type?: 'button' | 'submit' | 'reset';
  onClick?: () => void;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
  onFocus?: () => void;
  onBlur?: () => void;
}

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
  const baseStyle = 'inline-flex items-center justify-center focus:outline-none';
  const sizeStyle = {
    small: 'px-4 py-2 text-label_sm rounded-[4px]',
    medium: 'px-5 py-3 text-label_md rounded-[8px]',
    large: 'px-6 py-3 text-title_lg rounded-[12px]',
    full: 'px-5 py-3 text-label_md rounded-[8px] w-full',
  }[size];

  let colorStyle;
  let disabledStyle = 'cursor-not-allowed opacity-50';
  let loadingStyle = 'cursor-not-allowed opacity-50';

  switch (variant) {
    case 'primary':
      colorStyle = 'bg-primary-400 text-white hover:bg-primary-600';
      disabledStyle = 'bg-primary-50 text-white hover:bg-primary-200 cursor-not-allowed';
      loadingStyle = 'bg-primary-200 text-white hover:bg-primary-200 cursor-not-allowed';
      break;
    case 'secondary':
      colorStyle = 'bg-secondary-100 text-black hover:bg-secondary-600';
      disabledStyle = 'bg-secondary-100 text-gray-500 hover:bg-secondary-100 cursor-not-allowed';
      loadingStyle = 'bg-secondary-100 text-gray-500 hover:bg-secondary-100 cursor-not-allowed';
      break;
    case 'outlinePink':
      colorStyle = 'bg-white text-secondary-400 border border-secondary-400 hover:bg-secondary-50';
      disabledStyle = 'bg-white text-secondary-50 border border-secondary-50 hover:bg-white cursor-not-allowed';
      loadingStyle = 'bg-white text-secondary-50 border border-secondary-50 hover:bg-white cursor-not-allowed';
      break;
    case 'outlineGray':
      colorStyle = 'bg-white text-gray-700 border border-gray-700 hover:bg-gray-100';
      disabledStyle = 'bg-white text-gray-100 border border-gray-100 hover:bg-white cursor-not-allowed';
      loadingStyle = 'bg-white text-gray-100 border border-gray-100 hover:bg-white cursor-not-allowed';
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
          {children && <span className={cn('mr-2 flex items-center')}>{children}</span>}
          {label}
        </>
      )}
    </button>
  );
};
