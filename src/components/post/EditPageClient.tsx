'use client';

import EditForms from './EditForms';
import PostImageBottomSheet from './PostBottomSheet';
import useMediaQuery from '@/hooks/byUse/useMediaQuery';
import { PostDetail as postDetailType } from '@/types/postDetailTypes';
import { useState, useEffect } from 'react';

type Props = {
  groupId: string;
  postDetail: postDetailType;
};

const EditPageClient = ({ groupId, postDetail }: Props) => {
  const isDesktop = useMediaQuery('(min-width: 1200px)');
  const [desktop, setDesktop] = useState(false);

  useEffect(() => {
    setDesktop(isDesktop);
  }, [isDesktop]);

  return (
    <section className={`${desktop ? 'mx-auto mb-20 mt-36 max-w-[654px]' : 'mt-14'}`}>
      <PostImageBottomSheet />
      <EditForms
        groupId={groupId}
        postDetail={postDetail}
      />
    </section>
  );
};

export default EditPageClient;
