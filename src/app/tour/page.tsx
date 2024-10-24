'use client';

import FileUpload from '@/components/tour/FileUpload';
import { uploadImage } from '@/services/client-action/uploadImage';
import { formatDateToNumber } from '@/utils/dateUtils';
import { downloadSingleFile, downloadAllAsZip } from '@/utils/downloadUtils';
import { useState } from 'react';

const TourPage = () => {
  const bucketName = 'tour_images';
  const folderName = 'group_name';
  const formattedDate = formatDateToNumber(new Date().toString());

  const [imageData, setImageData] = useState<{ url: string; filename: string }[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files ? Array.from(e.target.files) : [];
    if (!files.length) {
      setError('업로드할 파일을 선택하세요.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const uploadedFiles = await uploadImage(files);
      if (uploadedFiles.length) {
        setImageData(uploadedFiles);
        console.log('이미지 업로드에 성공했습니다.');
      } else {
        setError('이미지 업로드에 실패했습니다.');
      }
    } catch (err) {
      console.error('이미지 업로드 에러:', err);
      setError('이미지 업로드 중 문제가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const renderUploadStatus = () => {
    if (loading) return <p>이미지 업로드 중...</p>;
    if (error) return <p className='text-red-500'>{error}</p>;
    return null;
  };

  return (
    <section>
      <article>
        <input
          type='file'
          accept='image/*'
          multiple
          onChange={handleImageUpload}
          // disabled={loading}
        />

        {renderUploadStatus()}

        {imageData.length > 0 && (
          <>
            <div className='flex flex-row gap-2 p-3'>
              {imageData.map((image, index) => (
                <div
                  key={index}
                  style={{ maxWidth: '300px', margin: '10px' }}
                >
                  <img
                    src={image.url}
                    alt={`업로드 이미지 ${index}`}
                    style={{ width: '100%' }}
                  />
                  <p>{image.filename}</p>
                  <button
                    onClick={() => downloadSingleFile(bucketName, image.filename, folderName)}
                    // disabled={loading}
                  >
                    개별 다운로드
                  </button>
                </div>
              ))}
            </div>
            <button
              onClick={() => downloadAllAsZip(bucketName, imageData, `images_${formattedDate}.zip`, folderName)}
              // disabled={loading || imageData.length === 0}
            >
              ZIP 파일로 다운로드
            </button>
          </>
        )}
        <hr />
      </article>
      <FileUpload />
    </section>
  );
};

export default TourPage;
