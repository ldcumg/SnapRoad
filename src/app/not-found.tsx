'use client';

import { IconNotFoundMarker } from '@/lib/icon/Icon_Not_Found_Marker';
import { Button } from '@/stories/Button';
import { useRouter } from 'next/navigation';

const NotFound = () => {
  const router = useRouter();
  return (
    <div className='flex h-screen w-full items-center justify-center'>
      <section className='flex flex-col items-center gap-10'>
        <IconNotFoundMarker />
        <div className='flex flex-col items-center gap-4 font-black text-gray-700'>
          <p className='text-[40px]'>Page Not Found</p>
          <p className='flex flex-col items-center text-body_md'>
            <span>
              존재하지 않는 주소를 입력하셨거나
              <br />
            </span>
            <span>
              요청하신 페이지의 주소가 변경
              <br />
            </span>
            <span>또는 삭제되어 찾을 수 없어요.</span>
          </p>
        </div>
        <div className='flex w-screen flex-row gap-4 px-4 py-5'>
          <Button
            label='이전으로'
            size='full'
            variant='outlineGray'
            onClick={() => router.back()}
          />
          <Button
            label='홈으로'
            size='full'
            onClick={() => router.push('/')}
          />
        </div>
      </section>
    </div>
  );
};

export default NotFound;
