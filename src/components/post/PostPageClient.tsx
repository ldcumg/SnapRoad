'use client';

import PostAddress from '@/components/post/PostAddress';
import PostImageBottomSheet from '@/components/post/PostBottomSheet';
import PostForms from '@/components/post/PostForms';
import useMediaQuery from '@/hooks/byUse/useMediaQuery';

type Props = {
  groupId: string;
};

const PostPageClient = ({ groupId }: Props) => {
  const isDesktop = useMediaQuery('(min-width: 1200px)');
  console.log('isDesktop :>> ', isDesktop);

  return (
    <div className='mt-14'>
      {isDesktop ? (
        <div className='mt-20'>
          <PostForms />
          <PostAddress groupId={groupId} />
          <PostImageBottomSheet />
        </div>
      ) : (
        <div>
          <PostAddress groupId={groupId} />
          <PostImageBottomSheet />
          <PostForms />
        </div>
      )}
    </div>
  );
};

export default PostPageClient;
