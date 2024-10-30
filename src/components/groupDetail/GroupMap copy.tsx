'use client';

import { searchPlaceSchema } from '@/schemas/searchPlaceSchema';
import type { LocationInfo } from '@/types/placesTypes';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'garlic-toast';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { useForm, type FieldValues } from 'react-hook-form';
import { Map, MapMarker, MarkerClusterer } from 'react-kakao-maps-sdk';

type Markers = {
  searchResultMarkers: LocationInfo[];
  pointMarker: LocationInfo | null;
  postMarkers: null;
};

const searchInput = 'searchInput';

const GroupMap = () => {
  const map = useRef<kakao.maps.Map>();
  const [postMarkers, setPostMarkers] = useState();
  const [searchResultMarkers, setSearchResultMarkers] = useState<LocationInfo[]>([]);
  const [selectMarker, setSelectMarker] = useState<LocationInfo | null>(null);
  // QUESTION - state 객체로 묶기?
  // const [markers, setMarkers] = useState<Markers>({
  //   searchResultMarkers: [],
  //   spotMarker: null,
  //   postMarkers: null,
  // });

  const [isPostsView, setIsPostsView] = useState<boolean>(true);

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
  const searchLocation = ({ searchInput }: FieldValues) => {
    setIsPostsView(false);
    const kakaoPlacesSearch = new kakao.maps.services.Places();

    kakaoPlacesSearch.keywordSearch(
      searchInput,
      (results, status, pagination) => {
        if (status !== kakao.maps.services.Status.OK || !map.current) {
          toast.error('검색 결과를 불러오지 못 했습니다.');
          return;
        }

        const bounds = new kakao.maps.LatLngBounds();
        const mappedResults = results.map((result) => {
          return { ...result, lat: Number(result.y), lng: Number(result.x) };
        }) as LocationInfo[];
        mappedResults.forEach((result) => bounds.extend(new kakao.maps.LatLng(result.lat, result.lng)));

        const fistResult = mappedResults.shift() as LocationInfo;
        setSelectMarker(fistResult);
        setSearchResultMarkers(mappedResults);

        // 검색된 장소 위치를 기준으로 지도 범위 재설정
        map.current.panTo(bounds);
      },
      // {
      //   page: 1,
      // },
    );
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
            onClick={() => {
              resetField(searchInput);
            }}
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
        onClick={(_, mouseEvent) => {
          const latlng = mouseEvent.latLng;
          !!selectMarker?.id && setSearchResultMarkers((prev) => [selectMarker, ...prev]);
          setSelectMarker({
            lat: latlng.getLat(),
            lng: latlng.getLng(),
          });
        }}
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
            {!!selectMarker && (
              <MapMarker
                position={{ lat: selectMarker.lat, lng: selectMarker.lng }}
                onClick={() => {
                  if (!map.current) return;
                  map.current.setLevel(5, { animate: true });
                  map.current.panTo(new kakao.maps.LatLng(selectMarker.lat, selectMarker.lng));
                  // TODO - 인포 띄우기
                }}
                draggable={true}
                // TODO - 인포 지우기
                // onDragStart={}
                onDragEnd={(map) => console.log(map.getPosition())}
              >
                {selectMarker.place_name}
              </MapMarker>
            )}
            {searchResultMarkers.map((marker) => (
              <MapMarker
                key={marker.id}
                position={{ lat: marker.lat, lng: marker.lng }}
                onClick={() => {
                  setSelectMarker(marker);
                  !!selectMarker &&
                    setSearchResultMarkers((prev) => [selectMarker, ...prev].filter((m) => m.id !== marker.id));
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
      <button
        onClick={() => {
          if (navigator.geolocation) {
            !!selectMarker?.id && setSearchResultMarkers((prev) => [selectMarker, ...prev]);
            navigator.geolocation.getCurrentPosition((position) => {
              if (!map.current) return;
              const { latitude: lat, longitude: lng } = position.coords;
              map.current.setLevel(5, { animate: true });
              map.current.panTo(new kakao.maps.LatLng(lat, lng));
              setSelectMarker({ lat, lng });
              setIsPostsView(false);
            });
          }
        }}
      >
        내 위치
      </button>
      {/* NOTE 임시 라우트 주소 */}
      {selectMarker &&
        (isPostsView || <Link href={`/ceatePost?lat=${selectMarker.lat}&lng=${selectMarker.lng}`}>추가하기</Link>)}
    </>
  );
};

export default GroupMap;