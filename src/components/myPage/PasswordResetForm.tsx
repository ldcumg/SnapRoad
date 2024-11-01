'use client';

import { useResetPasswordForm } from '@/hooks/byUse/usePasswordResetForm';
import { resetPassword } from '@/services/server-action/authActions';
import { Button } from '@/stories/Button';
import { Input } from '@/stories/Input';
import { useRouter } from 'next/navigation';
import React from 'react';
import { FieldValues } from 'react-hook-form';

/** 이메일 링크를 통해 들어온 페이지 */
const PasswordResetForm = () => {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useResetPasswordForm();

  const handleConfirmPasswords = async (value: FieldValues) => {
    const data = await resetPassword(value.password);
    alert('변경이 완료되었습니다.');

    router.push('/mypage');
  };

  return (
    <div className='flex flex-col'>
      <form
        onSubmit={handleSubmit(handleConfirmPasswords)}
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
          variant='primary'
        />
      </form>
    </div>
  );
};

export default PasswordResetForm;
