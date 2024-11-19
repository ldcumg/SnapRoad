'use client';

import EditForms from './EditForms';
import PostImageBottomSheet from './PostBottomSheet';
import { PostDetail as postDetailType } from '@/types/postDetailTypes';
import { useState, useEffect } from 'react';

type Props = {
  groupId: string;
  postDetail: postDetailType;
};

const EditPageClient = ({ groupId, postDetail }: Props) => {
  return (
    <section className='mt-14 lg:mb-20 lg:mt-36'>
      <PostImageBottomSheet />
      <EditForms
        groupId={groupId}
        postDetail={postDetail}
      />
    </section>
  );
};

export default EditPageClient;
