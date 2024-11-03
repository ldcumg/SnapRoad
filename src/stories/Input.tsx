import { cn } from '@/lib/utils';
import React, { useState, forwardRef } from 'react';

export interface InputProps {
  type?: string;
  label: string;
  placeholder?: string;
  disabled?: boolean;
  size?: 'medium' | 'large';
  backgroundColor?: string;
  helperText?: string;
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
            type={type === 'password' && showPassword ? 'text' : type}
            placeholder={placeholder}
            disabled={disabled}
            value={inputValue}
            onChange={handleChange}
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
          {type === 'password' && (
            <button
              type='button'
              onClick={togglePasswordVisibility}
              className='absolute right-10 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700'
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? (
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  width='24'
                  height='24'
                  viewBox='0 0 24 24'
                  fill='none'
                >
                  <path
                    fillRule='evenodd'
                    clipRule='evenodd'
                    d='M8.12073 10.8451C8.39409 10.8841 8.58404 11.1374 8.54499 11.4108C8.51749 11.6033 8.50002 11.799 8.50002 12.0001C8.50002 13.9339 10.0662 15.5001 12 15.5001C12.6212 15.5001 13.2162 15.3337 13.7228 15.0455C13.9628 14.9089 14.268 14.9928 14.4046 15.2328C14.5412 15.4728 14.4573 15.7781 14.2173 15.9147C13.5638 16.2865 12.7989 16.5001 12 16.5001C9.51388 16.5001 7.50002 14.4862 7.50002 12.0001C7.50002 11.7411 7.52254 11.4969 7.55504 11.2694C7.5941 10.996 7.84736 10.806 8.12073 10.8451Z'
                    fill='#6E7387'
                  />
                  <path
                    fillRule='evenodd'
                    clipRule='evenodd'
                    d='M12 8.49998C11.3459 8.49998 10.7421 8.68262 10.2119 8.99187C9.97342 9.13101 9.66726 9.05044 9.52812 8.81192C9.38898 8.57339 9.46955 8.26723 9.70807 8.12809C10.3779 7.73735 11.1541 7.49998 12 7.49998C14.4862 7.49998 16.5 9.51384 16.5 12C16.5 12.2072 16.4892 12.4165 16.4532 12.6322C16.4078 12.9046 16.1502 13.0886 15.8778 13.0432C15.6054 12.9978 15.4214 12.7402 15.4668 12.4678C15.4909 12.3235 15.5 12.1727 15.5 12C15.5 10.0661 13.9339 8.49998 12 8.49998Z'
                    fill='#6E7387'
                  />
                  <path
                    fillRule='evenodd'
                    clipRule='evenodd'
                    d='M4.66845 8.38195C4.85513 8.58544 4.84149 8.90173 4.638 9.0884C3.48938 10.1421 2.87526 11.2512 2.62597 11.8051L2.62401 11.8095C2.56539 11.9365 2.56534 12.0732 2.6239 12.2002C3.20019 13.4456 5.5418 17.5 12 17.5C13.7224 17.5 15.1429 17.2099 16.3149 16.7716C16.5735 16.6749 16.8616 16.8062 16.9583 17.0648C17.0551 17.3235 16.9238 17.6115 16.6652 17.7083C15.3771 18.19 13.8376 18.5 12 18.5C4.99863 18.5 2.38012 14.0548 1.71622 12.6199C1.53522 12.2277 1.53467 11.7851 1.71495 11.3928C2.00618 10.7462 2.69195 9.51659 3.962 8.3515C4.16549 8.16483 4.48178 8.17846 4.66845 8.38195Z'
                    fill='#6E7387'
                  />
                  <path
                    fillRule='evenodd'
                    clipRule='evenodd'
                    d='M12 6.49998C10.2776 6.49998 8.85713 6.79001 7.68517 7.2283C7.42653 7.32503 7.13844 7.19377 7.04171 6.93513C6.94498 6.67648 7.07624 6.38839 7.33488 6.29166C8.62292 5.80996 10.1624 5.49998 12 5.49998C19.0014 5.49998 21.6199 9.94515 22.2838 11.38C22.4651 11.7727 22.4654 12.216 22.2843 12.6088C21.9947 13.2415 21.3307 14.4395 20.0926 15.6042C19.8915 15.7934 19.575 15.7837 19.3858 15.5826C19.1966 15.3814 19.2063 15.065 19.4074 14.8758C20.5289 13.8209 21.1248 12.7394 21.3754 12.1919L21.3761 12.1905C21.4347 12.0634 21.4347 11.9266 21.3761 11.7995C20.8 10.5544 18.4587 6.49998 12 6.49998Z'
                    fill='#6E7387'
                  />
                  <path
                    fillRule='evenodd'
                    clipRule='evenodd'
                    d='M1.5904 4.71325C1.74876 4.48703 2.06052 4.43201 2.28675 4.59037L22.2868 18.5904C22.513 18.7487 22.568 19.0605 22.4096 19.2867C22.2513 19.5129 21.9395 19.568 21.7133 19.4096L1.71329 5.4096C1.48706 5.25124 1.43204 4.93948 1.5904 4.71325Z'
                    fill='#6E7387'
                  />
                </svg>
              ) : (
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  width='24'
                  height='24'
                  viewBox='0 0 24 24'
                  fill='none'
                >
                  <path
                    fillRule='evenodd'
                    clipRule='evenodd'
                    d='M8.12073 10.8451C8.39409 10.8841 8.58404 11.1374 8.54499 11.4108C8.51749 11.6033 8.50002 11.799 8.50002 12.0001C8.50002 13.9339 10.0662 15.5001 12 15.5001C12.6212 15.5001 13.2162 15.3337 13.7228 15.0455C13.9628 14.9089 14.268 14.9928 14.4046 15.2328C14.5412 15.4728 14.4573 15.7781 14.2173 15.9147C13.5638 16.2865 12.7989 16.5001 12 16.5001C9.51388 16.5001 7.50002 14.4862 7.50002 12.0001C7.50002 11.7411 7.52254 11.4969 7.55504 11.2694C7.5941 10.996 7.84736 10.806 8.12073 10.8451Z'
                    fill='#6E7387'
                  />
                  <path
                    fillRule='evenodd'
                    clipRule='evenodd'
                    d='M12 8.49998C11.3459 8.49998 10.7421 8.68262 10.2119 8.99187C9.97342 9.13101 9.66726 9.05044 9.52812 8.81192C9.38898 8.57339 9.46955 8.26723 9.70807 8.12809C10.3779 7.73735 11.1541 7.49998 12 7.49998C14.4862 7.49998 16.5 9.51384 16.5 12C16.5 12.2072 16.4892 12.4165 16.4532 12.6322C16.4078 12.9046 16.1502 13.0886 15.8778 13.0432C15.6054 12.9978 15.4214 12.7402 15.4668 12.4678C15.4909 12.3235 15.5 12.1727 15.5 12C15.5 10.0661 13.9339 8.49998 12 8.49998Z'
                    fill='#6E7387'
                  />
                  <path
                    fillRule='evenodd'
                    clipRule='evenodd'
                    d='M4.66845 8.38195C4.85513 8.58544 4.84149 8.90173 4.638 9.0884C3.48938 10.1421 2.87526 11.2512 2.62597 11.8051L2.62401 11.8095C2.56539 11.9365 2.56534 12.0732 2.6239 12.2002C3.20019 13.4456 5.5418 17.5 12 17.5C13.7224 17.5 15.1429 17.2099 16.3149 16.7716C16.5735 16.6749 16.8616 16.8062 16.9583 17.0648C17.0551 17.3235 16.9238 17.6115 16.6652 17.7083C15.3771 18.19 13.8376 18.5 12 18.5C4.99863 18.5 2.38012 14.0548 1.71622 12.6199C1.53522 12.2277 1.53467 11.7851 1.71495 11.3928C2.00618 10.7462 2.69195 9.51659 3.962 8.3515C4.16549 8.16483 4.48178 8.17846 4.66845 8.38195Z'
                    fill='#6E7387'
                  />
                  <path
                    fillRule='evenodd'
                    clipRule='evenodd'
                    d='M12 6.49998C10.2776 6.49998 8.85713 6.79001 7.68517 7.2283C7.42653 7.32503 7.13844 7.19377 7.04171 6.93513C6.94498 6.67648 7.07624 6.38839 7.33488 6.29166C8.62292 5.80996 10.1624 5.49998 12 5.49998C19.0014 5.49998 21.6199 9.94515 22.2838 11.38C22.4651 11.7727 22.4654 12.216 22.2843 12.6088C21.9947 13.2415 21.3307 14.4395 20.0926 15.6042C19.8915 15.7934 19.575 15.7837 19.3858 15.5826C19.1966 15.3814 19.2063 15.065 19.4074 14.8758C20.5289 13.8209 21.1248 12.7394 21.3754 12.1919L21.3761 12.1905C21.4347 12.0634 21.4347 11.9266 21.3761 11.7995C20.8 10.5544 18.4587 6.49998 12 6.49998Z'
                    fill='#6E7387'
                  />
                  <path
                    fillRule='evenodd'
                    clipRule='evenodd'
                    d='M1.5904 4.71325C1.74876 4.48703 2.06052 4.43201 2.28675 4.59037L22.2868 18.5904C22.513 18.7487 22.568 19.0605 22.4096 19.2867C22.2513 19.5129 21.9395 19.568 21.7133 19.4096L1.71329 5.4096C1.48706 5.25124 1.43204 4.93948 1.5904 4.71325Z'
                    fill='#6E7387'
                  />
                </svg>
              )}
            </button>
          )}
          {inputValue && (
            <button
              type='button'
              onClick={handleDeleteClick}
              className='absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700'
              aria-label='Clear input'
            >
              <svg
                xmlns='http://www.w3.org/2000/svg'
                width='24'
                height='24'
                viewBox='0 0 24 24'
                fill='none'
              >
                <path
                  fillRule='evenodd'
                  clipRule='evenodd'
                  d='M12 20C7.58172 20 4 16.4183 4 12C4 7.58172 7.58172 4 12 4C16.4183 4 20 7.58172 20 12C20 16.4183 16.4183 20 12 20ZM8.14646 8.14645C8.34172 7.95118 8.65831 7.95118 8.85357 8.14645L12 11.2929L15.1464 8.14652C15.3417 7.95126 15.6583 7.95126 15.8536 8.14652C16.0488 8.34178 16.0488 8.65837 15.8536 8.85363L12.7072 12L15.8536 15.1464C16.0488 15.3417 16.0488 15.6583 15.8536 15.8536C15.6583 16.0488 15.3417 16.0488 15.1465 15.8536L12 12.7071L8.85355 15.8536C8.65829 16.0489 8.34171 16.0489 8.14645 15.8536C7.95118 15.6584 7.95118 15.3418 8.14645 15.1465L11.2929 12L8.14646 8.85355C7.9512 8.65829 7.9512 8.34171 8.14646 8.14645Z'
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
