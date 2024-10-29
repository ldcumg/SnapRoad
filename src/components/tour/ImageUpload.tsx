'use client';

import { useImageMutations } from '@/hooks/queries/byUse/useImageMutations';
import { useSessionQuery } from '@/hooks/queries/byUse/useSessionQuery';
import { downloadSingleFile, downloadAllAsZip } from '@/services/client-action/downloadAction';
import { formatDateToNumber } from '@/utils/dateUtils';
import { useState } from 'react';

const ImageUpload = () => {
  const currentDate = new Date().toISOString();
  const formattedDate = formatDateToNumber(new Date().toString()) || '';

  const { data: session, isLoading: sessionLoading, error: sessionError } = useSessionQuery();
  const userId = session?.user?.id;

  const { uploadImageMutation, setCoverImageMutation, deleteImageMutation } = useImageMutations(userId, currentDate);
  const [error, setError] = useState<string | null>(null);

  if (sessionError) return <p>세션 로드에 실패했습니다.</p>;
  if (sessionLoading) return <div>로딩 중...</div>;
  if (!userId) return <p>로그인이 필요합니다.</p>;

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files ? Array.from(e.target.files) : [];
    if (!files.length) return setError('업로드할 파일을 선택하세요.');

    const exifResponse = await fetch('/api/upload', { method: 'POST', body: new FormData() });
    const exifDataArray = await exifResponse.json();

    uploadImageMutation.mutate({ files, exifDataArray });
  };

  return (
    <section>
      <article>
        <input
          type='file'
          accept='image/*'
          multiple
          onChange={handleImageUpload}
        />

        {error && <p className='text-red-500'>{error}</p>}

        {uploadImageMutation.data?.map((image, index) => (
          <div
            key={image.id}
            style={{ maxWidth: '300px', margin: '10px' }}
          >
            <img
              src={image.blobUrl}
              alt={`업로드 이미지 ${index}`}
              style={{ width: '100%' }}
            />
            <p>파일명: {image.filename}</p>
            <button onClick={() => downloadSingleFile('tour_images', image.filename, 'group_name')}>
              개별 다운로드
            </button>
            <button onClick={() => deleteImageMutation.mutate({ id: image.id, filename: image.filename })}>삭제</button>
            <button onClick={() => setCoverImageMutation.mutate({ id: image.id, createdAt: image.created_at })}>
              {image.is_cover ? '대표 이미지로 설정됨' : '대표 이미지 설정'}
            </button>
          </div>
        ))}

        <button
          onClick={() =>
            downloadAllAsZip('tour_images', uploadImageMutation.data || [], `images_${formattedDate}.zip`, 'group_name')
          }
        >
          ZIP 파일로 다운로드
        </button>
      </article>
    </section>
  );
};

export default ImageUpload;
