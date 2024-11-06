'use client';

import AgreeCheck from './AgreeList';
import AgreeList from './AgreeList';
import { useSignUpForm } from '@/hooks/byUse/useAuthForm';
import { useSignUp } from '@/hooks/queries/byUse/useAuthMutations';
import { signUpSchema } from '@/schemas/authSchemas';
import useBottomSheetStore from '@/stores/story/useBottomSheetStore';
import { AgreeBottomSheet } from '@/stories/AgreeBottomSheet';
// import { BottomSheet } from '@/stories/BottomSheet';
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

  /** 모달 밖 체크박스 상태 */
  const [isChecked, setIsChecked] = useState(false);

  /** 모달 안 체크박스 상태 */
  const [isCheckedInSheet, setIsCheckedInSheet] = useState(false);

  /** 폼 제출 핸들러 */
  const handleSignUp = async (value: FieldValues) => {
    signUp(signUpSchema.parse(value));
  };

  /** 완료 버튼 핸들러: 모달 안 상태를 모달 밖에 반영 */
  const handleComplete = () => {
    setIsChecked(isCheckedInSheet); // 모달 안 상태를 모달 밖 상태에 반영
    handleFullClose();
  };

  const handleCheckboxToggle = () => {
    setIsCheckedInSheet((prev) => {
      const newState = !prev;
      setIsChecked(newState); // 모달 밖 상태도 함께 업데이트
      return newState;
    });
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

        {/* 모달 밖 체크박스 UI */}
        <div
          className='flex justify-between'
          onClick={handleFullOpen}
        >
          <div className='flex items-center gap-4'>
            <img
              src={isChecked ? '/svgs/Check_box_active.svg' : '/svgs/Check_box.svg'}
              className='w-[24px] h-[24px]'
            />
            <span className='cursor-pointer text-black text-caption_bold_lg'>개인정보 수집·이용 약관 동의</span>
          </div>
          <img src='/svgs/Arrow_Forward_LG.svg' />
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

      {/* 모달 UI */}
      <AgreeBottomSheet
        isOpen={isFullHeightOpen}
        onClose={handleFullClose}
        title='개인정보 수집·이용 약관 동의'
        buttonLabel='완료'
        onButtonClick={handleComplete}
        height='full'
      >
        <div className='flex flex-col gap-4'>
          <div className='flex gap-3'>
            <img
              src={isCheckedInSheet ? '/svgs/Check_box_active.svg' : '/svgs/Check_box.svg'}
              className='w-[24px] h-[24px]'
              onClick={handleCheckboxToggle}
            />
            <AgreeList />
          </div>
          <div className='flex px-4 justify-center gap-2'>
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
      </AgreeBottomSheet>
    </div>
  );
};

export default SignUpForm;
