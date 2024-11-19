import LogoUserHeader from '@/components/layout/LogoUserHeader';
import PostPageClient from '@/components/post/PostPageClient';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: '글쓰기',
  description: '여행지에 대한 새로운 글을 작성하세요.',
  keywords: '여행지, 글쓰기, 여행지 포스트',
};

type Props = {
  params: { groupId: string };
};

const PostPage = ({ params: { groupId } }: Props) => {
  return (
    <>
      <LogoUserHeader />
      <PostPageClient groupId={groupId} />
    </>
  );
};

export default PostPage;
