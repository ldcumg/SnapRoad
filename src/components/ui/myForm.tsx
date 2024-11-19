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
    formState: { errors },
  } = useLoginForm();

  const { mutate: login } = useLogin();

  const handleLogin = async (value: FieldValues) => {
    login(loginSchema.parse(value));
  };

  return (
    <div>
      <form
        onSubmit={handleSubmit(handleLogin)}
        className='flex w-96 flex-col gap-5'
      >
        <div>
          <Input
            label={'Email'}
            placeholder={'이메일'}
            {...register('email')}
          />
          {errors.email && <p className='pl-1 text-sm text-danger'>{String(errors.email.message)}</p>}
        </div>

        <div>
          <Input
            label={'비밀번호'}
            type={'password'}
            placeholder={'비밀번호'}
            {...register('password')}
          />
          {errors.password && <p className='pl-1 text-sm text-danger'>{String(errors.password.message)}</p>}
        </div>

        <div>
          <Button
            type='submit'
            label='로그인'
            variant='primary'
          />
        </div>
      </form>
    </div>
  );
};

export default LoginForm;
