'use client';

import PostForm from '@/components/post/PostForm';
import PostImageSlide from '@/components/post/PostImageSlide';
import useUserAndLocation from '@/hooks/queries/post/useUserAndLocation';
import { useRouter } from 'next/navigation';

type Props = {
  params: { groupId: string };
};

const PostPage = ({ params: { groupId } }: Props) => {
  const router = useRouter();
  const { userId, lat, lng, addressName, isLoading, error, uploadSessionId } = useUserAndLocation(groupId);

  if (error) return <p>사용자 정보를 로드하는 데 실패했습니다.</p>;
  if (isLoading || !userId || !lat || !lng || !addressName) return <div>로딩 중...</div>;

  const handleGoBack = () => {
    router.back();
  };

  return (
    <div className='w-full'>
      <div className='flex items-center justify-between p-4 border-b border-gray-300'>
        {addressName && <p className='text-gray-500'>{addressName}</p>}
        <button
          type='button'
          className='back-button'
          onClick={handleGoBack}
        >
          뒤로 가기
        </button>
      </div>

      <h1>그룹 {groupId} 포스트 작성</h1>
      <PostImageSlide uploadSessionId={uploadSessionId} />
      <PostForm />
    </div>
  );
};

export default PostPage;
