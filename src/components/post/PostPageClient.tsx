'use client';

import PostImageBottomSheet from './PostBottomSheet';
import PostForms from './PostForms';
import useMediaQuery from '@/hooks/byUse/useMediaQuery';
import { useEffect, useState } from 'react';

type Props = {
  groupId: string;
};

const PostPageClient = ({ groupId }: Props) => {
  const isDesktop = useMediaQuery('(min-width: 1200px)');
  const [desktop, setDesktop] = useState(false);

  useEffect(() => {
    setDesktop(true);
  }, []);

  if (!desktop) {
    return <section className='mt-14' />;
  }

  return (
    <section className={`${isDesktop ? 'mx-auto mb-20 mt-36 max-w-[654px]' : 'mt-14'}`}>
      <PostImageBottomSheet />
      <PostForms groupId={groupId} />
    </section>
  );
};

export default PostPageClient;
