'use client';

import { getGroupPostsCoverImagesQuery } from '@/hooks/queries/post/useGroupPostsQuery';
import { searchPlaceSchema } from '@/schemas/searchPlaceSchema';
import { getAddress, keywordSearch } from '@/services/server-action/mapAction';
import type { Latlng, Location, LocationInfo } from '@/types/placeTypes';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'garlic-toast';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { useForm, type FieldValues } from 'react-hook-form';
import { Map, MapMarker, MarkerClusterer, Polyline } from 'react-kakao-maps-sdk';

const SEARCH_INPUT = 'searchInput';

const GroupMap = ({ groupId }: { groupId: string }) => {
  const route = useRouter();
  const [map, setMap] = useState<kakao.maps.Map>();
  const [isPostsView, setIsPostsView] = useState<boolean>(!!groupId ? true : false);
  const [postsPreView, setPostsPreview] = useState<{ postId: string; postImageUrl: string }[]>([]);
  const [searchResult, setSearchResult] = useState<{ markers: LocationInfo[]; hasMore: boolean }>({
    markers: [],
    hasMore: false,
  });
  const searchKeyword = useRef<{ keyword: string; page: number }>({ keyword: '', page: 1 });
  const [spotInfo, setSpotInfo] = useState<Omit<LocationInfo, 'id'>>();

  // const [polyline, setPolyline] = useState<Latlng[]>([]);
  const polyline: Latlng[] = [];

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

  const { data: postsCoverImages, isPending, isError, error } = getGroupPostsCoverImagesQuery(groupId);

  useEffect(() => {
    //TODO - 데스크탑에서만 동작하게
    setFocus(SEARCH_INPUT);
  }, []);

  if (searchTermInvalidate) toast.error(searchTermInvalidate.message as string);

  if (isPending) return <>로딩</>;

  if (isError) throw new Error(error.message);

  // if (map) {
  //   //TODO - 게시물들을 기준으로 지도 범위 재설정
  //   const bounds = new kakao.maps.LatLngBounds();
  //   postsCoverImages.forEach(({ post_lat, post_lng }) =>
  //     bounds.extend(new kakao.maps.LatLng(post_lat, post_lng)),
  //   );
  //   map.panTo(bounds);
  // }

  /** 키워드 검색 */
  const searchLocation = async ({ searchInput }: FieldValues) => {
    if (!map) {
      toast.error('지도를 불러오지 못 했습니다.');
      return;
    }
    isPostsView && setIsPostsView(false);

    const keyword = searchInput ?? searchKeyword.current.keyword;
    const { results, is_end } = await keywordSearch({ keyword, page: searchKeyword.current.page });
    setSearchResult(({ markers, hasMore }) =>
      searchInput ? { markers: results, hasMore } : { markers: [...markers, ...results], hasMore },
    );
    searchInput && moveToMarker(results[0]);

    if (is_end) {
      setSearchResult((prev) => {
        return { ...prev, hasMore: false };
      });
      searchKeyword.current = { keyword: '', page: 1 };
      return;
    }

    searchResult.hasMore ||
      setSearchResult((prev) => {
        return { ...prev, hasMore: true };
      });
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
  const moveToMarker = ({ placeName, address, lat, lng }: Partial<Location> & Latlng) => {
    if (!map) {
      toast.error('지도를 불러오지 못 했습니다.');
      return;
    }
    map.setLevel(4, { animate: true });
    map.panTo(new kakao.maps.LatLng(lat, lng));
    placeName && address && setSpotInfo({ placeName, address, lat, lng });
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

  /** 게시물 추가 라우팅 */
  const handleAddPostRoute = () => {
    if (isPostsView) {
      //TODO - 라우트 주소 수정하기
      route.push(`/group/${groupId}/`);
      return;
    }

    if (!spotInfo) return;
    const { lat, lng, placeName, address } = spotInfo;
    const place = placeName || address;

    //TODO - 라우트 주소 수정하기
    route.push(`/group/${groupId}/post?lat=${lat}&lng=${lng}&place=${place}`);
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
            <img src='/svgs/Reset_input.svg' />
          </button>
        )}
        <button type='submit'>
          <img src='/svgs/Map_Search.svg' />
        </button>
      </form>
      {searchResult.hasMore && (
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
        {isPostsView ? (
          <img src='/svgs/Switch_btn_to_mappin_marker.svg' />
        ) : (
          <img src='/svgs/Switch_btn_to_image_marker.svg' />
        )}
      </button>
      {isPostsView || <img src='/svgs/Mappin.svg' />}
      <Map
        className='w-full h-[50vh]'
        // TODO - 불러온 데이터들의 중심좌표로 초기 좌표 변경 getCenter()
        center={{ lat: 35.95, lng: 128.25 }}
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
            minLevel={10} // 클러스터 할 최소 지도 레벨
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
            onClustered={(test) => console.log(test)}
            // onClusterclick={}
          >
            {postsCoverImages.map(({ post_id, post_image_url, post_lat, post_lng }) => {
              polyline.push({ lat: post_lat, lng: post_lng });
              // setPolyline((prev) => [...prev, { lat: post_lat, lng: post_lng }]);
              return (
                <MapMarker
                  key={post_image_url}
                  position={{ lat: post_lat, lng: post_lng }}
                  onClick={() => {
                    moveToMarker({ lat: post_lat, lng: post_lng });
                    setPostsPreview([{ postId: post_id, postImageUrl: post_image_url }]);
                  }}
                  image={{
                    // 기본 마커 이미지
                    src: post_image_url,
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
            {searchResult.markers.map((marker) => (
              <MapMarker
                key={marker.id}
                position={{ lat: marker.lat, lng: marker.lng }}
                onClick={() => moveToMarker(marker)}
                image={{
                  src: '/svgs/Search_Result_Marker.svg',
                  size: {
                    width: 24,
                    height: 35,
                  },
                }}
              />
            ))}
          </>
        )}
        <Polyline
          path={[polyline]}
          strokeWeight={5} // 선의 두께 입니다
          strokeColor={'#FFAE00'} // 선의 색깔입니다
          strokeOpacity={0.7} // 선의 불투명도 입니다 1에서 0 사이의 값이며 0에 가까울수록 투명합니다
          strokeStyle={'solid'} // 선의 스타일입니다
        />
      </Map>
      <button onClick={handleFindUserLocation}>
        <img src='/svgs/Geolocation_btn.svg' />
      </button>
      <div>
        {!!spotInfo && (
          <>
            <h5>{spotInfo.placeName || spotInfo.address}</h5>
            <p>{spotInfo.placeName && spotInfo.address}</p>
          </>
        )}
        {!!postsPreView.length ? (
          postsPreView.map((post) => (
            <Link
              href={`/${post.postId}`}
              key={post.postId}
            >
              <img src={post.postImageUrl} />
            </Link>
          ))
        ) : (
          <button onClick={handleAddPostRoute}>추가하기</button>
        )}
      </div>
    </>
  );
};

export default GroupMap;
