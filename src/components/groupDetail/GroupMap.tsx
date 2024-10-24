'use client';

import { searchPlaceSchema } from '@/schemas/searchPlaceSchema';
import type { LocationInfo } from '@/types/placesTypes';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'garlic-toast';
import { useState } from 'react';
import { useForm, type FieldValues } from 'react-hook-form';
import { Map, MapMarker, MarkerClusterer } from 'react-kakao-maps-sdk';

const GroupMap = () => {
  const [info, setInfo] = useState<LocationInfo>();
  const [markers, setMarkers] = useState<LocationInfo[]>([]);
  const [map, setMap] = useState<any>(); // TODO 타입 지정하기

  const { register, handleSubmit, formState } = useForm({
    mode: 'onSubmit',
    resolver: zodResolver(searchPlaceSchema),
  });

  const { searchTerm } = formState.errors;
  if (searchTerm) {
    toast.error(searchTerm.message as string);
  }

  const searchLocation = ({ searchTerm }: FieldValues) => {
    if (!map) return;

    const ps = new kakao.maps.services.Places();

    ps.keywordSearch(searchTerm, (results, status, pagination) => {
      console.log('results', results);
      if (status !== kakao.maps.services.Status.OK) {
        toast.error('검색 결과를 불러오지 못 했습니다.');
        return;
      }

      // 검색된 장소 위치를 기준으로 지도 범위를 재설정하기위해 LatLngBounds 객체에 좌표 추가
      const bounds = new kakao.maps.LatLngBounds();
      const resultMarkers: LocationInfo[] = [];

      // 검색 결과 중 필요한 데이터만 marks state에 저장
      results.forEach((result) => {
        resultMarkers.push({
          position: {
            lat: Number(result.y),
            lng: Number(result.x),
          },
          title: result.place_name,
        });
        bounds.extend(new kakao.maps.LatLng(Number(result.y), Number(result.x)));
      });
      setMarkers(resultMarkers);

      // 검색된 장소 위치를 기준으로 지도 범위 재설정
      map.setBounds(bounds);
    });
  };

  return (
    <>
      <form onSubmit={handleSubmit(searchLocation)}>
        <input
          className='text-black'
          placeholder='장소를 검색해보세요!'
          {...register('searchTerm')}
        />
        <button>돋보기</button>
      </form>
      <Map
        className='w-full h-[90vh]'
        // todo 불러온 데이터들의 중심좌표로 초기 좌표 변경 getCenter()
        center={{ lat: 33.450705, lng: 126.570677 }}
        onCreate={setMap}
      >
        <MarkerClusterer
          averageCenter={true} // 클러스터에 포함된 마커들의 평균 위치를 클러스터 마커 위치로 설정
          minLevel={5} // 클러스터 할 최소 지도 레벨
          styles={[
            {
              fontSize: '20px',
              color: 'black',
              width: '100px',
              height: '70px',
              // 클러스터 마커 이미지
              background: 'url("https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/marker_red.png") no-repeat',
              positon: 'getCenter',
            },
          ]}
        >
          {markers.map((marker) => (
            <MapMarker
              key={`marker-${marker.title}-${marker.position.lat},${marker.position.lng}`}
              position={marker.position}
              onClick={() => setInfo(marker)}
              image={{
                // 기본 마커 이미지
                src: 'https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/markerStar.png',
                size: {
                  width: 24,
                  height: 35,
                }, // 마커이미지의 크기
              }}
              title={marker.title} // 마우스 호버 시 표시
            >
              {info && info.title === marker.title && <p className='text-black'>{marker.title}</p>}
            </MapMarker>
          ))}
        </MarkerClusterer>
      </Map>
    </>
  );
};

export default GroupMap;
