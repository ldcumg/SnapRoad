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

  const { mutate: login } = useLogin();

  const handleLogin = async (value: FieldValues) => {
    login(loginSchema.parse(value));
  };

  return (
    <div>
      <form
        onSubmit={handleSubmit(handleLogin)}
        className='flex flex-col w-96 gap-5'
      >
        <div>
          <Input
            label={'Email'}
            placeholder={'이메일'}
            {...register('email')}
          />
          {errors.email && <p className='text-danger text-sm pl-1'>{String(errors.email.message)}</p>}
        </div>

        <div>
          <Input
            label={'비밀번호'}
            type={'password'}
            placeholder={'비밀번호'}
            {...register('password')}
          />
          {errors.password && <p className='text-danger text-sm pl-1'>{String(errors.password.message)}</p>}
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
