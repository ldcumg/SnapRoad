import OptionsMenu from './OptionsMenu';
// import DropdownMenu from '@/components/ui/dropdownMenu';
import React from 'react';

interface PostDetailHeaderProps {
  postData: {
    post_address: string;
    user_id: string | null;
    post_id: string;
  };
  coverImageDate: string;
  userDetail: {
    profiles: {
      user_id: string;
    };
  };
}

const PostDetailHeader = ({ postData, coverImageDate, userDetail }: PostDetailHeaderProps) => {
  return (
    <>
      {/* 옵션 메뉴를 포함한 상단 */}
      <div className='flex justify-between py-4 w-full'>
        {/* 싱단 정보 */}
        <div className='flex items-center gap-2 w-full relative'>
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
          {/* <div className='absolute top-0 right-0'>
            <DropdownMenu />
          </div> */}
        </div>
        {userDetail.profiles.user_id === postData.user_id ? <OptionsMenu postId={postData.post_id} /> : null}
      </div>
    </>
  );
};

export default PostDetailHeader;
