import { IconCloseCircle } from '@/lib/icon/Icon_Close_Circle';
import { IconHide } from '@/lib/icon/Icon_Hide';
import { IconShow } from '@/lib/icon/Icon_Show';
import { cn } from '@/lib/utils';
import React, { useState, forwardRef } from 'react';

export interface InputProps {
  type?: string;
  label?: string;
  placeholder?: string;
  disabled?: boolean;
  size?: 'medium' | 'large';
  backgroundColor?: string;
  helperText?: string;
  errorText?: string;
  variant?: 'primary' | 'danger' | 'outlinePink' | 'outlineGray' | 'default';
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onDeleteClick?: () => void;
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
      errorText,
      variant = 'default',
      onChange,
      onDeleteClick,
      ...props
    },
    ref,
  ) => {
    const [inputValue, setInputValue] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    const handleDeleteClick = () => {
      setInputValue('');
      if (onChange) {
        onChange({ target: { value: '' } } as React.ChangeEvent<HTMLInputElement>);
      }

      if (onDeleteClick) {
        onDeleteClick();
      }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setInputValue(e.target.value);
      if (onChange) onChange(e);
    };

    const togglePasswordVisibility = () => {
      setShowPassword(!showPassword);
    };

    const sizeClasses = {
      medium: 'py-3 px-3 text-base',
      large: 'py-4 px-4 text-lg',
    };

    const colorStyles = {
      primary: 'bg-white text-gray-900 border-primary-400 rounded-md focus:border-primary-400',
      danger: 'bg-white text-danger border-danger rounded-lg focus:text-danger focus:border-danger',
      outlinePink: 'bg-white text-secondary-400 rounded-lg border border-secondary-400 focus:border-secondary-400',
      outlineGray: 'bg-white text-gray-900 border rounded-lg border-gray-100 focus:border-gray-300',
      default: 'bg-white text-gray-900 border rounded-lg border-gray-100 focus:border-gray-300',
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
    const activeStyle = disabled
      ? disabledStyle
      : inputValue && errorText
        ? colorStyles['danger']
        : colorStyles[variant];
    const disabledLabelStyle = disabled
      ? 'text-gray-400'
      : inputValue && errorText
        ? colorStyles['danger']
        : labelColorStyles[variant];

    return (
      <fieldset>
        <label className={cn('mb-2 block font-bold', disabledLabelStyle)}>{label}</label>
        <div className='relative'>
          <input
            ref={ref}
            type={type === 'password' && showPassword ? 'text' : type}
            placeholder={placeholder}
            disabled={disabled}
            value={inputValue}
            onChange={handleChange}
            className={cn(
              'w-full rounded-md border pr-10',
              sizeClasses[size],
              activeStyle,
              'focus:outline-none focus:ring-2',
              disabled ? disabledStyle : '',
            )}
            style={{ backgroundColor }}
            {...props}
          />
          {type === 'password' && (
            <button
              type='button'
              onClick={togglePasswordVisibility}
              className='absolute right-10 top-1/2 -translate-y-1/2 transform text-gray-500 hover:text-gray-700'
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? <IconShow /> : <IconHide />}
            </button>
          )}
          {inputValue && (
            <button
              type='button'
              onClick={handleDeleteClick}
              className='absolute right-3 top-1/2 -translate-y-1/2 transform text-gray-500 hover:text-gray-700'
              aria-label='Clear input'
            >
              <IconCloseCircle />
            </button>
          )}
        </div>

        {inputValue && errorText ? (
          <p className={cn('mt-1 text-sm', helperTextColorStyles['danger'])}>{errorText}</p>
        ) : (
          helperText && <p className={cn('mt-1 text-sm', helperTextColorStyles[variant])}>{helperText}</p>
        )}
      </fieldset>
    );
  },
);

Input.displayName = 'Input';
