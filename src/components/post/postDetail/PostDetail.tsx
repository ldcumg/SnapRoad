import PostDetailCarousel from './PostDetailCarousel';
import PostDetailHeader from './PostDetailHeader';
import React from 'react';

interface PostDetailProps {
  postData: {
    post_id: string;
    post_desc: string;
    post_address: string;
    user_id: string | null;
    tags: { group_id: string; id: string; post_id: string; tag_title: string }[];
  };
  signedImageUrls: (string | undefined)[];
  coverImageDate: string;
  userDetail: {
    profileImageUrl: string | undefined;
    profiles: {
      user_id: string;
      user_nickname: string | null;
    };
  };
}

const PostDetail = ({ postData, signedImageUrls, coverImageDate, userDetail }: PostDetailProps) => {
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
      <div className='py-4 flex flex-col gap-4'>
        <div className='flex gap-4 items-center'>
          <div className='w-[40px] h-[40px] overflow-hidden rounded-full'>
            <img
              alt='프로필 이미지'
              src={userDetail?.profileImageUrl || '/svgs/Profile.svg'}
              className='object-cover w-full h-full'
            />
          </div>
          <span className='text-gray-900 text-label_md'>{userDetail.profiles.user_nickname}</span>
        </div>
        <div>
          <p className='text-black text-body_md'>{postData.post_desc}</p>
        </div>
        {/* 태그 영역 */}
        <div className='flex gap-1'>
          {postData.tags.map((tag, id) => {
            return (
              <span
                className='bg-gray-50 p-2 rounded-lg'
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
