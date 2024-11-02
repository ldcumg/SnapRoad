'use client';

import type { GroupInfo } from '@/types/groupTypes';
import { toast } from 'garlic-toast';

type Props = {
  groupInfo: GroupInfo;
};

const MemberList = ({ groupInfo: { user_group } }: Props) => {
  return (
    <>
      <h1>그룹 멤버</h1>
      <ol>
        {user_group.map(({ is_owner, profiles: { user_image_url, user_nickname, user_email } }) => (
          <li className='flex'>
            <img src={user_image_url} />
            <p>{is_owner ? '그룹장' : '멤버'}</p>
            <p>{user_nickname}</p>
            <p>{user_email}</p>
          </li>
        ))}
      </ol>
      <button
        onClick={() =>
          toast.alert('초대 코드를 복사했어요!', {
            position: 'b-c',
            autoClose: true,
          })
        }
      >
        초대코드 복사
      </button>
    </>
  );
};

export default MemberList;
