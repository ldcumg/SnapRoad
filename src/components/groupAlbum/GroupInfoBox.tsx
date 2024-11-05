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
          src={group_image_url}
        />
        <div className='flex flex-col gap-3'>
          <div className='flex flex-row justify-between'>
            <button onClick={() => setMode(GroupDetailMode.member)}>
              <div className='flex flex-row gap-1 rounded-xl border border-gray-100 px-2 py-1'>
                <img src='/svgs/Group_Member.svg' />
                <p>{user_group.length}</p>
              </div>
            </button>
            <button>
              <img src='/svgs/Setting.svg' />
            </button>
          </div>
          <p className='word-break: break-all'>{group_desc}</p>
        </div>
      </div>
    </div>
  );
};

export default GroupInfoBox;
