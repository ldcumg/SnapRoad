import { cn } from '@/lib/utils';
import React, { useState, forwardRef } from 'react';

type TextAreaWithCounterProps = {
  id: string;
  placeholder?: string;
  maxLength: number;
  className?: string;
  onChange?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  errorText?: string;
  showError?: boolean;
  variant?: 'danger' | 'default';
};

const TextAreaWithCounter = forwardRef<HTMLTextAreaElement, TextAreaWithCounterProps>(
  (
    {
      id,
      placeholder = '',
      maxLength,
      className = '',
      onChange,
      errorText,
      showError = false,
      variant = 'default',
      ...props
    },
    ref,
  ) => {
    const [text, setText] = useState('');

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      setText(e.target.value);
      if (onChange) onChange(e);
    };

    return (
      <fieldset>
        <div className='relative flex w-full flex-col'>
          <textarea
            ref={ref}
            id={id}
            value={text}
            onChange={handleChange}
            className={cn(
              'text-body-md h-[140px] w-full resize-none rounded-xl border border-solid border-gray-100 bg-white p-3 text-gray-900 outline-none placeholder:text-gray-400',
              className,
              variant === 'danger' && 'text-danger',
            )}
            placeholder={placeholder}
            maxLength={maxLength}
            {...props}
          />
          <p className='absolute bottom-3 right-3 text-gray-300'>
            {text.length}/{maxLength}
          </p>
        </div>
        {!text && errorText ? (
          <p className='mt-1 text-sm text-danger'>{errorText}</p>
        ) : (
          showError && <p className='mt-1 text-sm text-gray-500'>{errorText}</p>
        )}
      </fieldset>
    );
  },
);

TextAreaWithCounter.displayName = 'TextAreaWithCounter';

export default TextAreaWithCounter;
