'use client';

import AgreeList from './AgreeList';
import useMediaQuery from '@/hooks/byUse/useMediaQuery';
import { useSignUp } from '@/hooks/queries/auth/useAuthMutations';
import { useSignUpForm } from '@/hooks/useCustomForm/useAuthForm';
import { signUpSchema } from '@/schemas/authSchemas';
import useBottomSheetStore from '@/stores/story/useBottomSheetStore';
import { BottomSheet } from '@/stories/BottomSheet';
import { Button } from '@/stories/Button';
import { Input } from '@/stories/Input';
import Link from 'next/link';
import React, { useEffect, useMemo, useState } from 'react';
import { FieldValues } from 'react-hook-form';

const SignUpForm = () => {
  const isDesktop = useMediaQuery('(min-width: 1200px)');
  const [desktop, setDesktop] = useState(false);

  useEffect(() => {
    setDesktop(isDesktop);
  }, [isDesktop]);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useSignUpForm();

  const { mutate: signUp, isError, isPending } = useSignUp();

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

  // 모든 필드 값 감시
  const email = watch('email');
  const password = watch('password');
  const confirmPassword = watch('confirmPassword');
  const nickname = watch('nickname');

  // 모든 필드가 비어있지 않은지 확인
  const isFormFilled = useMemo(() => {
    return email && password && confirmPassword && nickname;
  }, [email, password, confirmPassword, nickname]);

  if (isError) throw new Error('회원가입 에러 발생');

  return (
    <div className='m-auto flex w-full max-w-[23rem] flex-col gap-6'>
      <form
        onSubmit={handleSubmit(handleSignUp)}
        className='flex flex-col gap-6'
      >
        <div className='flex flex-col gap-4'>
          <Input
            label={'이메일 주소'}
            isRequired={true}
            placeholder={'이메일 주소 입력'}
            errorText={errors.email && String(errors.email.message)}
            {...register('email')}
          />

          <Input
            label={'비밀번호'}
            isRequired={true}
            type={'password'}
            placeholder={'비밀번호'}
            helperText={'문자,숫자,특수문자 포함 8자리 이상'}
            errorText={errors.password && String(errors.password.message)}
            {...register('password')}
          />

          <Input
            label={'비밀번호 확인'}
            isRequired={true}
            type={'password'}
            placeholder={'비밀번호 확인'}
            errorText={errors.confirmPassword && String(errors.confirmPassword.message)}
            {...register('confirmPassword')}
          />

          <Input
            label={'닉네임'}
            isRequired={true}
            placeholder={'닉네임 입력'}
            helperText={'10자 내로 입력'}
            errorText={errors.nickname && String(errors.nickname.message)}
            {...register('nickname')}
          />
        </div>

        {/* 모달 밖 체크박스 UI */}
        <div
          className='flex justify-between'
          // onClick={handleFullOpen}
        >
          <div className='flex items-center gap-4'>
            <img
              src={isChecked ? '/svgs/Check_box_active.svg' : '/svgs/Check_box.svg'}
              className='h-[24px] w-[24px]'
              onClick={handleCheckboxToggle}
            />
            <span className='text-caption_bold_lg text-black'>개인정보 수집·이용 약관 동의</span>
          </div>
          <img
            src='/svgs/Arrow_Forward_LG.svg'
            className='cursor-pointer'
            onClick={handleFullOpen}
          />
        </div>

        <Button
          type='submit'
          label='회원가입'
          size='large'
          variant='primary'
          disabled={!isChecked || !isFormFilled || Object.keys(errors).length > 0} // 수정된 부분
          loading={isPending}
        />
      </form>
      <div className='flex justify-center gap-2 text-caption_bold_lg text-gray-700'>
        <span>이미 아이디가 있으신가요?</span>
        <Link
          href={'/login'}
          className='underline'
        >
          로그인
        </Link>
      </div>

      <BottomSheet
        hasButton={false}
        isOpen={isFullHeightOpen}
        onClose={handleFullClose}
        // onConfirm={handleComplete} // 완료 버튼을 누르면 바텀시트 닫고 외부 체크박스 상태 반영
        title='개인정보 수집·이용 약관 동의'
        height='full'
        // confirmLabel='완료'
        // cancelLabel='취소'
        showCloseButton={false}
        className={desktop ? 'px-96' : ''}
      >
        <div className='flex flex-col gap-4'>
          <div className='flex gap-3'>
            {/* <img
              src={isCheckedInSheet ? '/svgs/Check_box_active.svg' : '/svgs/Check_box.svg'}
              className='h-[24px] w-[24px]'
              onClick={handleCheckboxToggle}
            /> */}
            <AgreeList />
          </div>
        </div>
      </BottomSheet>
    </div>
  );
};

export default SignUpForm;
