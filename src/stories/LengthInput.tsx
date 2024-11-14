'use client';

import { IconCloseCircle } from '@/lib/icon/Icon_Close_Circle';
import { FieldValues, Path, UseFormRegister } from 'react-hook-form';

type Props<T extends FieldValues> = {
  register: UseFormRegister<T>;
  name: Path<T>;
  clearInputValue: (e: React.MouseEvent<HTMLButtonElement>) => void;
  placeholder?: string;
  curLength: number;
  maxLength: number;
};

/**
 * @prop {UseFormRegister<T>} register react-hook-form register
 * @prop {string} name react-hook-form register name ex) register('groupTitle')
 * @prop {Function} clearInputValue input clear함수
 * @prop {string} placeholder placeholder
 * @prop {number} curLength 현재 텍스트 길이
 * @prop {number} maxLength 최대 텍스트 길이
 * @returns LengthInput Component
 */
const LengthInput = <T extends FieldValues>({
  register,
  name,
  clearInputValue,
  placeholder,
  curLength,
  maxLength,
}: Props<T>) => {
  return (
    <div className='flex w-full flex-row border-b border-solid border-gray-100 py-4'>
      <input
        id={name}
        className='w-full text-body_lg text-gray-900 outline-none placeholder:text-gray-400'
        {...register(name)}
        type='text'
        placeholder={placeholder}
        maxLength={maxLength}
      />
      <div className='flex flex-row items-center gap-2'>
        {curLength > 0 && (
          <button
            className='h-6 w-6'
            type='button'
            onClick={clearInputValue}
          >
            <IconCloseCircle />
          </button>
        )}
        <p
          className={`flex items-center justify-center ${curLength ? 'text-gray-900' : 'text-gray-300'} text-[#bdbdbd]`}
        >
          {curLength}/{maxLength}
        </p>
      </div>
    </div>
  );
};

export default LengthInput;
