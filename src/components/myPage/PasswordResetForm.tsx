'use client';

import { useLoginForm } from '@/hooks/byUse/useAuthForm';
import { useResetPasswordForm } from '@/hooks/byUse/usePasswordResetForm';
import { Button } from '@/stories/Button';
import { Input } from '@/stories/Input';
import React, { useState } from 'react';

/** 이메일 링크를 통해 들어온 페이지 */
const PasswordResetForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useResetPasswordForm();

  const handleLogin = async (value: FieldValues) => {
    console.log('value :>> ', value);
  };

  return (
    <div className='flex flex-col'>
      <form
        onSubmit={handleSubmit(handleLogin)}
        className='flex flex-col gap-5 w-96'
      >
        <Input
          label={'새 비밀번호'}
          type={'password'}
          placeholder={'비밀번호'}
          {...register('password')}
        />
        {errors.password && <p className='text-red-500 text-sm pl-1'>{String(errors.password.message)}</p>}

        <Input
          label={'비밀번호 확인'}
          type={'password'}
          placeholder={'비밀번호'}
          {...register('confirmPassword')}
        />
        {errors.confirmPassword && (
          <p className='text-red-500 text-sm pl-1'>{String(errors.confirmPassword.message)}</p>
        )}
        <Button
          type='submit'
          label='변경하기'
          primary={true}
        />
      </form>
    </div>
  );
};

export default PasswordResetForm;
