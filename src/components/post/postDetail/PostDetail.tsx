import PostDetailCarousel from './PostDetailCarousel';
import PostDetailHeader from './PostDetailHeader';
import React from 'react';

interface PostDetailProps {
  postData: {
    post_id: string;
    post_desc: string;
    post_address: string;
    user_id: string | null;
    post_date: string;
    tags: { group_id: string; id: string; post_id: string; tag_title: string }[];
  };
  signedImageUrls: {
    signedImageUrl: string | undefined;
    is_cover: boolean;
  }[];
  coverImageDate: string;
  userDetail: {
    profileImageUrl: string | undefined;
    profiles: {
      user_id: string;
      user_nickname: string | null;
    };
  };
  postAuthorDetail: {
    // 글을 쓴 사람
    profileImageUrl: string | undefined;
    profiles: {
      user_id: string;
      user_nickname: string | null;
    };
  };
}

const PostDetail = ({ postData, signedImageUrls, coverImageDate, userDetail, postAuthorDetail }: PostDetailProps) => {
  return (
    <div className='border-b'>
      {/* 상단 영역 */}
      <PostDetailHeader
        coverImageDate={coverImageDate}
        postData={postData}
        userDetail={userDetail}
      />
      {/* 이미지 영역*/}
      {/* <PostImages images={signedImageUrls} /> */}
      <PostDetailCarousel images={signedImageUrls} />
      {/* 게시글 내용 */}
      <div className='flex flex-col gap-4 px-4 py-4'>
        <div className='flex items-center gap-4'>
          <div className='h-[40px] w-[40px] overflow-hidden rounded-full'>
            <img
              alt='프로필 이미지'
              src={postAuthorDetail?.profileImageUrl || '/svgs/Profile.svg'} // 이 글을 쓴 사람
              className='h-full w-full object-cover'
            />
          </div>
          <span className='text-label_md text-gray-900'>{postAuthorDetail.profiles.user_nickname}</span>
        </div>
        <div>
          <p className='text-body_md text-black'>{postData.post_desc}</p>
        </div>
        {/* 태그 영역 */}
        <div className='flex gap-1 px-4'>
          {postData.tags.map((tag, id) => {
            return (
              <span
                className='rounded-lg bg-gray-50 p-2'
                key={id}
              >
                #{tag.tag_title}
              </span>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default PostDetail;
