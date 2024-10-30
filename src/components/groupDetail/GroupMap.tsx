'use client';

import { searchPlaceSchema } from '@/schemas/searchPlaceSchema';
import { keywordSearch } from '@/services/server-action/mapAction';
import type { LocationInfo } from '@/types/placesTypes';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'garlic-toast';
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { useForm, type FieldValues } from 'react-hook-form';
import { Map, MapMarker, MarkerClusterer } from 'react-kakao-maps-sdk';

const searchInput = 'searchInput';

const GroupMap = ({ groupId }: { groupId: string }) => {
  const route = useRouter();
  const map = useRef<kakao.maps.Map>();
  const [postMarkers, setPostMarkers] = useState();
  const [searchResultMarkers, setSearchResultMarkers] = useState<LocationInfo[]>([]);
  const [isPostsView, setIsPostsView] = useState<boolean>(!!groupId ? true : false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setFocus,
    getValues,
    resetField,
  } = useForm({
    mode: 'onSubmit',
    resolver: zodResolver(searchPlaceSchema),
  });

  const { searchTerm: searchTermInvalidate } = errors;
  if (searchTermInvalidate) {
    toast.error(searchTermInvalidate.message as string);
  }

  useEffect(() => {
    setFocus(searchInput);
  }, []);

  /** 키워드 검색 함수 */
  const searchLocation = async ({ searchInput }: FieldValues) => {
    if (!map.current) return;

    isPostsView && setIsPostsView(false);

    const { results, meta } = await keywordSearch({ keyword: searchInput });
    console.log("meta =>", meta);
    setSearchResultMarkers(results);

    // 검색된 장소 위치를 기준으로 지도 범위 재설정
    const bounds = new kakao.maps.LatLngBounds();
    results.forEach((result) => bounds.extend(new kakao.maps.LatLng(result.lat, result.lng)));
    map.current.panTo(bounds);
  };

  /** 사용자의 위치를 찾는 함수 */
  const handleFindUserLocation = () => {
    if (!navigator.geolocation) {
      toast.alert('위치 정보 제공 동의가 필요합니다.');
      return;
    }
    navigator.geolocation.getCurrentPosition((position) => {
      if (!map.current) return;
      const { latitude: lat, longitude: lng } = position.coords;
      map.current.setLevel(5, { animate: true });
      map.current.panTo(new kakao.maps.LatLng(lat, lng));
      setIsPostsView(false);
    });
  };

  /** 게시물을 추가할 장소 선택하는 함수 */
  const handleSelectSpot = async () => {
    const centerLatLng = map.current?.getCenter();
    if (!centerLatLng) return;
    route.push(`/group/${groupId}/tour?lat=${centerLatLng.getLat()}&lng=${centerLatLng.getLng()}`);
  };

  return (
    <>
      <form onSubmit={handleSubmit(searchLocation)}>
        <input
          className='text-black'
          placeholder='장소를 검색해보세요!'
          {...register(searchInput)}
        />
        {!!getValues(searchInput) && (
          <button
            type='button'
            onClick={() => resetField(searchInput)}
          >
            X
          </button>
        )}
        <button type='submit'>돋보기</button>
      </form>
      <button onClick={() => setIsPostsView((prev) => !prev)}>{isPostsView ? '마커 찍기' : '게시물 보기'}</button>
      <Map
        className='w-full h-[80vh]'
        // NOTE 불러온 데이터들의 중심좌표로 초기 좌표 변경 getCenter()
        center={{ lat: 35.5, lng: 127.5 }}
        onCreate={(kakaoMap) => (map.current = kakaoMap)}
        level={13}
        isPanto
      >
        {isPostsView ? (
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
            disableClickZoom={true} // 클러스터 마커를 클릭했을 때 지도가 확대되지 않도록 설정
            // onClusterclick={}
          >
            {/* {postMarkers.map((marker) => (
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
              ></MapMarker>
            ))} */}
          </MarkerClusterer>
        ) : (
          <>
            {searchResultMarkers.map((marker) => (
              <MapMarker
                key={marker.id}
                position={{ lat: marker.lat, lng: marker.lng }}
                onClick={() => {
                  if (!map.current) return;
                  // map.current.setLevel(5, { animate: true });
                  map.current.panTo(new kakao.maps.LatLng(marker.lat, marker.lng));
                }}
                image={{
                  src: 'https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/markerStar.png',
                  size: {
                    width: 24,
                    height: 35,
                  },
                }}
              />
            ))}
          </>
        )}
      </Map>
      <button onClick={handleFindUserLocation}>내 위치</button>
      {isPostsView || <button onClick={handleSelectSpot}>추가하기</button>}
    </>
  );
};

export default GroupMap;
