'use client';

import dynamic from 'next/dynamic';
import { useState } from 'react';

// ClientPage와 ServerPage를 동적으로 import(최적화)
// 동적으로 import하여 필요할 때만 로드
const ClientPage = dynamic(() => import('./client'), { loading: () => <p>로딩 중...</p> });
const ServerPage = dynamic(() => import('./server'), { loading: () => <p>로딩 중...</p> });

const TourPage = () => {
  const [showClient, setShowClient] = useState<boolean>(false);
  const [showServer, setShowServer] = useState<boolean>(false);

  return (
    <div className='Tour'>
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
    </div>
  );
};
export default TourPage;
