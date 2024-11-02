'use server';

import type { LocationInfo, Location, Meta, Address, Latlng } from '@/types/placeTypes';
import type { FieldValues } from 'react-hook-form';

const MAP_BASE_URL = 'https://dapi.kakao.com/v2/local';
const headers = {
  'Content-Type': 'application/json',
  Authorization: 'KakaoAK ' + process.env.NEXT_PUBLIC_KAKAO_REST_KEY!,
};

/** 키워드로 장소 검색 */
export const keywordSearch = async ({
  keyword,
  page,
}: {
  keyword: FieldValues;
  page: number;
}): Promise<{ results: LocationInfo[]; meta: Meta }> => {
  const res = await fetch(`${MAP_BASE_URL}/search/keyword?query=${keyword}&page=${page}`, {
    method: 'GET',
    cache: 'no-store',
    headers,
  });

  if (!res.ok) throw new Error('키워드 검색에 실패했습니다.');

  const { documents, meta } = await res.json();
  const results = documents.map((location: Location & { y: string; x: string }) => {
    return { ...location, lat: Number(location.y), lng: Number(location.x) };
  });

  return { results, meta };
};

/** 위도, 경도로 주소 요청 */
export const getAddress = async ({ lat, lng }: Latlng): Promise<string> => {
  const res = await fetch(`${MAP_BASE_URL}/geo/coord2address?y=${lat}&x=${lng}`, {
    method: 'GET',
    cache: 'no-store',
    headers,
  });

  if (!res.ok) throw new Error('주소를 불러오지 못 했습니다.');

  const {
    documents: [
      {
        road_address,
        address: { address_name: address },
      },
    ],
  } = await res.json();

  return road_address?.address_name ?? address;
};
