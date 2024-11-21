'use client';

import PlaceSearchForm from './PlaceSearchForm';
import PostsPreview from './PostsPreview';
import PostsPreviewLayout from './PostsPreviewLayout';
import SearchResult from './SearchResult';
import SearchResultLayout from './SearchResultLayout';
import Loading from '@/app/loading';
import useKakaoMap from '@/hooks/map/useKakaoMap';
import { getGroupPostsCoverImagesQuery } from '@/hooks/queries/post/useGroupPostsQuery';
import IconGeolocation from '@/lib/icon/Icon_Geolocation';
import IconPostPlus from '@/lib/icon/Icon_Post_Plus';
import IconSwitchToMappin from '@/lib/icon/Icon_Switch_To_Mappin';
import IconSwitchToPostMarker from '@/lib/icon/Icon_Switch_To_Post_Marker';
import MapPin from '@/lib/icon/Map_Pin';
import SearchResultMarker from '@/lib/icon/Search_Result_Marker';
import useBottomSheetStore from '@/stores/story/useBottomSheetStore';
import { Button } from '@/stories/Button';
import type { ClusterStyle, LatLng, LocationInfo } from '@/types/mapTypes';
import { useEffect, useState } from 'react';
import { useKakaoLoader, Map, MapMarker, MarkerClusterer, Polyline, CustomOverlayMap } from 'react-kakao-maps-sdk';

type Props = {
  groupId: string;
  desktop: boolean;
  point: { lat: number; lng: number } | undefined;
};

