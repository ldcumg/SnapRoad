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
      {/* <h1>{groupId}</h1> */}
      <PostAddress groupId={groupId} />
      <ImageBottomSheet />
      <PostImage showImages={true} />
      <PostForm />
    </div>
  );
};

export default writePage;
