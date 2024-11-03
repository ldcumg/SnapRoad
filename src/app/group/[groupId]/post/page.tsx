'use client';

import PostForm from '@/components/post/PostForm';
import PostImageSlide from '@/components/post/PostImageSlide';
import { useUserQuery } from '@/hooks/queries/byUse/useUserQuery';
import { useImageUploadStore } from '@/stores/imageUploadStore';
import { useSearchParams, useRouter } from 'next/navigation';
import { useState, useEffect, useMemo } from 'react';
import { v4 as uuidv4 } from 'uuid';

type Props = {
  params: { groupId: string };
};

const PostPage = ({ params: { groupId } }: Props) => {
  const searchParams = useSearchParams();
  const router = useRouter();

  // 쿼리 파라미터로부터 값을 가져와 상태로 저장
  const lat = searchParams.get('lat');
  const lng = searchParams.get('lng');
  const addressName = searchParams.get('address_name');
  const latNumber = lat ? parseFloat(lat) : undefined;
  const lngNumber = lng ? parseFloat(lng) : undefined;

  // 디코딩된 주소를 상태에 저장
  const [decodedAddressName, setDecodedAddressName] = useState<string | undefined>(
    addressName ? decodeURIComponent(addressName) : undefined,
  );

  const { data: user, isLoading: userLoading, error: userError } = useUserQuery();
  const { images } = useImageUploadStore();

  // UUID는 최초 렌더링에서만 생성되도록 useMemo 사용
  const uploadSessionId = useMemo(() => uuidv4(), []);

  useEffect(() => {
    // 디코딩된 주소가 필요한 경우 콘솔 출력
    console.log('Latitude:', latNumber);
    console.log('Longitude:', lngNumber);
    console.log('Decoded Address Name:', decodedAddressName);
  }, [latNumber, lngNumber, decodedAddressName]);

  if (userError) return <p>사용자 정보를 로드하는 데 실패했습니다.</p>;
  if (userLoading) return <div>로딩 중...</div>;
  if (!user) return <p>로그인이 필요합니다.</p>;

  const userId = user.id;

  const handleGoBack = () => {
    router.back();
  };

  return (
    <div className='w-full'>
      {/* 상단 헤더 영역 */}
      <div className='flex items-center justify-between p-4 border-b border-gray-300'>
        {decodedAddressName && <p className='text-gray-500'>{decodedAddressName}</p>}
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
        addressName={decodedAddressName}
      />
    </div>
  );
};

export default PostPage;
