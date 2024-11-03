import { useInviteGroupForm } from '@/hooks/byUse/useGroupForm';
import { useInsertUserGroupMutation } from '@/hooks/queries/byUse/useGroupMutations';
import { makeUserGroupDataToObj } from '@/services/groupServices';
import { Button } from '@/stories/Button';
import browserClient from '@/utils/supabase/client';
import React, { MouseEvent } from 'react';
import { FieldValues, useFormState } from 'react-hook-form';

type Props = {
  isBottomSheetOpen: boolean;
  handleBottomSheetOpen: () => void;
};

const SubmitInviteForm = ({ isBottomSheetOpen, handleBottomSheetOpen }: Props) => {
  const { isError: insertUserGroupError, mutate: insertUserGroupMutate } = useInsertUserGroupMutation();
  const { register, handleSubmit, formState, control, setValue, clearErrors } = useInviteGroupForm();

  const onSubmit = async (value: FieldValues) => {
    const { data } = await browserClient.auth.getUser();
    if (data.user?.id) {
      const userId = data.user.id;
      //NOTE - 유저가 이미 해당 그룹에 속해있는지 검사
      const { data: existingMember } = await browserClient.rpc('check_user_membership', {
        input_invite_code: value.inviteCode,
        input_user_id: userId,
      });
      if (!existingMember) {
        alert('현재 가입할수 없습니다! 잠시후 재시도해주세요.');
        return;
      }
      const { returned_group_id, is_member } = existingMember[0];
      if (!returned_group_id) {
        alert('초대코드를 다시 확인해주세요!');
        return;
      }
      if (is_member) {
        alert('이미 속해있는 그룹입니다.');
        return;
      }
      const userGroupObj = makeUserGroupDataToObj(userId, false, returned_group_id);
      insertUserGroupMutate(userGroupObj);
    }
  };

  const { isValid } = useFormState({ control });

  const clearInputValue = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    setValue('inviteCode', '');
    clearErrors('inviteCode');
  };
  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className={`${isBottomSheetOpen ? 'flex' : 'hidden'} flex-col justify-center items-center z-50 bg-white gap-5 rounded-t-[20px] mt-14`}
    >
      <div className='flex flex-col items-start w-full gap-1'>
        <h3 className='text-label_sm text-gray-900'>초대코드 입력</h3>
        <div className='flex flex-row w-full border border-solid border-gray-100 rounded-xl py-4 px-3'>
          <input
            type='text'
            className=' bg-white w-full outline-none focus:outline-none rounded-xl'
            placeholder='코드를 입력해주세요'
            {...register('inviteCode')}
          />
          <button
            className=''
            type='button'
            onClick={clearInputValue}
          >
            <img
              src='/svgs/Close_Circle.svg'
              alt=''
            />
          </button>
        </div>
        {/* {formState.errors.inviteCode && (
          <p className='text-[12px] text-red-600'>{formState.errors.inviteCode.message}</p>
        )} */}
      </div>
      <Button
        type='submit'
        label='그룹 추가하기'
        variant='primary'
        size='large'
        className='w-full'
        disabled={!isValid}
      >
        <img
          src='/svgs/Plus_LG.svg'
          alt=''
        />
      </Button>
    </form>
  );
};

export default SubmitInviteForm;
