import { GroupWithCounts } from '@/types/groupTypes';
import { useRouter } from 'next/navigation';

const GroupItem = ({ el }: { el?: GroupWithCounts }) => {
  const router = useRouter();
  return (
    <li
      className='flex min-h-[244px] cursor-pointer flex-col items-center gap-2 rounded-xl border border-solid border-gray-100 bg-white p-4'
      onClick={() => router.push(`/group/${el?.group_id}`)}
    >
      <div className='flex min-h-[130px] w-[130px] items-center'>
        <img
          src={el?.group_image_url}
          alt={`${el?.group_title}_이미지`}
          className='object-contain'
          fetchPriority='high'
        />
      </div>
      <div className='flex h-full w-full flex-col gap-2'>
        <div className='flex flex-row justify-between'>
          <p className='max-w-[100px] truncate text-label_sm text-gray-900'>{el?.group_title}</p>
          <p className='flex flex-row items-center justify-center'>
            <img
              src='/svgs/User_Group.svg'
              alt='icon'
              className='h-[15px] w-[15px]'
            />
            <span className='text-caption_bold_lg text-gray-700'>{el?.user_count}</span>
          </p>
        </div>
        <p className='line-clamp-3 max-h-full max-w-full overflow-hidden text-ellipsis break-all text-caption_light_md text-gray-700'>
          {el?.group_desc}
        </p>
      </div>
    </li>
  );
};

export default GroupItem;
