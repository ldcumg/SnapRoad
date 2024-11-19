'use client';

import type { GroupInfo } from '@/types/groupTypes';
import { toast } from 'garlic-toast';

type Props = {
  groupInfo: GroupInfo;
};

const MemberList = ({ groupInfo: { user_group, group_invite_code } }: Props) => {
  const copyInvitationCode = () => {
    window.navigator.clipboard.writeText(group_invite_code).then(() => {
      toast.alert('초대 코드를 복사했어요!', {
        position: 'b-c',
        autoClose: true,
      });
    });
  };

  return (
    <>
      <div className='flex flex-row justify-between p-[16px] pc:mx-auto pc:my-[40px] pc:w-[1194px] pc:flex-col pc:items-center pc:gap-[24px]'>
        <h2 className='text-title_xl pc:text-head_sm'>그룹 멤버</h2>
        <button
          className='flex items-center gap-[8px] rounded border border-black px-[16px] py-[8px] pc:px-[20px] pc:py-[12px]'
          onClick={copyInvitationCode}
        >
          <img src='/svgs/User_Plus.svg' />
          <span className='text-label_sm text-gray-700'>초대코드 복사</span>
        </button>
      </div>
      <ol className='flex flex-col justify-center gap-[24px] p-[16px] pc:mx-auto pc:grid pc:w-[1194px] pc:grid-cols-3 pc:gap-x-[30px] pc:gap-y-[60px] pc:p-0'>
        {user_group
          .sort((a, b) => {
            if (a.is_owner === b.is_owner) return 0;
            return a.is_owner ? -1 : 1;
          })
          .map(({ is_owner, profiles: { user_image_url, user_nickname, user_email } }) => (
            <li
              className='flex flex-row items-center gap-[8px] pc:gap-[12px] pc:px-[20px]'
              key={user_email}
            >
              <img
                className='h-[40px] w-[40px] rounded-full pc:h-[52px] pc:w-[52px]'
                src={user_image_url ?? '/svgs/Profile.svg'}
                alt='프로필 이미지'
              />
              <div className='flex gap-[8px] pc:gap-[12px]'>
                <span className='rounded-xl bg-gray-50 px-[8px] py-[4px] text-caption_light_md text-gray-500 pc:text-caption_light_lg'>
                  {is_owner ? '그룹장' : '멤버'}
                </span>
                <div className='flex items-center gap-[4px]'>
                  <span className='text-caption_bold_lg text-gray-700 pc:text-label_sm'>{user_nickname}</span>
                  <span className='text-caption_light_md text-gray-500 pc:text-caption_light_lg'>{user_email}</span>
                </div>
              </div>
            </li>
          ))}
      </ol>
    </>
  );
};

export default MemberList;
