'use client';

import { useEffect } from 'react';

declare global {
  interface Window {
    kakao: any;
  }
}

export default function Home() {
  useEffect(() => {
    const kakaoMapScript = document.createElement('script');
    kakaoMapScript.async = false;
    kakaoMapScript.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${process.env.NEXT_PUBLIC_KAKAO_KEY}&libraries=services,clusterer&autoload=false`;
    document.head.appendChild(kakaoMapScript);

    const onLoadKakaoAPI = () => {
      window.kakao.maps.load(() => {
        const container = document.getElementById('map');
        const options = {
          center: new window.kakao.maps.LatLng(33.450701, 126.570667),
          level: 3,
        };

        new window.kakao.maps.Map(container, options);
        return
      });
    };

    kakaoMapScript.addEventListener('load', onLoadKakaoAPI);
  }, []);

  return (
    <main className='w-full flex flex-col items-center justify-center pt-4'>
      <div className='w-full h-[50vh] sm:h-[60vh] md:h-[70vh] lg:h-[80vh]'>
        <div
          id='map'
          style={{ width: '100%', height: '100%' }}
        ></div>
      </div>
    </main>
  );
}
