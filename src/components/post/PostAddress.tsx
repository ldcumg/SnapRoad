import useUserAndLocation from '@/hooks/queries/post/useUserAndLocation';
import { useRouter } from 'next/navigation';

interface groupIdProps {
  groupId: string;
}

const PostAddress = ({ groupId }: groupIdProps) => {
  const { addressName } = useUserAndLocation(groupId);
  const router = useRouter();
  const handleGoBack = () => router.back();

  return (
    <div className='flex items-center justify-between p-4 border-t border-b border-gray-300'>
      {addressName && <p className='text-gray-500'>{addressName}</p>}
      <button
        type='button'
        className='back-button'
        onClick={handleGoBack}
      >
        <img
          src='/svgs/Map_Pin.svg'
          alt='위치 선택'
        />
      </button>
    </div>
  );
};

export default PostAddress;
