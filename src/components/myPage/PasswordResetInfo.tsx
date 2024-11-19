'use client';

import { useSendEmailForm } from '@/hooks/useCustomForm/useAuthForm';
import { sendEmailResetPassword } from '@/services/client-action/authClientAction';
import { Button } from '@/stories/Button';
import { Input } from '@/stories/Input';
import React, { useState } from 'react';
import { FieldValues } from 'react-hook-form';

const PasswordResetInfo = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useSendEmailForm();

  const [success, setSuccess] = useState<boolean>(false);

  const handleSendEmailResetPassword = async (value: FieldValues) => {
    try {
      await sendEmailResetPassword(value.email);
      setSuccess(true);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className='m-auto flex w-full max-w-[23rem] flex-col'>
      <form onSubmit={handleSubmit(handleSendEmailResetPassword)}>
        <Input
          label={'이메일 주소'}
          placeholder={'이메일 주소 입력'}
          errorText={errors.email && String(errors.email.message)}
          {...register('email')}
        />
        <div className='mt-1 text-sm'>{success && <span>이메일을 확인하세요!</span>}</div>
        <div className='mt-10 flex flex-col'>
          <Button
            type='submit'
            label='재설정 링크 전송하기'
            variant='primary'
          />
        </div>
      </form>
    </div>
  );
};

export default PasswordResetInfo;
