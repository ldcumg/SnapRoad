import PostImageDownload from './PostImageDownload';
import ProfileImage from './ProfileImage';
import { PostDetail } from '@/types/postDetailTypes';
import React from 'react';

export type ProfileProps = {
  postDetail: PostDetail;
};

const PostDetailDesc = ({ postDetail }: ProfileProps) => {
  return (
    <div className='flex flex-col gap-4 p-4'>
      <div className='flex justify-between'>
        <div className='flex items-center gap-4'>
          <ProfileImage
            profileImageUrl={postDetail.post_author_user.signed_image_url}
            size='medium'
          />
          <span className='text-label_md text-gray-900'>{postDetail.post_author_user.user_nickname}</span>
        </div>
        <PostImageDownload postDetail={postDetail} />
      </div>
      <div>
        <p className='break-all text-body_md text-black'>{postDetail.post_desc}</p>
      </div>
      <div className='flex gap-1'>
        {postDetail.tags.map((tag, id) => {
          return (
            <span
              className='break-all rounded-lg bg-gray-50 p-2 text-caption_light_lg text-gray-700'
              key={id}
            >
              #{tag.tag_title}
            </span>
          );
        })}
      </div>
    </div>
  );
};

export default PostDetailDesc;
