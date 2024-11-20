'use client';

import IconReload from '@/lib/icon/Icon_Reload';
import type { LocationInfo } from '@/types/mapTypes';
import type { FieldValues } from 'react-hook-form';

type Props = {
  spotInfo: Omit<LocationInfo, 'id'>;
  searchResult: {
    markers: LocationInfo[];
    hasMore: boolean;
  };
  searchLocation: ({ searchInput }: FieldValues) => Promise<void>;
};

const SearchResult = ({ spotInfo, searchResult, searchLocation }: Props) => {
  return (
    <>
      {searchResult.hasMore && (
        <button
          className='absolute -top-[16px] left-1/2 flex h-[44px] -translate-x-1/2 -translate-y-full flex-row items-center gap-[12px] rounded-[22px] bg-white px-[24px] py-[8px] shadow-BG_S'
          type='button'
          onClick={searchLocation}
          aria-label='검색결과 더보기'
        >
          <span className='whitespace-nowrap text-body_md'>검색결과 더보기</span>
          <IconReload />
        </button>
      )}
      <div className={`flex flex-col ${!!spotInfo.placeName && 'gap-[4px]'} pc:mx-auto`}>
        <h5 className='text-label_md pc:mx-auto'>
          {(spotInfo.placeName || spotInfo.address) ?? '위치정보를 불러올 수 없습니다.'}
        </h5>
        {!!spotInfo.placeName && <span className='text-body_md pc:mx-auto'>{spotInfo.address}</span>}
      </div>
    </>
  );
};

export default SearchResult;
