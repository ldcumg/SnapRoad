'use client';

import ImageBottomSheet from '@/components/post/ImageBottomSheet';
import PostAddress from '@/components/post/PostAddress';
import PostForm from '@/components/post/PostForm';
import PostImage from '@/components/post/PostImage';

type Props = {
  params: { groupId: string };
};

const writePage = ({ params: { groupId } }: Props) => {
  return (
    <div className='w-full'>
      <PostAddress groupId={groupId} />
      <ImageBottomSheet />
      <PostImage showImages={false} />
      <PostForm />
    </div>
  );
};

export default writePage;
