import ScrollReactHeader from '@/components/_common/ScrollReactHeader';
import LogoUserHeader from '@/components/layout/LogoUserHeader';
import ImageBottomSheet from '@/components/post/ImageBottomSheet';
import PostForm from '@/components/post/Post';
import PostAddress from '@/components/post/PostAddress';
import PostImage from '@/components/post/PostImage';

type Props = {
  params: { groupId: string };
};

const writePage = ({ params: { groupId } }: Props) => {
  return (
    <>
      <ScrollReactHeader>
        <LogoUserHeader />
      </ScrollReactHeader>

      <div className='mt-14'>
        <PostAddress groupId={groupId} />
        <ImageBottomSheet />
        <PostImage showImages={false} />
        <PostForm />
      </div>
    </>
  );
};

export default writePage;
