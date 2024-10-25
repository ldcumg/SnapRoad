'use client';

import { useMakeGroupForm } from '@/hooks/byUse/useGroupForm';
import { useInsertGroupMutation, useInsertUserGroupMutation } from '@/hooks/queries/byUse/useGroupMutations';
import { makeGroupDataToObj, makeUserGroupDataToObj } from '@/services/groupServices';
import browserClient from '@/utils/supabase/client';
import { useEffect, useState } from 'react';
import { FieldValues } from 'react-hook-form';

const MakeGroupPage = () => {
  const { register, handleSubmit, formState, watch } = useMakeGroupForm();
  const [imgPreview, setImgPreview] = useState<string | null>(null);

  const { isError: insertGroupDataError, mutateAsync: insertGroupDataMutate } = useInsertGroupMutation();
  const { isError: insertUserGroupError, mutate: insertUserGroupMutate } = useInsertUserGroupMutation();

  const onSubmit = async (value: FieldValues) => {
    //TODO - 파일 확장자 관련 유효성 검사 필요
    const imageFile: File | null = value.groupImg && value?.groupImg[0];
    const groupObj = makeGroupDataToObj(value);
    await insertGroupDataMutate({ groupObj, groupImg: imageFile });
    //TODO - user관련 store생성 후 userId 수정 필요
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
        redirectTo: window.origin + '/api/auth/callback',
      },
    });
  };
  const logout = async () => {
    await browserClient.auth.signOut();
  };

  const groupThumbnail = watch('groupImg') as FileList | null;
  useEffect(() => {
    if (groupThumbnail && groupThumbnail.length) {
      setImgPreview(URL.createObjectURL(groupThumbnail['0']));
    }
  }, [groupThumbnail]);

  if (insertGroupDataError || insertUserGroupError) throw new Error('에러 발생!');
  return (
    <div className='flex flex-col justify-center items-center gap-[20px] my-[20px] py-[10px]'>
      <button onClick={loginWithGithub}>깃허브테스트로그인</button>
      <button onClick={logout}>깃허브테스트로그아웃</button>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className='flex flex-col justify-center items-center gap-[30px]'
      >
        <div>
          <label htmlFor='group_image'>
            {imgPreview ? (
              <img
                src={imgPreview}
                alt='업로드 그룹 썸네일 이미지'
                className='flex justify-center items-center rounded-[20px] w-[200px] h-[267px] border-[2px] border-black border-solid'
              />
            ) : (
              <div className='flex justify-center items-center rounded-[20px] px-[5px] w-[200px] h-[267px] bg-[#e6e6e6] border-[5px] border-black border-dashed'>
                <p>그룹 이미지 첨부</p>
              </div>
            )}
          </label>
          <input
            type='file'
            id='group_image'
            accept='image/*'
            {...register('groupImg')}
          />
        </div>
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
