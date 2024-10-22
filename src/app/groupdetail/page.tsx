'use client';

import { useEffect } from 'react';

declare global {
  interface Window {
    kakao: any;
  }
}

type Props = {
  searchParams: { group_id: string };
};

const GroupDetailPage = ({ searchParams: { group_id } }: Props) => {
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
        return;
      });
    };

    kakaoMapScript.addEventListener('load', onLoadKakaoAPI);
  }, []);

  return (
    <div className='w-full h-[50vh] sm:h-[60vh] md:h-[70vh] lg:h-[80vh]'>
      <p>{group_id}</p>
      <div
        id='map'
        className='w-full h-full'
      ></div>
    </div>
  );
};

export default GroupDetailPage;
