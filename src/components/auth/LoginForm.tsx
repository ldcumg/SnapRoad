'use client';

import { useLogin } from '@/hooks/queries/auth/useAuthMutations';
import { useLoginForm } from '@/hooks/useCustomForm/useAuthForm';
import { loginSchema } from '@/schemas/authSchemas';
import { Button } from '@/stories/Button';
import { Input } from '@/stories/Input';
import React from 'react';
import { FieldValues } from 'react-hook-form';

const LoginForm = () => {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useLoginForm();

  const email = watch('email');
  const password = watch('password');

  const { mutate: login, isError, isPending } = useLogin();

  const handleLogin = async (value: FieldValues) => {
    login(loginSchema.parse(value));
  };

  if (isError) throw new Error('로그인 에러 발생');

  return (
    <div className='m-auto w-full max-w-[23rem]'>
      <form
        onSubmit={handleSubmit(handleLogin)}
        className='flex flex-col gap-8'
      >
        <div className='flex flex-col gap-4'>
          <Input
            label={'이메일 주소'}
            placeholder={'이메일 주소 입력'}
            errorText={errors.email && String(errors.email.message)}
            {...register('email')}
          />
          <Input
            label={'비밀번호'}
            type={'password'}
            placeholder={'비밀번호'}
            helperText={'문자,숫자,특수문자 포함 8자리 이상'}
            errorText={errors.password && String(errors.password.message)}
            {...register('password')}
          />
        </div>
        <Button
          type='submit'
          label='로그인'
          variant='primary'
          loading={isPending}
          disabled={!(email && password && !errors.email && !errors.password)}
        />
      </form>
    </div>
  );
};

export default LoginForm;
