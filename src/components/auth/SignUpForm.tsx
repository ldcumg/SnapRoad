'use client';

import { useSignUpForm } from '@/hooks/byUse/useAuthForm';
import { useSignUp } from '@/hooks/queries/byUse/useAuthMutations';
import { signUpSchema } from '@/schemas/authSchemas';
import { Button } from '@/stories/Button';
import { Input } from '@/stories/Input';
import Link from 'next/link';
import React from 'react';
import { FieldValues } from 'react-hook-form';

const SignUpForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useSignUpForm();

  const { mutate: signUp } = useSignUp();

  const handleSignUp = async (value: FieldValues) => {
    signUp(signUpSchema.parse(value));
  };

  return (
    <div>
      <div>로고 영역</div>
      <h2>회원가입</h2>
      <form
        onSubmit={handleSubmit(handleSignUp)}
        className='flex flex-col gap-5 w-96'
      >
        <Input
          label={'Email'}
          placeholder={'이메일'}
          {...register('email')}
        />
        {errors.email && <p className='text-red-500 text-sm pl-1'>{String(errors.email.message)}</p>}

        <Input
          label={'비밀번호'}
          type={'password'}
          placeholder={'비밀번호'}
          {...register('password')}
        />
        {errors.password && <p className='text-red-500 text-sm pl-1'>{String(errors.password.message)}</p>}

        <Input
          label={'nickname'}
          placeholder={'닉네임'}
          {...register('nickname')}
        />
        {errors.nickname && <p className='text-red-500 text-sm pl-1'>{String(errors.nickname.message)}</p>}

        <Button
          type='submit'
          label='회원가입'
          primary={true}
        />
      </form>
      <p>
        이미 아이디가 있으신가요? <Link href={'/login'}>로그인</Link>
      </p>
    </div>
  );
};

export default SignUpForm;
