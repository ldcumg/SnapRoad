'use client';

import ImageSlide from '@/components/post/ImageSlide';
import PostForm from '@/components/post/PostForm';
import { useUserQuery } from '@/hooks/queries/byUse/useUserQuery';
import { useImageUploadStore } from '@/stores/imageUploadStore';
import { v4 as uuidv4 } from 'uuid';

type Props = {
  params: { groupId: string };
};

const PostPage = ({ params: { groupId } }: Props) => {
  const { data: user, isLoading: userLoading, error: userError } = useUserQuery();
  const { images } = useImageUploadStore();

  if (userError) return <p>사용자 정보를 로드하는 데 실패했습니다.</p>;
  if (userLoading) return <div>로딩 중...</div>;
  if (!user) return <p>로그인이 필요합니다.</p>;

  const userId = user.id;
  const uploadSessionId = uuidv4();

  return (
    <div className='w-full'>
      <ImageSlide
        userId={userId}
        groupId={groupId}
        uploadSessionId={uploadSessionId}
      />
      <PostForm
        userId={userId}
        groupId={groupId}
        imagesData={images}
      />
    </div>
  );
};

export default PostPage;
