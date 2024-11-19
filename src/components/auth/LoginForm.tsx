'use client';

import { useLoginForm } from '@/hooks/byUse/useAuthForm';
import { useLogin } from '@/hooks/queries/byUse/useAuthMutations';
import { loginSchema } from '@/schemas/authSchemas';
import { Button } from '@/stories/Button';
import { Input } from '@/stories/Input';
import React from 'react';
import { FieldValues } from 'react-hook-form';

const LoginForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useLoginForm();

  const { mutate: login, isError } = useLogin();

  const handleLogin = async (value: FieldValues) => {
    login(loginSchema.parse(value));
  };

  if (isError) throw new Error('로그인 에러 발생');

  return (
    <div className='md:m-auto md:w-full md:max-w-[50%]'>
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
        />
      </form>
    </div>
  );
};

export default LoginForm;
