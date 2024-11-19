import { useInsertUserGroupMutation } from '@/hooks/queries/byUse/useGroupMutations';
import { useInviteGroupForm } from '@/hooks/useCustomForm/useGroupForm';
import { makeUserGroupDataToObj } from '@/services/groupServices';
import { Button } from '@/stories/Button';
import browserClient from '@/utils/supabase/client';
import { FieldValues, useFormState } from 'react-hook-form';

type Props = {
  isDesktop?: boolean;
};

const SubmitInviteForm = ({ isDesktop }: Props) => {
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
      className={`z-50 mt-14 flex flex-col items-center justify-center gap-5 rounded-t-[20px] bg-white pc:z-0 pc:mt-0 pc:flex-row`}
    >
      <div className='flex w-full flex-col items-start gap-1 pc:flex-row pc:items-center'>
        <h3
          className={`text-label_sm ${isValid ? 'text-primary-400' : 'text-gray-900'} text-center pc:h-8 pc:w-[132px] pc:text-head_sm`}
        >
          초대코드 입력
        </h3>
        <div
          className={`flex w-full flex-row border border-solid pc:w-auto pc:gap-3 pc:px-4 pc:py-2 ${isValid ? 'border-primary-400' : 'border-gray-100'} rounded-xl px-3 py-4`}
        >
          <input
            type='text'
            className='w-full rounded-xl bg-white outline-none focus:outline-none pc:min-w-[330px]'
            placeholder='코드를 입력해주세요'
            {...register('inviteCode')}
          />
          {isDesktop ? (
            <Button
              type='submit'
              label='가입'
              variant='primary'
              size='small'
              disabled={!isValid}
            />
          ) : (
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
          )}
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
        className='w-full pc:hidden'
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
