'use client';

import useUserAndLocation from '@/hooks/queries/post/useUserAndLocation';
import { IconMapPin } from '@/lib/icon/Icon_Map_Pin';
import { useRouter } from 'next/navigation';

interface groupIdProps {
  groupId: string;
}

const PostAddress = ({ groupId }: groupIdProps) => {
  const { addressName, lat, lng } = useUserAndLocation(groupId);
  const router = useRouter();
  const handleGoBack = () => {
    const isConfirmed = window.confirm('페이지를 벗어나시겠습니까?');
    if (isConfirmed) {
      router.back();
    }
  };

  const displayAddress = lat && lng ? addressName : '위치 없음';

  return (
    <div className='flex items-center justify-between py-4'>
      <p className='text-gray-500'>{displayAddress}</p>
      <button
        type='button'
        className='back-button'
        onClick={handleGoBack}
      >
        <IconMapPin />
      </button>
    </div>
  );
};

export default PostAddress;
