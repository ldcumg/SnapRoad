import LogoUserHeader from '@/components/layout/LogoUserHeader';
import PostAddress from '@/components/post/PostAddress';
import PostImageBottomSheet from '@/components/post/PostBottomSheet';
import PostForms from '@/components/post/PostForms';
import PostImage from '@/components/post/PostImage';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: '글쓰기',
  description: '여행지에 대한 새로운 글을 작성하세요.',
  keywords: '여행지에 대한 새로운 글을 작성하세요.',
};

type Props = {
  params: { groupId: string };
  children: React.ReactNode;
};

const PostPage = ({ params: { groupId } }: Props) => {
  return (
    <>
      <LogoUserHeader />

      <div className='mt-14'>
        <PostAddress groupId={groupId} />
        <PostImageBottomSheet />
        {/* <PostImage showImages={false} /> */}
        <PostForms />
      </div>
    </>
  );
};

export default PostPage;
