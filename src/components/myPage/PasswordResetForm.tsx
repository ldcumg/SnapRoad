'use client';

import { useResetPasswordForm } from '@/hooks/byUse/useAuthForm';
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
    await resetPassword(value.password);
    // alert('변경이 완료되었습니다.');

    router.push('/mypage');
  };

  return (
    <div className='flex flex-col'>
      <form
        onSubmit={handleSubmit(handleConfirmPasswords)}
        className='flex flex-col gap-10'
      >
        <div className='flex flex-col gap-4'>
          <Input
            label={'비밀번호'}
            type={'password'}
            placeholder={'비밀번호'}
            helperText={'문자,숫자,특수문자 포함 8자리 이상'}
            errorText={errors.password && String(errors.password.message)}
            {...register('password')}
          />

          <Input
            label={'비밀번호 확인'}
            type={'password'}
            placeholder={'비밀번호 확인'}
            errorText={errors.confirmPassword && String(errors.confirmPassword.message)}
            {...register('confirmPassword')}
          />
        </div>

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
