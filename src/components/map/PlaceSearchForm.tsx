'use client';

import { searchPlaceSchema } from '@/schemas/searchPlaceSchema';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'garlic-toast';
import { useForm, type FieldValues } from 'react-hook-form';

const SEARCH_INPUT = 'searchInput';

const PlaceSearchForm = ({ searchLocation }: { searchLocation: ({ searchInput }: FieldValues) => Promise<void> }) => {
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

  //TODO - 데스크탑에서만 동작하게
  // useEffect(() => {
  //   setFocus(SEARCH_INPUT);
  // }, []);

  if (searchTermInvalidate) toast.error(searchTermInvalidate.message as string);

  return (
    <form
      className='fixed left-1/2 top-[72px] z-50 w-full -translate-x-1/2 px-4'
      onSubmit={handleSubmit(searchLocation)}
    >
      <div className='relative w-full'>
        <input
          className='h-[48px] w-full rounded-3xl px-4 py-3 text-body_md shadow-BG_S placeholder:text-gray-400'
          placeholder='장소를 검색해보세요!'
          {...register(SEARCH_INPUT)}
        />
        {!!getValues(SEARCH_INPUT) && (
          <button
            className='absolute right-12 top-1/2 z-50 -translate-y-1/2'
            type='button'
            onClick={() => resetField(SEARCH_INPUT)}
          >
            <img src='/svgs/Reset_input.svg' />
          </button>
        )}
        <button
          className='absolute right-4 top-1/2 -translate-y-1/2'
          type='submit'
        >
          <img src='/svgs/Map_Search.svg' />
        </button>
      </div>
    </form>
  );
};

export default PlaceSearchForm;
