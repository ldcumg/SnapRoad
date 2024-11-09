import PostDetailCarouselRefac from './PostDetailCarouselRefac';
import PostDetailDesc from './PostDetailDesc';
import PostDetailHeaderRefac from './PostDetailHeaderRefac';
import { PostAndProfileProps } from '@/types/postDetailTypes';
import React from 'react';

const PostDetailRefac = ({ userDetail, postDetail }: PostAndProfileProps) => {
  return (
    <div className='border-b'>
      {/* 상단 게시글 정보 */}
      <PostDetailHeaderRefac
        userDetail={userDetail}
        postDetail={postDetail}
      />
      {/* 이미지 캐러셀 */}
      <PostDetailCarouselRefac images={postDetail.images} />
      {/* 게시글 내용 */}
      <PostDetailDesc postDetail={postDetail} />
    </div>
  );
};

export default PostDetailRefac;
