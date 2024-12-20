'use client';

import Icon_Close from '@/lib/icon/Icon_Close';
import IconMapSearch from '@/lib/icon/Icon_Map_Search';
import IconResetInput from '@/lib/icon/Icon_Reset_Input';
import { searchPlaceSchema } from '@/schemas/searchPlaceSchema';
import type { LocationInfo } from '@/types/mapTypes';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'garlic-toast';
import { useEffect } from 'react';
import { useForm, type FieldValues } from 'react-hook-form';

const SEARCH_INPUT = 'searchInput';

type Props = {
  desktop: boolean;
  hasSearchResult: boolean;
  searchLocation: ({ searchInput }: FieldValues) => Promise<void>;
  setIsInputFocus: React.Dispatch<React.SetStateAction<boolean>>;
  setSearchResult: React.Dispatch<
    React.SetStateAction<{
      markers: LocationInfo[];
      hasMore: boolean;
    }>
  >;
};

const PlaceSearchForm = ({ desktop, searchLocation, setSearchResult, setIsInputFocus, hasSearchResult }: Props) => {
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
    desktop && setFocus(SEARCH_INPUT);
  }, []);

  if (searchTermInvalidate) toast.error(searchTermInvalidate.message as string);

  return (
    <form
      className='fixed left-1/2 top-[72px] z-50 w-full -translate-x-1/2 px-[16px] py-[4px] pc:left-[15px] pc:w-[343px] pc:-translate-x-0'
      onSubmit={handleSubmit(searchLocation)}
    >
      <div className='relative w-full'>
        <input
          className='h-[48px] w-full rounded-3xl px-[16px] py-[12px] text-body_md shadow-BG_S placeholder:text-gray-400 focus:outline-none'
          placeholder='여행지를 검색해보세요!'
          onClick={() => setIsInputFocus(true)}
          {...register(SEARCH_INPUT, { onBlur: () => setIsInputFocus(false) })}
        />
        {!!getValues(SEARCH_INPUT) &&
          (hasSearchResult ? (
            <IconMapSearch className='pointer-events-none absolute right-[48px] top-1/2 z-50 -translate-y-1/2' />
          ) : (
            <button
              className='absolute right-[48px] top-1/2 z-50 -translate-y-1/2'
              type='button'
              onClick={() => {
                resetField(SEARCH_INPUT);
                setFocus(SEARCH_INPUT);
              }}
              aria-label='검색창 초기화'
            >
              <IconResetInput />
            </button>
          ))}
        {hasSearchResult ? (
          <button
            className='absolute right-[16px] top-1/2 -translate-y-1/2'
            type='button'
            onClick={() => {
              setSearchResult({ markers: [], hasMore: false });
              resetField(SEARCH_INPUT);
            }}
            aria-label='검색결과 지우기'
          >
            <Icon_Close />
          </button>
        ) : (
          <button
            className='absolute right-[16px] top-1/2 -translate-y-1/2'
            type='submit'
            aria-label='장소 검색'
          >
            <IconMapSearch />
          </button>
        )}
      </div>
    </form>
  );
};

export default PlaceSearchForm;
