'use client';

import { formatDateToNumber } from '@/utils/dateUtils';
import exifr from 'exifr';
import { useState } from 'react';

interface ExifData {
  latitude: string;
  longitude: string;
  dateTaken: string;
  name: string;
  thumbnail: string;
}

const FileUpload = () => {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [exifDataList, setExifDataList] = useState<ExifData[]>([]); // 다중 파일 EXIF 데이터
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) setSelectedFiles(Array.from(e.target.files));
  };

  // EXIF 데이터를 추출하고 이미지를 회전시키는 함수
  const adjustImageOrientation = async (imgElement: HTMLImageElement, file: File) => {
    try {
      const exifData = await exifr.parse(file); // EXIF 데이터 추출
      console.log('EXIF 데이터:', exifData);

      const orientation = exifData?.Orientation;
      console.log('Orientation:', orientation); // 이미지 돌아가는거

      if (orientation) {
        switch (orientation) {
          case 6: // Rotate 90 degrees
            imgElement.style.transform = 'rotate(90deg)';
            break;
          case 8: // Rotate -90 degrees
            imgElement.style.transform = 'rotate(-90deg)';
            break;
          case 3: // Rotate 180 degrees
            imgElement.style.transform = 'rotate(180deg)';
            break;
          default:
            imgElement.style.transform = 'rotate(0deg)';
            break;
        }
      } else {
        console.warn('Orientation 정보를 찾을 수 없습니다.');
      }
    } catch (err) {
      console.error('EXIF 데이터 추출 실패:', err);
    }
  };

  const handleUpload = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (selectedFiles.length === 0) return;

    const formData = new FormData();
    selectedFiles.forEach((file) => {
      formData.append('photos', file);
    }); // photos 필드로 추가

    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (res.ok) {
        const data = await res.json();
        console.log(data);
        setExifDataList(data); // 다중 파일 데이터 저장
      } else {
        setError('EXIF 데이터를 가져오는 데 실패했습니다.');
      }
    } catch (err) {
      setError('파일 업로드 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }

    console.log(selectedFiles);
  };

  return (
    <>
      <article>
        <form onSubmit={handleUpload}>
          <input
            type='file'
            accept='image/*'
            multiple
            onChange={handleFileChange}
          />
          <button>업로드 하기</button>
        </form>

        {loading && <p>로딩 중...</p>}
        {error && <p>{error}</p>}

        <hr />

        {exifDataList.length > 0 && (
          <div className='flex flex-row gap-2 p-3'>
            {exifDataList.map((data, index) => (
              <div
                key={index}
                className='border border-black'
              >
                {data.thumbnail !== '썸네일 없음' && (
                  <>
                    {/* <img
                      src={data.thumbnail}
                      alt='썸네일'
                      style={{ maxWidth: '150px', height: 'auto' }}
                      onLoad={(e) => adjustImageOrientation(e.currentTarget, selectedFiles[index])} // 이미지 로드 후 회전
                    /> */}
                    <img
                      src={data.thumbnail}
                      alt='썸네일'
                      style={{ maxWidth: '150px', height: 'auto' }}
                    />
                  </>
                )}
                <h3>파일명 : {data.name}</h3>
                <p>촬영 날짜 : {data.dateTaken}</p>
                <p>{formatDateToNumber(data.dateTaken)}</p>
                <p>위도: {data.latitude}</p>
                <p>경도: {data.longitude}</p>
              </div>
            ))}
          </div>
        )}

        <hr />
      </article>
    </>
  );
};

export default FileUpload;
