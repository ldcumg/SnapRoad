import { GroupWithCounts } from '@/types/groupTypes';
import { useRouter } from 'next/navigation';

const GroupItem = ({ el }: { el?: GroupWithCounts }) => {
  const router = useRouter();
  return (
    <li
      className='flex flex-col items-center p-4 min-h-[244px] bg-white gap-2 cursor-pointer rounded-xl border border-solid border-gray-100'
      onClick={() => router.push(`/group/${el?.group_id}`)}
    >
      <img
        src={el?.group_image_url}
        alt={`${el?.group_title}_이미지`}
        className='w-[130px] h-[130px] object-contain'
        fetchPriority='high'
      />
      <div className='flex flex-col gap-2 w-full h-full'>
        <div className='flex flex-row justify-between'>
          <p className='max-w-[100px] truncate text-label_sm text-gray-900'>{el?.group_title}</p>
          <p className='flex flex-row justify-center items-center'>
            <img
              src='/svgs/User_Group.svg'
              alt='icon'
              className='w-[15px] h-[15px]'
            />
            <span className='text-caption_bold_lg text-gray-700'>{el?.user_count}</span>
          </p>
        </div>
        <p className='max-w-full max-h-full line-clamp-3 break-all overflow-hidden text-ellipsis text-caption_light_md text-gray-700'>
          {el?.group_desc}
        </p>
      </div>
    </li>
  );
};

export default GroupItem;
