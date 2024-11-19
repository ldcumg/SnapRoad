import LogoUserHeader from '@/components/layout/LogoUserHeader';
import EditPageClient from '@/components/post/EditPageClient';
import { fetchPostDetail } from '@/services/postDetailService';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '수정하기',
  description: '여행지에 대한 수정할 글을 작성하세요.',
  keywords: '여행지에 대한 수정할 글을 작성하세요.',
};

type Props = {
  params: { postId: string; groupId: string };
};

const EditPage = async ({ params: { postId, groupId } }: Props) => {
  const postDetail = await fetchPostDetail(postId);

  return (
    <>
      <LogoUserHeader />
      <EditPageClient
        postDetail={postDetail}
        groupId={groupId}
      />
    </>
  );
};

export default EditPage;
