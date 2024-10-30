'use client';

// import PostPage from './[groupId]';
import ImageManager from '@/components/post/ImageManager';
import ImageSlide from '@/components/post/ImageSlide';
import PostForm from '@/components/post/PostForm';
import { useUserQuery } from '@/hooks/queries/byUse/useUserQuery';
import { v4 as uuidv4 } from 'uuid';

const FormPage = () => {
  const { data: user, isLoading: userLoading, error: userError } = useUserQuery();

  if (userError) return <p>사용자 정보를 로드하는 데 실패했습니다.</p>;
  if (userLoading) return <div>로딩 중...</div>;
  if (!user?.id) return <p>로그인이 필요합니다.</p>;

  const userId = user.id;
  const uploadSessionId = uuidv4();
  return (
    <section className='w-full'>
      {/* <ImageManager
        userId={userId}
        uploadSessionId={uploadSessionId} 
      /> */}
      <ImageSlide
        userId={userId}
        uploadSessionId={uploadSessionId}
      />
      <PostForm />
      <ImageManager
        userId={userId}
        uploadSessionId={uploadSessionId}
      />
    </section>
  );
};

export default FormPage;
