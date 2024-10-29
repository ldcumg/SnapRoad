import { useInviteGroupForm } from '@/hooks/byUse/useGroupForm';
import { useInsertUserGroupMutation } from '@/hooks/queries/byUse/useGroupMutations';
import { makeUserGroupDataToObj } from '@/services/groupServices';
import browserClient from '@/utils/supabase/client';
import { FieldValues } from 'react-hook-form';

type Props = {
  isBottomSheetOpen: boolean;
  handleBottomSheetOpen: () => void;
};

const SubmitInviteForm = ({ isBottomSheetOpen, handleBottomSheetOpen }: Props) => {
  const { isError: insertUserGroupError, mutate: insertUserGroupMutate } = useInsertUserGroupMutation();
  const { register, handleSubmit, formState } = useInviteGroupForm();

  const onSubmit = async (value: FieldValues) => {
    const { data } = await browserClient.auth.getUser();
    if (data.user?.id) {
      const userId = data.user.id;
      //NOTE - 유저가 이미 해당 그룹에 속해있는지 검사 / 체크도 tanstack query로 관리해야하나? 의미가 있을지 의문
      const { data: existingMember } = await browserClient.rpc('check_user_membership', {
        input_invite_code: value.inviteCode,
        input_user_id: userId,
      });
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

  return (
    <div
      className={`${
        isBottomSheetOpen ? 'flex' : 'hidden'
      } fixed z-10 top-0 left-0 w-full h-full justify-center items-center bg-[#c5c5c5] bg-opacity-30`}
    >
      {/* NOTE - 바텀시트 배경 */}
      <div
        className='absolute top-0 left-0 z-20 w-full h-full'
        onClick={handleBottomSheetOpen}
      ></div>

      {/* NOTE - 바텀시트 본문 */}
      <form
        onSubmit={handleSubmit(onSubmit)}
        className={`${isBottomSheetOpen ? 'flex' : 'hidden'} flex-col justify-center items-center z-50 fixed bottom-0 bg-white py-[50px] gap-[20px] rounded-t-[20px]`}
      >
        {/* NOTE - 바텀시트 본문 - 닫기 버튼 */}
        <div className='flex justify-end items-center w-full px-[20px]'>
          <button
            className='w-[15px] h-[15px]'
            onClick={handleBottomSheetOpen}
          >
            <img
              src='/assets/modalCloseButton.png'
              alt='X'
            />
          </button>
        </div>
        {/* NOTE - 바텀시트 본문 - 입력 메인 */}
        <h3>초대코드 입력하기</h3>
        <input
          type='text'
          {...register('inviteCode')}
        />
        {formState.errors.inviteCode && <p>{formState.errors.inviteCode.message}</p>}
        <button
          type='submit'
          className='border border-solid border-black p-[10px] w-screen z-10'
        >
          그룹 추가하기
        </button>
      </form>
    </div>
  );
};

export default SubmitInviteForm;
