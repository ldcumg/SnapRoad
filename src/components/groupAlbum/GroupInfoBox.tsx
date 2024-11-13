'use client';

import { useGroupDetailModeStore } from '@/hooks/groupDetail/useGroupDetailModeStore';
import { type GroupInfo } from '@/types/groupTypes';
import Link from 'next/link';

type Props = {
  groupId: string;
  groupInfo: GroupInfo;
};

const GroupInfoBox = ({ groupId, groupInfo: { group_image_url, user_group, group_desc } }: Props) => {
  const { toMember } = useGroupDetailModeStore((state) => state);
  return (
    <div className='px-4'>
      <div className='flex flex-row gap-4 border-b py-6'>
        <img
          className='h-[132px] min-h-[132px] w-[132px] min-w-[132px] object-cover'
          src={group_image_url ?? '/images/group_default_thumbnail.png'}
          alt='그룹 이미지'
        />
        <div className='flex w-full flex-col gap-3'>
          <div className='flex flex-row justify-between'>
            <button onClick={toMember}>
              <div className='flex flex-row items-center gap-1 rounded-xl border border-gray-100 px-2 py-1'>
                <img src='/svgs/Group_Member.svg' />
                <p className='text-label_sm'>{user_group.length}</p>
              </div>
            </button>
            <Link href={`/makegroup?update_for=${groupId}`}>
              <img src='/svgs/Setting.svg' />
            </Link>
          </div>
          <p className='word-break: break-all text-caption_light_lg'>{group_desc}</p>
        </div>
      </div>
    </div>
  );
};

export default GroupInfoBox;
