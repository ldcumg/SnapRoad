'use client';

import { GroupDetailMode, type GroupInfo } from '@/types/groupTypes';
import Link from 'next/link';

type Props = {
  groupId: string;
  groupInfo: GroupInfo;
  setMode: React.Dispatch<React.SetStateAction<GroupDetailMode>>;
  handleUpdateModal: () => void;
  desktop: boolean;
};

const GroupInfoBox = ({
  groupId,
  groupInfo: { group_image_url, user_group, group_desc },
  setMode,
  handleUpdateModal,
  desktop,
}: Props) => {
  return (
    <div className='px-4 pc:flex pc:justify-center pc:border-b'>
      <div className='flex flex-row gap-[16px] border-b py-6 pc:mb-[20px] pc:mt-[40px] pc:w-[582px] pc:gap-[20px] pc:border-b-0 pc:p-[24px]'>
        <img
          className='h-[132px] min-h-[132px] w-[132px] min-w-[132px] object-cover pc:h-[220px] pc:min-h-[220px] pc:w-[220px] pc:min-w-[220px]'
          src={group_image_url ?? '/images/group_default_thumbnail.jpg'}
          alt='그룹 이미지'
        />
        <div className='flex w-full flex-col gap-[12px]'>
          <div className='flex flex-row justify-between'>
            <button onClick={() => setMode(GroupDetailMode.member)}>
              <div className='flex flex-row items-center gap-[4px] rounded-xl border border-gray-100 px-[8px] py-[4px]'>
                <img src='/svgs/Group_Member.svg' />
                <p className='text-label_sm pc:text-label_md'>{user_group.length}</p>
              </div>
            </button>
            {desktop ? (
              <button onClick={handleUpdateModal}>
                <img src='/svgs/Setting.svg' />
              </button>
            ) : (
              <Link href={`/makegroup?update_for=${groupId}`}>
                <img src='/svgs/Setting.svg' />
              </Link>
            )}
          </div>
          <p className='word-break: break-all text-caption_light_lg pc:text-body_sm'>{group_desc}</p>
        </div>
      </div>
    </div>
  );
};

export default GroupInfoBox;
