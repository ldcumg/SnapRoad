'use client';

import Geolocation_btn from '@/../public/svgs/Geolocation_btn.svg';
import Map_Search from '@/../public/svgs/Map_Search.svg';
import Mappin from '@/../public/svgs/Mappin.svg';
import Reset_input from '@/../public/svgs/Reset_input.svg';
import Switch_btn_to_image_marker from '@/../public/svgs/Switch_btn_to_image_marker.svg';
import Switch_btn_to_mappin_marker from '@/../public/svgs/Switch_btn_to_mappin_marker.svg';
import { getGroupPostsQuery } from '@/hooks/queries/post/useGroupPostsQuery';
import { searchPlaceSchema } from '@/schemas/searchPlaceSchema';
import { keywordSearch } from '@/services/server-action/mapAction';
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
  const [searchResultMarkers, setSearchResultMarkers] = useState<LocationInfo[]>([]);
  const [hasMoreResults, setHasMoreResults] = useState<boolean>(false);
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

  const { data: groupPosts, isPending, isError, error } = getGroupPostsQuery(groupId);
  console.log('groupPosts =>', groupPosts);
  if (isPending) return <>로딩</>;

  if (isError) throw new Error(error.message);

  /** 키워드 검색 */
  const searchLocation = async ({ searchInput, more }: FieldValues) => {
    if (!map) {
      toast.error('지도를 불러오지 못 했습니다.');
      return;
    }
    isPostsView && setIsPostsView(false);

    const keyword = searchInput ?? searchKeyword.current.keyword;
    const {
      results,
      meta: { is_end },
    } = await keywordSearch({ keyword, page: searchKeyword.current.page });
    setSearchResultMarkers((prev) => (more ? [...prev, ...results] : results));

    // 검색된 장소 위치를 기준으로 지도 범위 재설정
    const bounds = new kakao.maps.LatLngBounds();
    results.forEach((result) => bounds.extend(new kakao.maps.LatLng(result.lat, result.lng)));
    map.panTo(bounds);

    if (is_end) {
      setHasMoreResults(false);
      searchKeyword.current = { keyword: '', page: 1 };
      return;
    }

    hasMoreResults || setHasMoreResults(true);
    more
      ? (searchKeyword.current.page = searchKeyword.current.page += 1)
      : (searchKeyword.current = { keyword: searchInput, page: (searchKeyword.current.page += 1) });
  };

  /** 사용자의 위치를 찾기 */
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
      setIsPostsView(false);
    });
  };

  /** 게시물을 추가할 장소 선택 */
  const handleSelectSpot = () => {
    if (!map) {
      toast.error('지도를 불러오지 못 했습니다.');
      return;
    }

    const centerLatLng = map.getCenter();
    if (!centerLatLng) return;
    route.push(`/group/${groupId}/post?lat=${centerLatLng.getLat()}&lng=${centerLatLng.getLng()}`);
  };

  /** 마커로 화면 이동 */
  const moveToMarker = (marker: LocationInfo) => {
    if (!map) {
      toast.error('지도를 불러오지 못 했습니다.');
      return;
    }

    map.setLevel(3, { animate: true });
    map.panTo(new kakao.maps.LatLng(marker.lat, marker.lng));
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
          onClick={() => searchLocation({ more: true })}
        >
          더보기
        </button>
      )}
      <button onClick={() => setIsPostsView((prev) => !prev)}>
        {isPostsView ? <Switch_btn_to_mappin_marker /> : <Switch_btn_to_image_marker />}
      </button>
      {isPostsView || <Mappin />}
      <Map
        className='w-full h-[70vh]'
        // TODO - 불러온 데이터들의 중심좌표로 초기 좌표 변경 getCenter()
        center={{ lat: 35.5, lng: 127.5 }}
        onCreate={setMap}
        level={13}
        isPanto={true}
      >
        {isPostsView && !!groupPosts.length ? (
          <MarkerClusterer
            averageCenter={true}
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
            // onClustered={}
            disableClickZoom={true}
            // onClusterclick={}
          >
            {groupPosts.map(({ post_id, images }) => {
              const primaryImage = images.find((image) => image.is_cover);
              if (!primaryImage) return;
              const { post_image_url, post_image_name, post_lat, post_lng } = primaryImage;
              return (
                <MapMarker
                  key={post_id}
                  position={{ lat: Number(post_lat), lng: Number(post_lng) }}
                  // onClick={() => setInfo(post)}
                  image={{
                    // 기본 마커 이미지
                    src: post_image_url,
                    size: {
                      width: 24,
                      height: 35,
                    }, // 마커이미지의 크기
                    options: { alt: post_image_name },
                  }}
                  // title={post_image_name} // 마우스 호버 시 표시
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
      <button onClick={handleSelectSpot}>추가하기</button>
    </>
  );
};

export default GroupMap;
