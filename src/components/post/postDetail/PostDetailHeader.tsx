import OptionsMenu from './OptionsMenu';
import React from 'react';

const PostDetailHeader = ({ postData, coverImageDate, userDetail }) => {
  return (
    <>
      {/* 옵션 메뉴를 포함한 상단 */}
      <div className='flex justify-between py-4'>
        {/* 싱단 정보 */}
        <div className='flex items-center gap-2'>
          {/* 마커 아이콘과 위치명 */}
          <div className='flex items-center gap-2'>
            <img
              src={'/svgs/Map_Pin.svg'}
              alt='지도 마커'
              width={24}
              height={24}
            />
            <span className='text-gray-900 text-label_sm'>{postData.post_address}</span>
          </div>
          <span className='text-gray-500 text-caption_light_lg'>{coverImageDate}</span>
        </div>
        {userDetail.profiles.user_id === postData.user_id ? <OptionsMenu postId={postData.post_id} /> : null}
      </div>
    </>
  );
};

export default PostDetailHeader;
