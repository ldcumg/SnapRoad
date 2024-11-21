'use client';

import PostImageBottomSheet from './PostBottomSheet';
import PostForms from './PostForms';
import { useEffect, useState } from 'react';

type Props = {
  groupId: string;
};

const PostPageClient = ({ groupId }: Props) => {
  return (
    <section className='mt-14 lg:mb-20 lg:mt-36'>
      <PostImageBottomSheet />
      <PostForms groupId={groupId} />
    </section>
  );
};

export default PostPageClient;