const GroupMap = ({ groupId, desktop, point }: Props) => {
  const { handleCustomOpen } = useBottomSheetStore((state) => state);
  const [map, setMap] = useState<kakao.maps.Map>();
  const [isPostsView, setIsPostsView] = useState<boolean>(true);
  const [postsPreView, setPostsPreview] = useState<{ postId: string; postImageUrl: string }[]>([]);
  const [searchResult, setSearchResult] = useState<{ markers: LocationInfo[]; hasMore: boolean }>({
    markers: [],
    hasMore: false,
  });
  const [spotInfo, setSpotInfo] = useState<Omit<LocationInfo, 'id'> | null>(null);
  const [clusterStyle, setClusterStyle] = useState<ClusterStyle[]>([]);
  const [isInputFocus, setIsInputFocus] = useState<boolean>(false);
  const polyline: LatLng[] = [];
  const {
    createSearchFunction,
    getSpotInfo,
    handleFindUserLocation,
    moveToMarker,
    clusterClickEvent,
    handleAddPostRoute,
    onClusteredEvent,
    clusterCalculator,
  } = useKakaoMap(map as kakao.maps.Map);
  const searchLocation = createSearchFunction({
    setSpotInfo,
    isPostsView,
    setIsPostsView,
    searchResult,
    setSearchResult,
    isInputFocus,
    setIsInputFocus,
  });

  const { data: postsCoverImages, isPending, isError, error } = getGroupPostsCoverImagesQuery(groupId);

  const [mapLoading, mapError] = useKakaoLoader({
    appkey: process.env.NEXT_PUBLIC_KAKAO_KEY!,
    libraries: ['services', 'clusterer'],
  });

  // 게시물 좌표 기준으로 지도 위치 재설정
  useEffect(() => {
    if (!point && map && postsCoverImages?.length) {
      const bounds = new kakao.maps.LatLngBounds();
      postsCoverImages.forEach(({ post_lat, post_lng }) => bounds.extend(new kakao.maps.LatLng(post_lat, post_lng)));
      postsCoverImages[0].post_lat && postsCoverImages[0].post_lng && map.panTo(bounds);
    }
  }, [map, postsCoverImages]);

  // 게시물 상세 페이지에서 올 경우 해당 게시물 위치
  useEffect(() => {
    if (!!point && map) {
      moveToMarker({ ...point, setSpotInfo });
      map.setLevel(4, { animate: true });
    }
  }, [map]);

  if (isPending || mapLoading) return <Loading />;

  if (mapError) throw new Error('지도를 불러오지 못 했습니다.');

  if (isError) throw new Error(error.message);

  return (
    <>
      {isInputFocus && <div className='fixed inset-0 z-40 bg-black bg-opacity-40'></div>}
      <PlaceSearchForm
        desktop={desktop}
        searchLocation={searchLocation}
        setSearchResult={setSearchResult}
        setIsInputFocus={setIsInputFocus}
        hasSearchResult={!!searchResult.markers[0]}
      />
      <button
        className='fixed right-[16px] top-[136px] z-30 h-[44px] w-[44px] rounded-full bg-white pc:top-[72.5px]'
        onClick={() => {
          setIsPostsView((prev) => !prev);
          isPostsView && setPostsPreview([]);
          isPostsView ? getSpotInfo(setSpotInfo) : setSpotInfo(null);
        }}
        aria-label='맵핀, 게시물 전환'
      >
        {isPostsView ? <IconSwitchToMappin className='m-auto' /> : <IconSwitchToPostMarker className='m-auto' />}
      </button>
      {isPostsView || (
        <MapPin className='fixed left-1/2 top-1/2 z-30 h-[48px] w-[28px] -translate-x-1/2 -translate-y-[29%]' />
      )}
      <Map
        className='h-screen w-full'
        center={{ lat: 35.85, lng: 127.65 }}
        onCreate={setMap}
        level={13}
        isPanto={true}
        onDragEnd={() => isPostsView || getSpotInfo(setSpotInfo)}
      >
        {isPostsView && !!postsCoverImages.length ? (
          <MarkerClusterer
            averageCenter={true}
            minLevel={1} // 클러스터 할 최소 지도 레벨
            styles={clusterStyle}
            disableClickZoom={true}
            onClustered={(marker) => onClusteredEvent({ marker, clusterStyle, setClusterStyle })}
            calculator={() => clusterCalculator(clusterStyle) as any}
            onClusterclick={(marker, cluster) => {
              clusterClickEvent({ cluster, setPostsPreview });
              handleCustomOpen();
            }}
          >
            {postsCoverImages.map(({ post_id, post_image_url, post_lat, post_lng }) => {
              post_lat && post_lng && polyline.push({ lat: post_lat, lng: post_lng });
              return (
                <MapMarker
                  key={post_image_url}
                  position={{ lat: post_lat, lng: post_lng }}
                  onClick={() => {
                    moveToMarker({ lat: post_lat, lng: post_lng, setSpotInfo });
                    setPostsPreview([{ postId: post_id, postImageUrl: post_image_url }]);
                    handleCustomOpen();
                  }}
                  image={{
                    src: post_image_url,
                    size: {
                      width: 60,
                      height: 60,
                    },
                    options: { shape: 'circle', offset: { x: 30, y: 30 }, alt: post_id },
                  }}
                />
              );
            })}
          </MarkerClusterer>
        ) : (
          <>
            {searchResult.markers.map((marker) => (
              <CustomOverlayMap
                key={marker.id}
                position={{ lat: marker.lat, lng: marker.lng }}
              >
                <SearchResultMarker onClick={() => moveToMarker({ ...marker, setSpotInfo })} />
              </CustomOverlayMap>
            ))}
          </>
        )}
        <Polyline
          path={[polyline]}
          strokeWeight={6} // 선 두께
          strokeColor={'#FFABF1'} // 선 색깔
          strokeOpacity={1} // 선 불투명도 1에서 0 사이의 값 0에 가까울수록 투명
          strokeStyle={'solid'} // 선 스타일
        />

        {!!spotInfo && (
          <SearchResultLayout
            desktop={desktop}
            handleFindUserLocation={() => handleFindUserLocation({ isPostsView, setIsPostsView, setSpotInfo })}
          >
            <SearchResult
              spotInfo={spotInfo}
              searchResult={searchResult}
              searchLocation={searchLocation}
            />
          </SearchResultLayout>
        )}
        {(!spotInfo || desktop) && (
          //NOTE - 임시
          <button
            className='fixed bottom-[16px] left-[16px] z-30 h-[44px] w-[44px] rounded-full bg-white pc:left-auto pc:right-[16px] pc:top-[132px]'
            // className='fixed bottom-[100px] left-[16px] z-30 h-[44px] w-[44px] rounded-full bg-white pc:left-auto pc:right-[16px] pc:top-[132px]'
            onClick={() => handleFindUserLocation({ isPostsView, setIsPostsView, setSpotInfo })}
            aria-label='사용자 위치 찾기'
          >
            <IconGeolocation className='m-auto' />
          </button>
        )}
        {!!postsPreView.length ? (
          <PostsPreviewLayout
            desktop={desktop}
            postsPreView={postsPreView}
            setPostsPreview={setPostsPreview}
          >
            <PostsPreview
              groupId={groupId}
              desktop={desktop}
              postsPreView={postsPreView}
            />
          </PostsPreviewLayout>
        ) : (
          //NOTE - 임시
          spotInfo && (
            <div
              className={`shadow-[0px -4px 10px 0px rgba(0, 0, 0, 0.10)] fixed bottom-0 z-30 w-full ${!!spotInfo || 'bg-white'} px-[16px] pb-[16px] pt-[12px] pc:bottom-[28px] pc:left-1/2 pc:flex pc:w-[628px] pc:-translate-x-1/2 pc:items-center pc:rounded-[28px] pc:p-[40px]`}
            >
              <Button
                type='button'
                onClick={() => handleAddPostRoute({ groupId, isPostsView, spotInfo })}
                variant='primary'
                size={desktop ? 'large' : 'full'}
                className='bottom-[16px] z-30 h-[56px] px-[24px] pc:mx-auto pc:h-[56px] pc:w-[343px] pc:py-[16px]'
                disabled={!isPostsView && !spotInfo?.address}
              >
                <span className='flex gap-[8px]'>
                  <IconPostPlus />
                  <span className='text-title_lg'>게시물 추가하기</span>
                </span>
              </Button>
            </div>
          )
        )}
      </Map>
    </>
  );
};

export default GroupMap;
