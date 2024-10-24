'use client';
import { useState } from 'react';
import JSZip from 'jszip';
import FileUpload from '@/components/tour/FileUpload';
import { uploadImage } from '@/services/client-action/uploadImage';
import { saveAs } from 'file-saver';

const TourPage = () => {
  const [imageData, setImageData] = useState<{ url: string; filename: string }[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files ? Array.from(e.target.files) : [];
    if (files.length === 0) return;
    setLoading(true);
    setError(null);
    try {
      const uploadedFiles = await uploadImage(files);
      uploadedFiles.length > 0 ? setImageData(uploadedFiles) : setError('이미지 업로드에 실패했습니다.');
    } catch (err) {
      setError('이미지 업로드에 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };
  // 모든 이미지를 하나씩 모두 다운로드
  const handleDownloadAll = async () => {
    for (const image of imageData) {
      const response = await fetch(image.url);
      const blob = await response.blob();
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = image.filename;
      link.click();
    }
  };
  // ZIP으로 모든 이미지를 다운로드
  const handleDownloadAllAsZip = async () => {
    const zip = new JSZip();
    for (const image of imageData) {
      const response = await fetch(image.url);
      const blob = await response.blob();
      zip.file(image.filename, blob); // 각 이미지를 ZIP에 추가
    }
    const zipBlob = await zip.generateAsync({ type: 'blob' });
    saveAs(zipBlob, 'images.zip');
  };
  // 개별 이미지를 다운로드
  const handleDownloadSingle = async (url: string, filename: string) => {
    const response = await fetch(url);
    const blob = await response.blob();
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    link.click();
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
        {loading && <p>이미지 업로드 중...</p>}
        {error && <p className='text-red-500'>{error}</p>}
        <p>Tour_Images</p>
        <div className='flex flex-row gap-2 p-3'>
          {imageData.length > 0 && (
            <div className='flex flex-row border border-black'>
              {imageData.map((image, index) => (
                <div
                  key={index}
                  style={{ maxWidth: '300px', margin: '10px' }}
                >
                  <img
                    src={image.url}
                    alt={`업로드 이미지 ${index}`}
                  />
                  <p>{image.filename}</p>
                  <button onClick={() => handleDownloadSingle(image.url, image.filename)}>개별 다운로드</button>
                </div>
              ))}
            </div>
          )}
        </div>
        {imageData.length > 0 && (
          <>
            <button onClick={handleDownloadAll}>모든 이미지 다운로드</button>
            <button onClick={handleDownloadAllAsZip}>ZIP 파일로 다운로드</button>
          </>
        )}
        <hr />
      </article>
      <FileUpload />
    </section>
  );
};
export default TourPage;
