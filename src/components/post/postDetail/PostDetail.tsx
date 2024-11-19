import PostDetailCarousel from './PostDetailCarousel';
import PostDetailDesc from './PostDetailDesc';
import PostDetailTitle from './PostDetailTitle';
import { PostDetail as postDetailType, UserDetail } from '@/types/postDetailTypes';
import React from 'react';

export type PostAndProfileProps = {
  postDetail: postDetailType;
  userDetail: UserDetail;
};

const PostDetail = ({ userDetail, postDetail }: PostAndProfileProps) => {
  return (
    <div className='border-b'>
      {/* 상단 게시글 정보 */}
      <PostDetailTitle
        userDetail={userDetail}
        postDetail={postDetail}
      />
      {/* 이미지 캐러셀 */}
      <PostDetailCarousel images={postDetail.images} />
      {/* 게시글 내용 */}
      <PostDetailDesc postDetail={postDetail} />
    </div>
  );
};

export default PostDetail;
