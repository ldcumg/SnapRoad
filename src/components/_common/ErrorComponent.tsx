'use client';

import ErrorMarker from '@/lib/icon/Error_Marker';
import { Button } from '@/stories/Button';
import { LinkButton } from '@/stories/LinkButton';

type ErrorComponentProps = {
  reset: () => void;
};

const ErrorComponent = ({ reset }: ErrorComponentProps) => {
  return (
    <div className='flex h-screen w-full items-center justify-center'>
      <section className='flex flex-col items-center gap-10'>
        <div className='flex flex-col items-center gap-4 font-black text-gray-700'>
          <ErrorMarker />
          <p className='text-[40px]'>Error</p>
          <p className='flex flex-col items-center text-body_md'>
            <span>
              화면을 불러올 수 없어요.
              <br />
            </span>
            <span>잠시 후 다시 시도해 주세요!</span>
          </p>
        </div>
        <div className='flex w-screen flex-row gap-4 px-4 py-5'>
          <LinkButton
            href='/'
            label='홈으로'
            size='full'
            variant='outlineGray'
          />
          <Button
            onClick={() => reset()}
            label='다시 시도하기'
            size='full'
          />
        </div>
      </section>
    </div>
  );
};

export default ErrorComponent;
