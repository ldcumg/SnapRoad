'use client';

import LogoUserHeader from '@/components/layout/LogoUserHeader';
import MyPageHeader from '@/components/myPage/MyPageHeader';
import URLS from '@/constants/urls';
import useMediaQuery from '@/hooks/byUse/useMediaQuery';
import { PostDetail } from '@/types/postDetailTypes';
import React, { useEffect, useState } from 'react';

export type PostAndProfileProps = {
  postDetail: PostDetail;
};

const PostDetailHeader = ({ postDetail }: { postDetail: PostDetail }) => {
  const isDesktop = useMediaQuery('(min-width: 1200px)');
  const [desktop, setDesktop] = useState(false);

  useEffect(() => {
    setDesktop(isDesktop);
  }, [isDesktop]);

  return (
    <div>
      {/* <div className='relative mx-4 flex items-center py-4'>
        <MyPageHeader url={URLS.groupList} />
        <span className='mx-auto text-label_md text-gray-900'>{postDetail?.group?.group_title}</span>
      </div> */}
      {desktop ? (
        <div className='pb-16'>
          <LogoUserHeader />
        </div>
      ) : (
        <div className='relative mx-4 flex items-center py-4'>
          <MyPageHeader url={URLS.groupList} />
          <span className='mx-auto text-label_md text-gray-900'>{postDetail?.group?.group_title}</span>
        </div>
      )}
    </div>
  );
};

export default PostDetailHeader;
