'use client';

import dynamic from 'next/dynamic';
import { useState } from 'react';

interface ExifData {
  latitude: string;
  longitude: string;
  dateTaken: string;
  name: string;
  thumbnail: string;
}

// ClientPage와 ServerPage를 동적으로 import(최적화)
// 동적으로 import하여 필요할 때만 로드
const ClientPage = dynamic(() => import('./client'), { loading: () => <p>로딩 중...</p> });
const ServerPage = dynamic(() => import('./server'), { loading: () => <p>로딩 중...</p> });

const TourPage = () => {
  const [showClient, setShowClient] = useState<boolean>(false);
  const [showServer, setShowServer] = useState<boolean>(false);

  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [exifDataList, setExifDataList] = useState<ExifData[]>([]); // 다중 파일 EXIF 데이터
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) setSelectedFiles(Array.from(e.target.files));
  };

  const handleUpload = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (selectedFiles.length === 0) return;

    const formData = new FormData();
    selectedFiles.forEach((file) => {
      formData.append('photos', file);
    }); //photos 필드로 추가

    setLoading(true);
    setError(null);
  };

  return (
    <section className='Tour'>
      <nav>
        <ul className='flex gap-2'>
          <li>
            <h1
              className='text-xl font-bold cursor-pointer'
              onClick={() => setShowClient(!showClient)}
            >
              클라이언트
            </h1>
            {showClient && <ClientPage />}
          </li>
          <li>
            <h1
              className='text-xl font-bold cursor-pointer'
              onClick={() => setShowServer(!showServer)}
            >
              서버
            </h1>
            {showServer && <ServerPage />}
          </li>
        </ul>
      </nav>
      <hr />

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

        <h2>EXIF 데이터 예시</h2>
        <hr />

        <div></div>
      </article>
    </section>
  );
};
export default TourPage;
