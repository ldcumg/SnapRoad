'use client';

import { useLoginForm } from '@/hooks/byUse/useAuthForm';
import { useLogin } from '@/hooks/queries/byUse/useAuthMutations';
import { loginSchema } from '@/schemas/authSchemas';
import { signInWithGithub, signInWithGoogle, signInWithKakao } from '@/services/client-action/socialAuthAction';
import { Button } from '@/stories/Button';
import { Input } from '@/stories/Input';
import Link from 'next/link';
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
      <div>로고 영역</div>
      <form
        onSubmit={handleSubmit(handleLogin)}
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

        <Button
          type='submit'
          label='로그인'
          primary={true}
        />
      </form>
      <p>소셜 계정으로 로그인</p>
      <div className='flex flex-col'>
        <button
          type='button'
          onClick={signInWithKakao}
        >
          카카오 로그인
        </button>
        <button
          onClick={signInWithGoogle}
          type='button'
        >
          구글 로그인
        </button>
        <button
          onClick={signInWithGithub}
          type='button'
        >
          깃허브 로그인
        </button>
      </div>
      <div className='flex'>
        <Link href={'/mypage/password-reset'}>비밀번호 찾기</Link>
        <Link href={'/signup'}>회원가입</Link>
      </div>
    </div>
  );
};

export default LoginForm;
