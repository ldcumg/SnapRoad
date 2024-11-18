import LogoUserHeader from '@/components/layout/LogoUserHeader';
import EditForms from '@/components/post/EditForms';
import PostAddress from '@/components/post/PostAddress';
import ImageBottomSheet from '@/components/post/PostBottomSheet';
import PostImage from '@/components/post/PostImage';
import { fetchPostDetail } from '@/services/postDetailService';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '수정하기',
  description: '여행지에 대한 수정할 글을 작성하세요.',
  keywords: '여행지에 대한 수정할 글을 작성하세요.',
};

type Props = {
  params: { groupId: string; postId: string };
};

const EditPage = async ({ params: { groupId, postId } }: Props) => {
  const postDetail = await fetchPostDetail(postId);

  return (
    <>
      <LogoUserHeader />
      <div className='mt-14'>
        <PostAddress groupId={groupId} />
        <ImageBottomSheet />
        <PostImage showImages={false} />
        <EditForms postDetail={postDetail} />
      </div>
    </>
  );
};

export default EditPage;
