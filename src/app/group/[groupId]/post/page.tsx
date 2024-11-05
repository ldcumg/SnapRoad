'use client';

import ImageBottomSheet from '@/components/post/ImageBottomSheet';
import PostAddress from '@/components/post/PostAddress';
import PostForm from '@/components/post/PostForm';
import PostImage from '@/components/post/PostImage';
import useUserAndLocation from '@/hooks/queries/post/useUserAndLocation';

// import PostImageSlide from '@/components/post/PostImage';
// import { useRouter } from 'next/navigation';

type Props = {
  params: { groupId: string };
};

const PostPage = ({ params: { groupId } }: Props) => {
  const { userId, lat, lng, addressName, isLoading, error, uploadSessionId } = useUserAndLocation(groupId);

  if (error) return <p>사용자 정보를 로드하는 데 실패했습니다.</p>;
  if (isLoading || !userId || !lat || !lng || !addressName) return <div>로딩 중...</div>;

  return (
    <div className='w-full'>
      <PostAddress addressName={addressName} />
      {/* <h1>그룹 {groupId} 포스트 작성</h1> */}
      <ImageBottomSheet uploadSessionId={uploadSessionId} />
      <hr />
      <PostImage shorwImages={true} />
      <hr />
      {/* <PostImageSlide uploadSessionId={uploadSessionId} /> */}
      <PostForm />
    </div>
  );
};

export default PostPage;
