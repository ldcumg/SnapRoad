'use client';

import PostForm from '@/components/post/PostForm';
import PostImageSlide from '@/components/post/PostImageSlide';
import { useUserQuery } from '@/hooks/queries/byUse/useUserQuery';
import { useImageUploadStore } from '@/stores/imageUploadStore';
import { useSearchParams, useRouter } from 'next/navigation';
import { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';

type Props = {
  params: { groupId: string };
};

const PostPage = ({ params: { groupId } }: Props) => {
  const searchParams = useSearchParams();
  const router = useRouter();

  const lat = searchParams.get('lat');
  const lng = searchParams.get('lng');
  const addressName = searchParams.get('address_name');
  const latNumber = lat ? parseFloat(lat) : undefined;
  const lngNumber = lng ? parseFloat(lng) : undefined;

  const { data: user, isLoading: userLoading, error: userError } = useUserQuery();
  const { images } = useImageUploadStore();

  if (userError) return <p>사용자 정보를 로드하는 데 실패했습니다.</p>;
  if (userLoading) return <div>로딩 중...</div>;
  if (!user) return <p>로그인이 필요합니다.</p>;

  const userId = user.id;
  const uploadSessionId = uuidv4();

  const handleGoBack = () => {
    router.back();
  };

  return (
    <div className='w-full'>
      {/* 상단 헤더 영역 */}

      <div className='flex items-center justify-between p-4 border-b border-gray-300'>
        {addressName && <p className='text-gray-500'>{decodeURIComponent(addressName)}</p>}
        <button
          type='button'
          className='back-button'
          onClick={handleGoBack}
        >
          뒤로 가기
        </button>
      </div>
      <h1>그룹 {groupId} 포스트 작성</h1>
      <PostImageSlide
        userId={userId}
        groupId={groupId}
        uploadSessionId={uploadSessionId}
      />
      <PostForm
        userId={userId}
        groupId={groupId}
        imagesData={images}
        lat={latNumber}
        lng={lngNumber}
        addressName={addressName ? decodeURIComponent(addressName) : undefined}
      />
    </div>
  );
};

export default PostPage;
