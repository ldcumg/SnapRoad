'use client';

import ImageBottomSheet from '@/components/write/ImageBottomSheet';
import PostAddress from '@/components/write/PostAddress';
import PostForm from '@/components/write/PostForm';
import PostImage from '@/components/write/PostImage';

type Props = {
  params: { groupId: string };
};

const PostPage = ({ params: { groupId } }: Props) => {
  return (
    <div className='w-full'>
      {/* <h1>{groupId}</h1> */}
      <PostAddress groupId={groupId} />
      <ImageBottomSheet />
      <PostImage showImages={true} />
      <PostForm />
    </div>
  );
};

export default PostPage;
