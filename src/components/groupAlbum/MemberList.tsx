'use client';

import type { GroupInfo } from '@/types/groupTypes';
import { toast } from 'garlic-toast';

type Props = {
  groupInfo: GroupInfo;
};

const MemberList = ({ groupInfo: { user_group } }: Props) => {
  return (
    <>
      <div className='flex flex-row justify-between p-4'>
        <h1 className='text-xl font-semibold'>그룹 멤버</h1>
        <button
          className='flex gap-2 rounded border border-black px-4 py-2'
          //TODO - 코드 자동 복사
          onClick={() =>
            toast.alert('초대 코드를 복사했어요!', {
              position: 'b-c',
              autoClose: true,
            })
          }
        >
          <img src='/svgs/User_Plus.svg' />
          <p>초대코드 복사</p>
        </button>
      </div>
      <ol>
        {user_group
          .sort((a, b) => {
            if (a.is_owner === b.is_owner) return 0;
            return a.is_owner ? -1 : 1;
          })
          .map(({ is_owner, profiles: { user_image_url, user_nickname, user_email } }) => (
            <li className='flex'>
              <img src={user_image_url} />
              <p>{is_owner ? '그룹장' : '멤버'}</p>
              <p>{user_nickname}</p>
              <p>{user_email}</p>
            </li>
          ))}
      </ol>
    </>
  );
};

export default MemberList;
