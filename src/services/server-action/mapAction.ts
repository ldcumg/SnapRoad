'use server';

import type { LocationInfo, Location, Meta, Address } from '@/types/placesTypes';

const MAP_BASE_URL = 'https://dapi.kakao.com/v2/local';
const headers = {
  'Content-Type': 'application/json',
  Authorization: 'KakaoAK ' + process.env.NEXT_PUBLIC_KAKAO_REST_KEY!,
};

/** 키워드로 위도, 경도를 요청하는 함수 */
export const keywordSearch = async ({
  keyword,
  page = 1,
}: {
  keyword: string;
  page?: number;
}): Promise<{ results: LocationInfo[]; meta: Meta }> => {
  const res = await fetch(`${MAP_BASE_URL}/search/keyword?query=${keyword}&page=${page}`, {
    method: 'GET',
    cache: 'no-store',
    headers,
  });

  if (!res.ok) throw new Error('키워드 검색에 실패했습니다.');

  const { documents, meta } = await res.json();
  const results = documents.map((space: Location & { y: string; x: string }) => {
    return { ...space, lat: Number(space.y), lng: Number(space.x) };
  });

  return { results, meta };
};

/** 위도, 경도로 주소를 요청하는 함수 */
export const getAddress = async ({ lat, lng }: { lat: number; lng: number }): Promise<Address> => {
  const res = await fetch(`${MAP_BASE_URL}/geo/coord2address?y=${lat}&x=${lng}`, {
    method: 'GET',
    cache: 'no-store',
    headers,
  });

  if (!res.ok) throw new Error('주소를 불러오지 못 했습니다.');

  const {
    documents: [{ address }],
  } = await res.json();

  return address;
};
