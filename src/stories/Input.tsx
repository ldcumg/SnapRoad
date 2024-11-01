import { cn } from '@/lib/utils';
import React, { forwardRef } from 'react';

export interface InputProps {
  type?: string;
  label: string;
  placeholder?: string;
  disabled?: boolean;
  size?: 'medium' | 'large';
  backgroundColor?: string;
  helperText?: string;
  variant?: 'primary' | 'danger' | 'outlinePink' | 'outlineGray' | 'default';
  onDeleteClick?: () => void; // 삭제 버튼 클릭 핸들러 추가
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      type = 'text',
      label,
      placeholder = '',
      disabled = false,
      size = 'medium',
      backgroundColor,
      helperText,
      variant = 'default',
      onDeleteClick, // 삭제 버튼 핸들러 추가
      ...props
    },
    ref,
  ) => {
    const sizeClasses = {
      medium: 'py-3 px-3 text-base',
      large: 'py-4 px-4 text-lg',
    };

    const colorStyles = {
      primary: 'bg-white text-gray-900 border-primary-400 rounded-md focus:border-primary-400',
      danger: 'bg-white text-danger border-danger rounded-lg focus:text-danger focus:border-danger',
      outlinePink: 'bg-white text-secondary-400 rounded-lg border border-secondary-400 focus:border-secondary-400',
      outlineGray: 'bg-white text-gray-900 border rounded-lg border-gray-300 focus:border-gray-300',
      default: 'bg-white text-gray-900 border rounded-lg border-gray-300 focus:border-gray-300',
    };

    const labelColorStyles = {
      primary: 'text-primary-400',
      danger: 'text-danger',
      outlinePink: 'text-secondary-400',
      outlineGray: 'text-gray-900',
      default: 'text-gray-900',
    };

    const helperTextColorStyles = {
      primary: 'text-primary-300',
      danger: 'text-danger',
      outlinePink: 'text-secondary-300',
      outlineGray: 'text-gray-300',
      default: 'text-gray-300',
    };

    const disabledStyle = 'cursor-not-allowed opacity-50';
    const activeStyle = disabled ? disabledStyle : colorStyles[variant];
    const disabledLabelStyle = disabled ? 'text-gray-400' : labelColorStyles[variant];

    return (
      <fieldset className='mb-4'>
        <label className={cn('block font-bold mb-2', disabledLabelStyle)}>{label}</label>
        <div className='relative'>
          <input
            ref={ref}
            type={type}
            placeholder={placeholder}
            disabled={disabled}
            className={cn(
              'border rounded-md w-full pr-10',
              sizeClasses[size],
              activeStyle,
              'focus:outline-none focus:ring-2',
              disabled ? disabledStyle : '',
            )}
            style={{ backgroundColor }}
            {...props}
          />
          {onDeleteClick && (
            <button
              type='button'
              onClick={onDeleteClick}
              className='absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700'
            >
              <svg
                width='24'
                height='24'
                viewBox='0 0 25 24'
                fill='none'
                xmlns='http://www.w3.org/2000/svg'
              >
                <path
                  fillRule='evenodd'
                  clipRule='evenodd'
                  d='M12.5 20C8.08172 20 4.5 16.4183 4.5 12C4.5 7.58172 8.08172 4 12.5 4C16.9183 4 20.5 7.58172 20.5 12C20.5 16.4183 16.9183 20 12.5 20ZM8.64646 8.14645C8.84172 7.95118 9.15831 7.95118 9.35357 8.14645L12.5 11.2929L15.6464 8.14652C15.8417 7.95126 16.1583 7.95126 16.3536 8.14652C16.5488 8.34178 16.5488 8.65837 16.3536 8.85363L13.2072 12L16.3536 15.1464C16.5488 15.3417 16.5488 15.6583 16.3536 15.8536C16.1583 16.0488 15.8417 16.0488 15.6465 15.8536L12.5 12.7071L9.35355 15.8536C9.15829 16.0489 8.84171 16.0489 8.64645 15.8536C8.45118 15.6584 8.45118 15.3418 8.64645 15.1465L11.7929 12L8.64646 8.85355C8.4512 8.65829 8.4512 8.34171 8.64646 8.14645Z'
                  fill='#6E7387'
                />
              </svg>
            </button>
          )}
        </div>
        {helperText && <p className={cn('text-sm mt-1', helperTextColorStyles[variant])}>{helperText}</p>}
      </fieldset>
    );
  },
);

Input.displayName = 'Input';
