'use client';

import Geolocation_btn from '@/../public/svgs/Geolocation_btn.svg';
import Map_Search from '@/../public/svgs/Map_Search.svg';
import Mappin from '@/../public/svgs/Mappin.svg';
import Reset_input from '@/../public/svgs/Reset_input.svg';
import Switch_btn_to_image_marker from '@/../public/svgs/Switch_btn_to_image_marker.svg';
import Switch_btn_to_mappin_marker from '@/../public/svgs/Switch_btn_to_mappin_marker.svg';
import { getGroupPostsCoverImagesQuery } from '@/hooks/queries/post/useGroupPostsQuery';
import { searchPlaceSchema } from '@/schemas/searchPlaceSchema';
import { getAddress, keywordSearch } from '@/services/server-action/mapAction';
import type { LocationInfo } from '@/types/placeTypes';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'garlic-toast';
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { useForm, type FieldValues } from 'react-hook-form';
import { Map, MapMarker, MarkerClusterer } from 'react-kakao-maps-sdk';

const SEARCH_INPUT = 'searchInput';

const GroupMap = ({ groupId }: { groupId: string }) => {
  const route = useRouter();
  const [map, setMap] = useState<kakao.maps.Map>();
  const [isPostsView, setIsPostsView] = useState<boolean>(!!groupId ? true : false);
  //TODO - 객체로
  const [searchResultMarkers, setSearchResultMarkers] = useState<LocationInfo[]>([]);
  const [hasMoreResults, setHasMoreResults] = useState<boolean>(false);

  const [spotInfo, setSpotInfo] = useState<Omit<LocationInfo, 'id'>>();
  const searchKeyword = useRef<{ keyword: string; page: number }>({ keyword: '', page: 1 });

  const {
    register,
    handleSubmit,
    setFocus,
    getValues,
    resetField,
    formState: {
      errors: { searchTerm: searchTermInvalidate },
    },
  } = useForm({
    mode: 'onSubmit',
    resolver: zodResolver(searchPlaceSchema),
  });

  useEffect(() => {
    //TODO - 데스크탑에서만 동작하게
    setFocus(SEARCH_INPUT);
  }, []);

  if (searchTermInvalidate) {
    toast.error(searchTermInvalidate.message as string);
  }

  const { data: postsCoverImages, isPending, isError, error } = getGroupPostsCoverImagesQuery(groupId);
  if (isPending) return <>로딩</>;

  if (isError) throw new Error(error.message);

  /** 키워드 검색 */
  const searchLocation = async ({ searchInput }: FieldValues) => {
    if (!map) {
      toast.error('지도를 불러오지 못 했습니다.');
      return;
    }
    isPostsView && setIsPostsView(false);

    const keyword = searchInput ?? searchKeyword.current.keyword;
    const { results, is_end } = await keywordSearch({ keyword, page: searchKeyword.current.page });
    setSearchResultMarkers((prev) => (searchInput ? results : [...prev, ...results]));
    searchInput && moveToMarker(results[0]);

    // 검색된 장소 위치를 기준으로 지도 범위 재설정
    // const bounds = new kakao.maps.LatLngBounds();
    // results.forEach((result) => bounds.extend(new kakao.maps.LatLng(result.lat, result.lng)));
    // map.panTo(bounds);

    if (is_end) {
      setHasMoreResults(false);
      searchKeyword.current = { keyword: '', page: 1 };
      return;
    }

    hasMoreResults || setHasMoreResults(true);
    searchInput
      ? (searchKeyword.current = { keyword: searchInput, page: (searchKeyword.current.page += 1) })
      : (searchKeyword.current.page = searchKeyword.current.page += 1);
  };

  /** 사용자의 위치 찾기 */
  const handleFindUserLocation = () => {
    if (!map) {
      toast.error('지도를 불러오지 못 했습니다.');
      return;
    }

    if (!navigator.geolocation) {
      toast.alert('위치 정보 제공 동의가 필요합니다.');
      return;
    }

    navigator.geolocation.getCurrentPosition((position) => {
      const { latitude: lat, longitude: lng } = position.coords;
      map.setLevel(5, { animate: true });
      map.panTo(new kakao.maps.LatLng(lat, lng));
      isPostsView && setIsPostsView(false);
    });
  };

  /** 마커로 화면 이동 */
  const moveToMarker = ({ placeName, address, lat, lng }: LocationInfo) => {
    if (!map) {
      toast.error('지도를 불러오지 못 했습니다.');
      return;
    }
    map.setLevel(4, { animate: true });
    map.panTo(new kakao.maps.LatLng(lat, lng));
    setSpotInfo({ placeName, address, lat, lng });
  };

  /** 중심 좌표의 장소 정보 요청 */
  const getSpotInfo = async () => {
    if (!map) return;
    const latlng = map.getCenter();

    const lat = latlng.getLat();
    const lng = latlng.getLng();
    const address = await getAddress({ lat, lng });
    setSpotInfo({ placeName: '', address, lat, lng });
  };

  /** 게시물을 추가 라우팅 */
  const handleAddPostRoute = () => {
    if (isPostsView) {
      //TODO - 라우트 주소 고치기
      route.push(`/group/${groupId}/임시`);
      return;
    }

    if (!spotInfo) return;
    const { lat, lng, placeName, address } = spotInfo;
    const place = placeName || address;

    route.push(`/group/${groupId}/임시?lat=${lat}&lng=${lng}&place=${place}`);
  };

  return (
    <>
      <form onSubmit={handleSubmit(searchLocation)}>
        <input
          className='text-black'
          placeholder='장소를 검색해보세요!'
          {...register(SEARCH_INPUT)}
        />
        {!!getValues(SEARCH_INPUT) && (
          <button
            type='button'
            onClick={() => resetField(SEARCH_INPUT)}
          >
            <Reset_input />
          </button>
        )}
        <button type='submit'>
          <Map_Search />
        </button>
      </form>
      {hasMoreResults && (
        <button
          type='button'
          onClick={searchLocation}
        >
          더보기
        </button>
      )}
      <button
        onClick={() => {
          setIsPostsView((prev) => !prev);
          isPostsView ? getSpotInfo() : setSpotInfo(undefined);
        }}
      >
        {isPostsView ? <Switch_btn_to_mappin_marker /> : <Switch_btn_to_image_marker />}
      </button>
      {isPostsView || <Mappin />}
      <Map
        className='w-full h-[50vh]'
        // TODO - 불러온 데이터들의 중심좌표로 초기 좌표 변경 getCenter()
        center={{ lat: 35.5, lng: 127.5 }}
        onCreate={setMap}
        level={13}
        isPanto={true}
        onDragEnd={() => {
          isPostsView || getSpotInfo();
        }}
      >
        {isPostsView && !!postsCoverImages.length ? (
          <MarkerClusterer
            averageCenter={true}
            minLevel={7} // 클러스터 할 최소 지도 레벨
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
            disableClickZoom={true}
            // onClusterclick={}
          >
            {postsCoverImages.map((image) => {
              return (
                <MapMarker
                  key={image.id}
                  position={{ lat: Number(image.post_lat), lng: Number(image.post_lng) }}
                  // onClick={() => setInfo(post)}
                  image={{
                    // 기본 마커 이미지
                    src: image.post_image_url,
                    size: {
                      width: 50,
                      height: 50,
                    }, // 마커이미지의 크기
                    // options: { alt: image.post_image_name },
                  }}
                  // title={image.post_image_name} // 마우스 호버 시 표시
                />
              );
            })}
          </MarkerClusterer>
        ) : (
          <>
            {searchResultMarkers.map((marker) => (
              <MapMarker
                key={marker.id}
                position={{ lat: marker.lat, lng: marker.lng }}
                onClick={() => moveToMarker(marker)}
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
      <button onClick={handleFindUserLocation}>
        <Geolocation_btn />
      </button>
      <div>
        {!!spotInfo && (
          <>
            <h5>{spotInfo.placeName || spotInfo.address}</h5>
            <p>{spotInfo.placeName && spotInfo.address}</p>
          </>
        )}
        <button onClick={handleAddPostRoute}>추가하기</button>
      </div>
    </>
  );
};

export default GroupMap;
