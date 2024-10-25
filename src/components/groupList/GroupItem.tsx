import { GroupListResponseType } from '@/services/client-action/groupActions';
import { useRouter } from 'next/navigation';

const GroupItem = ({ el }: { el?: GroupListResponseType }) => {
  const router = useRouter();
  return (
    <li
      className='p-[16px] bg-[#DEDEDE] w-[164px] h-[273px] cursor-pointer'
      onClick={() => router.push(`/group/${el?.group_id}`)}
    >
      <img
        src={el?.group_data.group_image_url}
        alt={`${el?.group_data.group_title}_이미지`}
        fetchPriority='high'
      />
      <div className='text-[14px] flex flex-row justify-between'>
        <p className='max-w-[100px] truncate'>{el?.group_data.group_title}</p>
        <p className='flex flex-row'>
          <span>
            <img
              src=''
              alt='icon'
              className='w-[15px] h-[15px]'
            />
          </span>
          <span>{el?.userCount}</span>
        </p>
      </div>
      <p>{el?.group_data.group_desc}</p>
    </li>
  );
};

export default GroupItem;
