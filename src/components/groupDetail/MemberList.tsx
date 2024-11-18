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
      <div className='flex flex-row justify-between p-4'>
        <h2 className='text-title_xl'>그룹 멤버</h2>
        <button
          className='flex items-center gap-2 rounded border border-black px-4 py-2'
          onClick={copyInvitationCode}
        >
          <img src='/svgs/User_Plus.svg' />
          <p className='text-label_sm text-gray-700'>초대코드 복사</p>
        </button>
      </div>
      <ol className='flex flex-col justify-center gap-6 p-4'>
        {user_group
          .sort((a, b) => {
            if (a.is_owner === b.is_owner) return 0;
            return a.is_owner ? -1 : 1;
          })
          .map(({ is_owner, profiles: { user_image_url, user_nickname, user_email } }) => (
            <li
              className='flex flex-row items-center gap-2 rounded-full'
              key={user_email}
            >
              <img
                className='h-10 w-10 rounded-full'
                src={user_image_url ?? '/svgs/Profile.svg'}
                alt='프로필 이미지'
              />
              <div className='flex gap-2'>
                <p className='rounded-xl bg-gray-50 px-2 py-1 text-caption_light_md text-gray-500'>
                  {is_owner ? '그룹장' : '멤버'}
                </p>
                <div className='flex items-center gap-1'>
                  <p className='text-caption_bold_lg text-gray-700'>{user_nickname}</p>
                  <p className='text-caption_light_md text-gray-500'>{user_email}</p>
                </div>
              </div>
            </li>
          ))}
      </ol>
    </>
  );
};

export default MemberList;
