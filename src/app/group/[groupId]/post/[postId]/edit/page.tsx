import LogoUserHeader from '@/components/layout/LogoUserHeader';
import EditForms from '@/components/post/EditForms';
import PostAddress from '@/components/post/PostAddress';
import ImageBottomSheet from '@/components/post/PostBottomSheet';
import PostImage from '@/components/post/PostImage';
import { fetchPostDetail } from '@/services/postDetailService';
import { getSession } from '@/services/server-action/authActions';
import { getProfile } from '@/services/server-action/profilesAction';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '수정하기',
  description: 'A Next.js project with TypeScript and TailwindCSS.',
  keywords: 'Next.js, Typescript, TailwindCSS',
};

type Props = {
  params: { groupId: string; postId: string };
};

const EditPage = async ({ params: { groupId, postId } }: Props) => {
  const user = await getSession();
  const userDetail = await getProfile(user?.id!);
  const postDetail = await fetchPostDetail(postId);

  return (
    <>
      <LogoUserHeader />
      <div className='mt-14'>
        <PostAddress groupId={groupId} />
        <ImageBottomSheet />
        <PostImage showImages={false} />
        <EditForms postDetail={postDetail} userDetail={userDetail} />
      </div>
    </>
  );
};

export default EditPage;
