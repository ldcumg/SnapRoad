'use client';

import { useSignUpForm } from '@/hooks/byUse/useAuthForm';
import { useSignUp } from '@/hooks/queries/byUse/useAuthMutations';
import { signUpSchema } from '@/schemas/authSchemas';
import useBottomSheetStore from '@/stores/story/useBottomSheetStore';
import { BottomSheet } from '@/stories/BottomSheet';
import { Button } from '@/stories/Button';
import { Input } from '@/stories/Input';
import Link from 'next/link';
import React, { useState } from 'react';
import { FieldValues } from 'react-hook-form';

const SignUpForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useSignUpForm();

  const { mutate: signUp } = useSignUp();
  const { isFullHeightOpen, handleFullOpen, handleFullClose } = useBottomSheetStore();

  /** 체크박스 상태 */
  const [isChecked, setIsChecked] = useState(false);

  /** BottomSheet 내부 체크박스 상태 */
  const [isCheckedInSheet, setIsCheckedInSheet] = useState(false);

  /** 폼 제출 핸들러 */
  const handleSignUp = async (value: FieldValues) => {
    signUp(signUpSchema.parse(value));
  };

  /** 완료 버튼 핸들러
   * BottomSheet 체크박스 상태 메인 체크박스에 반영
   */
  const handleComplete = () => {
    setIsChecked(isCheckedInSheet);
    handleFullClose();
  };

  return (
    <div className='flex flex-col gap-6'>
      <form
        onSubmit={handleSubmit(handleSignUp)}
        className='flex flex-col gap-6'
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

          <Input
            label={'비밀번호 확인'}
            type={'password'}
            placeholder={'비밀번호 확인'}
            errorText={errors.confirmPassword && String(errors.confirmPassword.message)}
            {...register('confirmPassword')}
          />

          <Input
            label={'닉네임'}
            placeholder={'닉네임 입력'}
            helperText={'10자 내로 입력'}
            errorText={errors.nickname && String(errors.nickname.message)}
            {...register('nickname')}
          />
        </div>

        {/* TODO 약관 모달? */}
        <div>
          <input
            type='checkbox'
            checked={isChecked}
            onChange={(e) => setIsChecked(e.target.checked)}
          />
          <span
            onClick={handleFullOpen}
            className='cursor-pointer'
          >
            개인정보 수집·이용 약관 동의
          </span>
        </div>

        {/* TODO 버튼 활성화 */}
        <Button
          type='submit'
          label='회원가입'
          variant='primary'
        />
      </form>
      <div className='flex justify-center gap-2 text-gray-700 text-caption_bold_lg'>
        <span>이미 아이디가 있으신가요?</span>
        <Link href={'/login'}>로그인</Link>
      </div>

      <BottomSheet
        isOpen={isFullHeightOpen}
        onClose={handleFullClose}
        title='개인정보 수집·이용 약관 동의'
        buttonLabel='완료'
        onButtonClick={handleComplete}
        height='full'
      >
        <div className='flex flex-col gap-4'>
          <p>여기에 개인정보 수집·이용 약관 내용을 입력하세요.</p>
          <input
            type='checkbox'
            checked={isCheckedInSheet}
            onChange={(e) => setIsCheckedInSheet(e.target.checked)}
          />
          <span>개인정보 수집·이용 약관에 동의합니다.</span>
          <div className='flex gap-2'>
            <Button
              label='취소'
              onClick={handleFullClose}
            />
            <Button
              label='완료'
              onClick={handleComplete}
              disabled={!isCheckedInSheet} // 체크박스가 체크되어야 활성화
            />
          </div>
        </div>
      </BottomSheet>
    </div>
  );
};

export default SignUpForm;
