// import React from 'react'
// import { cn } from '@/lib/utils'
// import './input.css'
// export interface InputProps {
//   /** Label for the input */
//   label: string
//   /** Placeholder text for the input */
//   placeholder?: string
//   /** Is the input disabled? */
//   disabled?: boolean
//   /** How large should the input be? */
//   size?: 'small' | 'medium' | 'large'
//   /** Background color for the input */
//   backgroundColor?: string
//   /** Optional change handler */
//   onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void
// }
// /** Primary UI component for user interaction */
// export const Input = ({ label, placeholder = '', disabled = false, size = 'medium', backgroundColor, ...props }: InputProps) => {
//   return (
//     <div className={cn('storybook-input', `storybook-input--${size}`)} style={{ marginBottom: '16px' }}>
//       <label className="storybook-input__label !text-fuchsia-700" style={{ marginBottom: '8px' }}>
//         {label}
//       </label>
//       <input
//         type="text"
//         placeholder={placeholder}
//         disabled={disabled}
//         className={cn('storybook-input__field', {
//           'storybook-input__field--disabled': disabled
//         })}
//         style={{ backgroundColor }}
//         {...props}
//       />
//     </div>
//   )
// }
import { cn } from '@/lib/utils';
import React, { forwardRef } from 'react';

export interface InputProps {
  type?: string;
  /** Label for the input */
  label: string;
  /** Placeholder text for the input */
  placeholder?: string;
  /** Is the input disabled? */
  disabled?: boolean;
  /** How large should the input be? */
  size?: 'small' | 'medium' | 'large';
  /** Background color for the input */
  backgroundColor?: string;
  /** Optional change handler */
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

/** Primary UI component for user interaction */
export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ type, label, placeholder = '', disabled = false, size = 'medium', backgroundColor, ...props }, ref) => {
    const sizeClasses = {
      small: 'py-1 px-2 text-sm',
      medium: 'py-2 px-3 text-base',
      large: 'py-3 px-4 text-lg',
    };

    return (
      <div className='mb-4'>
        <label className='block text-fuchsia-700 font-bold mb-2'>{label}</label>
        <input
          ref={ref}
          type={type}
          placeholder={placeholder}
          disabled={disabled}
          className={cn(
            'border rounded-md w-full',
            sizeClasses[size],
            'focus:outline-none focus:ring-2 focus:ring-fuchsia-500 focus:border-transparent',
            disabled ? 'bg-gray-200 cursor-not-allowed' : 'bg-white',
          )}
          style={{ backgroundColor }}
          {...props}
        />
      </div>
    );
  },
);

// Input.displayName = 'Input';
