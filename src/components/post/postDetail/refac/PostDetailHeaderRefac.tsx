import OptionsMenuRefac from './OptionsMenuRefac';
import { PostAndProfileProps } from '@/types/postDetailTypes';
import React from 'react';

const PostDetailHeaderRefac = ({ userDetail, postDetail }: PostAndProfileProps) => {
  return (
    <div className='flex justify-between p-4'>
      <div className='flex items-center gap-2'>
        <img
          src={'/svgs/Map_Pin.svg'}
          alt='지도 마커'
          width={24}
          height={24}
        />
        <p className='text-label_sm text-gray-900'>{postDetail.post_address}</p>
        <p className='text-caption_light_lg text-gray-500'>{postDetail.post_date}</p>
      </div>
      {userDetail.profiles.user_id === postDetail.user_id ? <OptionsMenuRefac postId={postDetail.post_id} /> : null}
    </div>
  );
};

export default PostDetailHeaderRefac;
