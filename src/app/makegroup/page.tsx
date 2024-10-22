'use client';

import { useMakeGroupForm } from '@/hooks/byUse/useGroupForm';
import { useInsertGroupMutation, useInsertUserGroupMutation } from '@/hooks/queries/byUse/useGroupMutations';
import { makeGroupDataToObj, makeUserGroupDataToObj } from '@/services/groupServices';
import browserClient from '@/utils/supabase/client';
import { FieldValues } from 'react-hook-form';

const MakeGroupPage = () => {
  const { register, handleSubmit, formState } = useMakeGroupForm();

  const { isError: insertGroupDataError, mutateAsync: insertGroupDataMutate } = useInsertGroupMutation();
  const { isError: insertUserGroupError, mutate: insertUserGroupMutate } = useInsertUserGroupMutation();

  const onSubmit = async (value: FieldValues) => {
    const groupObj = makeGroupDataToObj(value);
    await insertGroupDataMutate(groupObj);
    //NOTE - user관련 store생성 후 userId 수정 필요
    const { data } = await browserClient.auth.getUser();
    if (data.user?.id) {
      const userGroupObj = makeUserGroupDataToObj(data.user?.id, true, groupObj.group_id);
      insertUserGroupMutate(userGroupObj);
    }
  };

  const loginWithGithub = async () => {
    await browserClient.auth.signInWithOAuth({
      provider: 'github',
      options: {
        redirectTo: window.origin + '/auth/callback',
      },
    });
  };
  const logout = async () => {
    await browserClient.auth.signOut();
  };

  if (insertGroupDataError || insertUserGroupError) throw new Error('에러 발생!');
  return (
    <div className='flex flex-col justify-center items-center gap-[20px] my-[20px] py-[10px]'>
      <button onClick={loginWithGithub}>깃허브테스트로그인</button>
      <button onClick={logout}>깃허브테스트로그아웃</button>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className='flex flex-col justify-center items-center gap-[30px]'
      >
        <div className='p-[10px] border border-solid border-black w-[500px]'>
          <label htmlFor='group_title'>그룹명</label>
          <input
            id='group_title'
            {...register('groupTitle')}
            type='text'
            placeholder='그룹명'
          />
          {formState.errors.groupTitle && <p>{formState.errors.groupTitle.message}</p>}
        </div>
        <div className='p-[10px] border border-solid border-black w-[500px]'>
          <label htmlFor='group_desc'>그룹상세내용</label>
          <input
            id='group_desc'
            {...register('groupDesc')}
            type='text'
            placeholder='그룹정보'
          />
          {formState.errors.groupDesc && <p>{formState.errors.groupDesc.message}</p>}
        </div>
        <button
          className='cursor-pointer hover:bg-slate-300 p-[10px]'
          type='submit'
        >
          그룹 생성
        </button>
      </form>
    </div>
  );
};

export default MakeGroupPage;
