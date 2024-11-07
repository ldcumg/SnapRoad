'use client';

import { GroupDetailMode, type GroupInfo } from '@/types/groupTypes';

type Props = {
  groupInfo: GroupInfo;
  setMode: React.Dispatch<React.SetStateAction<GroupDetailMode>>;
};

const GroupInfoBox = ({ groupInfo: { group_image_url, user_group, group_desc }, setMode }: Props) => {
  return (
    <div className='px-4'>
      <div className='flex flex-row gap-4 border-b py-6'>
        <img
          className='h-[132px] w-[132px]'
          src={group_image_url ?? '/public/images/group_default_thumbnail.png'}
          alt='그룹 이미지'
        />
        <div className='flex w-full flex-col gap-3'>
          <div className='flex flex-row justify-between'>
            <button onClick={() => setMode(GroupDetailMode.member)}>
              <div className='flex flex-row items-center gap-1 rounded-xl border border-gray-100 px-2 py-1'>
                <img src='/svgs/Group_Member.svg' />
                <p className='text-label_sm'>{user_group.length}</p>
              </div>
            </button>
            <button>
              <img src='/svgs/Setting.svg' />
            </button>
          </div>
          <p className='word-break: break-all text-caption_light_lg'>{group_desc}</p>
        </div>
      </div>
    </div>
  );
};

export default GroupInfoBox;
