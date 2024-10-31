'use client';

import { searchPlaceSchema } from '@/schemas/searchPlaceSchema';
import type { LocationInfo } from '@/types/placesTypes';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'garlic-toast';
import Link from 'next/link';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import ReactDOM from 'react-dom';
import { useForm, type FieldValues } from 'react-hook-form';
import { AbstractOverlay, Map, MapMarker, MarkerClusterer } from 'react-kakao-maps-sdk';

type GroupMapProps = {
  groupId: string;
};

type Markers = {
  searchResultMarkers: LocationInfo[];
  pointMarker: LocationInfo | null;
  postMarkers: null;
};

const searchInput = 'searchInput';

const GroupMap = ({ groupId }: GroupMapProps) => {
  const map = useRef<kakao.maps.Map>();
  const [postMarkers, setPostMarkers] = useState();
  const [searchResultMarkers, setSearchResultMarkers] = useState<LocationInfo[]>([]);
  const [selectMarker, setSelectMarker] = useState<LocationInfo | null>(null);

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

  const [tackerVisible, setTrackerVisible] = useState(false);

  const TooltipMarker = ({ position, tooltipText }) => {
    // Marker로 올려질 node 객체를 생성 합니다.
    const node = useRef(document.createElement('div'));
    const [visible, setVisible] = useState(false);
    const [tracerPosition, setTracerPosition] = useState({
      x: 0,
      y: 0,
    });
    const [tracerAngle, setTracerAngle] = useState(0);

    const positionLatlng = useMemo(() => {
      return new kakao.maps.LatLng(position.lat, position.lng);
    }, [position.lat, position.lng]);

    function onAdd() {
      const panel = this.getPanels().overlayLayer;
      panel.appendChild(node.current);
    }

    function onRemove() {
      node.current.parentNode.removeChild(node.current);
    }

    function draw() {
      const projection = this.getProjection();
      const point = projection.pointFromCoords(positionLatlng);

      const width = node.current.offsetWidth;
      const height = node.current.offsetHeight;

      node.current.style.left = point.x - width / 2 + 'px';
      node.current.style.top = point.y - height / 2 + 'px';
    }

    const OUTCODE = {
      INSIDE: 0, // 0b0000
      TOP: 8, //0b1000
      RIGHT: 2, // 0b0010
      BOTTOM: 4, // 0b0100
      LEFT: 1, // 0b0001
    };

    const BOUNDS_BUFFER = 30;

    const CLIP_BUFFER = 40;

    const Marker = ({ tooltipText }) => {
      const [isOver, setIsOver] = useState(false);
      return (
        <div
          className={`node`}
          onMouseOver={() => {
            setIsOver(true);
          }}
          onMouseOut={() => {
            setIsOver(false);
          }}
        >
          {isOver && <div className={`tooltip`}>{tooltipText}</div>}
        </div>
      );
    };

    const Tracker = ({ position, angle }) => {
      return (
        <div
          className={'tracker h-full w-full'}
          style={{
            left: `${position.x}px`,
            top: `${position.y}px`,
          }}
          onClick={() => {
            map.current.setCenter(positionLatlng);
            setVisible(false);
          }}
        >
          <div
            className={'balloon w-full h-full'}
            style={{
              transform: `rotate(${angle}deg)`,
            }}
          >
            테스트
          </div>
          <div className={'icon h-full w-full'}>테스트2</div>
        </div>
      );
    };

    const getClipPosition = useCallback(
      (top, right, bottom, left, inner, outer) => {
        const calcOutcode = (x, y) => {
          let outcode = OUTCODE.INSIDE;

          if (x < left) {
            outcode |= OUTCODE.LEFT;
          } else if (x > right) {
            outcode |= OUTCODE.RIGHT;
          }

          if (y < top) {
            outcode |= OUTCODE.TOP;
          } else if (y > bottom) {
            outcode |= OUTCODE.BOTTOM;
          }

          return outcode;
        };

        let ix = inner.x;
        let iy = inner.y;
        let ox = outer.x;
        let oy = outer.y;

        let code = calcOutcode(ox, oy);

        while (true) {
          if (!code) {
            break;
          }

          if (code & OUTCODE.TOP) {
            ox = ox + ((ix - ox) / (iy - oy)) * (top - oy);
            oy = top;
          } else if (code & OUTCODE.RIGHT) {
            oy = oy + ((iy - oy) / (ix - ox)) * (right - ox);
            ox = right;
          } else if (code & OUTCODE.BOTTOM) {
            ox = ox + ((ix - ox) / (iy - oy)) * (bottom - oy);
            oy = bottom;
          } else if (code & OUTCODE.LEFT) {
            oy = oy + ((iy - oy) / (ix - ox)) * (left - ox);
            ox = left;
          }

          code = calcOutcode(ox, oy);
        }

        return { x: ox, y: oy };
      },
      [OUTCODE.BOTTOM, OUTCODE.INSIDE, OUTCODE.LEFT, OUTCODE.RIGHT, OUTCODE.TOP],
    );

    const getAngle = (center, target) => {
      const dx = target.x - center.x;
      const dy = center.y - target.y;
      const deg = (Math.atan2(dy, dx) * 180) / Math.PI;

      return ((-deg + 360) % 360 | 0) + 90;
    };

    // target의 위치를 추적하는 함수
    const tracking = useCallback(() => {
      const proj = map.current.getProjection();

      // 지도의 영역을 구합니다.
      const bounds = map.current.getBounds();

      // 지도의 영역을 기준으로 확장된 영역을 구합니다.
      const extBounds = extendBounds(bounds, proj);

      // target이 확장된 영역에 속하는지 판단하고
      if (extBounds.contain(positionLatlng)) {
        // 속하면 tracker를 숨깁니다.
        setVisible(false);
      } else {
        const pos = proj.containerPointFromCoords(positionLatlng);

        const center = proj.containerPointFromCoords(map.current.getCenter());

        const sw = proj.containerPointFromCoords(bounds.getSouthWest());

        const ne = proj.containerPointFromCoords(bounds.getNorthEast());

        const top = ne.y + CLIP_BUFFER;
        const right = ne.x - CLIP_BUFFER;
        const bottom = sw.y - CLIP_BUFFER;
        const left = sw.x + CLIP_BUFFER;

        const clipPosition = getClipPosition(top, right, bottom, left, center, pos);

        setTracerPosition(clipPosition);

        const angle = getAngle(center, pos);

        setTracerAngle(angle);

        setVisible(true);
      }
    }, [getClipPosition, map.current, positionLatlng]);

    const hideTracker = useCallback(() => {
      setVisible(false);
    }, []);

    useEffect(() => {
      node.current.style.position = 'absolute';
      node.current.style.whiteSpace = 'nowrap';
    }, []);

    const extendBounds = (bounds, proj) => {
      const sw = proj.pointFromCoords(bounds.getSouthWest());
      const ne = proj.pointFromCoords(bounds.getNorthEast());

      // 확장을 위해 각 좌표에 BOUNDS_BUFFER가 가진 수치만큼 더하거나 빼줍니다.
      sw.x -= BOUNDS_BUFFER;
      sw.y += BOUNDS_BUFFER;

      ne.x += BOUNDS_BUFFER;
      ne.y -= BOUNDS_BUFFER;

      return new kakao.maps.LatLngBounds(proj.coordsFromPoint(sw), proj.coordsFromPoint(ne));
    };

    useEffect(() => {
      setFocus(searchInput);
      kakao.maps.event.addListener(map.current, 'zoom_start', hideTracker);
      kakao.maps.event.addListener(map.current, 'zoom_changed', tracking);
      kakao.maps.event.addListener(map.current, 'center_changed', tracking);
      tracking();

      return () => {
        kakao.maps.event.removeListener(map.current, 'zoom_start', hideTracker);
        kakao.maps.event.removeListener(map.current, 'zoom_changed', tracking);
        kakao.maps.event.removeListener(map.current, 'center_changed', tracking);
        setVisible(false);
      };
    }, [map.current, hideTracker, tracking]);

    const handleMarkerClick = (lat: number, lng: number) => {
      setSelectMarker({ lat, lng });
    };

    return (
      <>
        <AbstractOverlay
          onAdd={onAdd}
          onRemove={onRemove}
          draw={draw}
        />
        {visible ? (
          ReactDOM.createPortal(
            <Tracker
              position={tracerPosition}
              angle={tracerAngle}
            />,
            map.current.getNode(),
          )
        ) : (
          // ReactDOM.createPortal(
          //     <Marker tooltipText={tooltipText} />,
          //     node.current,
          //   )
          <MapMarker
            position={position}
            onClick={() => {
              if (!map.current) return;
              map.current.setLevel(5, { animate: true });
              map.current.panTo(new kakao.maps.LatLng(position.lat, position.lng));
            }}
            draggable={true}
            onDragEnd={(map) => console.log(map.getPosition())}
          />
        )}
      </>
    );
  };

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
        className='w-full h-[50vh]'
        // NOTE 불러온 데이터들의 중심좌표로 초기 좌표 변경 getCenter()
        center={{ lat: 35.5, lng: 127.5 }}
        onCreate={(kakaoMap) => (map.current = kakaoMap)}
        onClick={(_, mouseEvent) => {
          if (isPostsView) return;
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
              <>
                <TooltipMarker
                  position={selectMarker}
                  tooltipText={'테스트'}
                />
                {/* <MapMarker
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
                </MapMarker> */}
              </>
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
      {
        selectMarker &&
          (isPostsView || (
            <Link href={`/group/${groupId}/post?lat=${selectMarker.lat}&lng=${selectMarker.lng}`}>추가하기</Link>
          ))
        // <Link href={`/post?lat=${selectMarker.lat}&lng=${selectMarker.lng}`}>추가하기</Link>
      }
    </>
  );
};

export default GroupMap;
