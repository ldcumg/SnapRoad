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

  // 사용자 데이터 로딩 상태 및 오류 처리
  if (userError) return <p>사용자 정보를 로드하는 데 실패했습니다.</p>;
  if (userLoading) return <div>로딩 중...</div>;
  if (!user) return <p>로그인이 필요합니다.</p>;

  const userId = user.id;

  const uploadSessionId = uuidv4();

  return (
    <div className='w-full'>
      <ImageSlide
        userId={userId}
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

// 'use client';

// import ImageSlide from '@/components/post/ImageSlide';
// import PostForm from '@/components/post/PostForm';
// import { useUploadImage } from '@/hooks/queries/byUse/useUploadImageMutation';
// import { useUserQuery } from '@/hooks/queries/byUse/useUserQuery';

// type Props = {
//   params: { groupId: string };
// };

// const PostPage = ({ params: { groupId } }: Props) => {
//   const { data: user, isLoading: userLoading, error: userError } = useUserQuery();
//   const { uploadSessionId, mutate } = useUploadImage('bucketName', 'folderName', user.id);
//   if (userError) return <p>사용자 정보를 로드하는 데 실패했습니다.</p>;
//   if (userLoading) return <div>로딩 중...</div>;
//   if (!user?.id) return <p>로그인이 필요합니다.</p>;

//   const userId = user.id;

//   return (
//     <div className='w-full'>
//       <ImageSlide
//         userId={userId}
//         uploadSessionId={uploadSessionId}
//       />
//       <PostForm
//         userId={userId}
//         groupId={groupId}
//         uploadSessionId={uploadSessionId}
//       />
//     </div>
//   );
// };

// export default PostPage;
