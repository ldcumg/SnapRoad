import { GroupWithCounts } from '@/types/groupTypes';
import { useRouter } from 'next/navigation';
import React from 'react';

const GroupItem = ({ el }: { el: GroupWithCounts }) => {
  const router = useRouter();
  return (
    <li
      className='flex min-h-[244px] cursor-pointer flex-col items-center gap-2 rounded-xl border border-solid border-gray-100 bg-white p-4 pc:flex-row pc:gap-4'
      onClick={() => router.push(`/group/${el?.group_id}`)}
    >
      <div className='flex min-h-[130px] w-[130px] items-center justify-center pc:h-[200px] pc:w-[200px]'>
        <img
          src={el.group_image_url}
          alt={`${el.group_title}_이미지`}
          className='h-[130px] w-[130px] object-fill pc:h-[200px] pc:w-[200px]'
          fetchPriority='high'
        />
      </div>
      <div className='flex h-full w-full flex-col gap-2 pc:w-[132px] pc:justify-center'>
        <div className='flex flex-row justify-between pc:flex-col pc:gap-2'>
          <p className='max-w-[100px] truncate text-label_sm text-gray-900 pc:max-w-full pc:text-title_lg'>
            {el?.group_title}
          </p>
          <p className='flex flex-row items-center justify-center gap-1 pc:justify-start'>
            <img
              src='/svgs/User_Group.svg'
              alt='icon'
              className='h-[20px] w-[20px] pc:h-[22px] pc:w-[22px]'
            />
            <span className='text-label_sm text-gray-700 pc:text-label_md'>{el?.user_count}</span>
          </p>
        </div>
        <p className='line-clamp-3 max-h-full max-w-full overflow-hidden text-ellipsis break-all text-body_sm text-gray-700'>
          {el?.group_desc}
        </p>
      </div>
    </li>
  );
};

export default React.memo(GroupItem);
