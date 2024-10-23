'use client';

import { Map, MapMarker, MarkerClusterer } from 'react-kakao-maps-sdk';

const GroupMap = () => {
  const positions = [
    {
      title: '카카오',
      latlng: { lat: 33.450705, lng: 126.570677 },
    },
    {
      title: '생태연못',
      latlng: { lat: 33.450936, lng: 126.569477 },
    },
    {
      title: '텃밭',
      latlng: { lat: 33.450879, lng: 126.56994 },
    },
    {
      title: '근린공원',
      latlng: { lat: 33.451393, lng: 126.570738 },
    },
  ];
  return (
    <>
      <div>검색창</div>
      <Map
        className='w-full h-[90vh]'
        center={{ lat: 33.450705, lng: 126.570677 }}
      >
        <MarkerClusterer
          averageCenter={true} // 클러스터에 포함된 마커들의 평균 위치를 클러스터 마커 위치로 설정
          minLevel={5} // 클러스터 할 최소 지도 레벨
          styles={[
            {
              fontSize: '0px',
              width: '100px',
              height: '70px',
              // 클러스터 마커 이미지
              background: 'url("https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/marker_red.png") no-repeat',
              positon: 'getCenter',
            },
          ]}
        >
          {positions.map((position) => (
            <MapMarker
              key={`${position.title}-${position.latlng}`}
              position={position.latlng} // 마커를 표시할 위치
              image={{
                // 기본 마커 이미지
                src: 'https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/markerStar.png',
                size: {
                  width: 24,
                  height: 35,
                }, // 마커이미지의 크기입니다
              }}
              title={position.title} // 마우스 호버 시 표시
            />
          ))}
        </MarkerClusterer>
      </Map>
    </>
  );
};

export default GroupMap;
