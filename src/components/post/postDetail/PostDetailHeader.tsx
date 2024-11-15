import OptionsMenu from './OptionsMenu';
import { PostDetail, UserDetail } from '@/types/postDetailTypes';
import Link from 'next/link';
import React from 'react';

export type PostAndProfileProps = {
  postDetail: PostDetail;
  userDetail: UserDetail;
};

const PostDetailHeader = ({ userDetail, postDetail }: PostAndProfileProps) => {
  return (
    <div className='flex justify-between p-4'>
      <div className='flex items-center gap-2'>
        <Link href={`/group/${postDetail.group_id}?lat=${postDetail.post_lat}&lng=${postDetail.post_lng}`}>
          <img
            src={'/svgs/Map_Pin.svg'}
            alt='지도 마커'
            width={24}
            height={24}
          />
        </Link>
        <p className='text-label_sm text-gray-900'>{postDetail.post_address}</p>
        <p className='text-caption_light_lg text-gray-500'>{postDetail.post_date}</p>
      </div>
      {userDetail.profiles.user_id === postDetail.user_id ? <OptionsMenu postId={postDetail.post_id} /> : null}
    </div>
  );
};

export default PostDetailHeader;
