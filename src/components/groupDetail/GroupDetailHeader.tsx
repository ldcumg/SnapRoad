'use client';

import URLS from '@/constants/urls';
import CloseLg from '@/lib/icon/Close_Lg';
import { IconLogo } from '@/lib/icon/Icon_ Logo';
import IconToAlbum from '@/lib/icon/Icon_To_Album';
import IconToMap from '@/lib/icon/Icon_To_Map';
import { GroupDetailMode } from '@/types/groupTypes';
import Link from 'next/link';

type Props = {
  groupTitle: string;
  mode: GroupDetailMode;
  setMode: React.Dispatch<React.SetStateAction<GroupDetailMode>>;
};

const GroupDetailHeader = ({ groupTitle, mode, setMode }: Props) => {
  /** 조건부 렌더링 버튼 */
  const handleChangeMode = () => {
    switch (mode) {
      case GroupDetailMode.map:
        return (
          <button
            aria-label='앨범 버튼'
            onClick={() => setMode(GroupDetailMode.album)}
          >
            <IconToAlbum />
          </button>
        );
      case GroupDetailMode.album:
        return (
          <button
            aria-label='지도로 가기'
            onClick={() => setMode(GroupDetailMode.map)}
          >
            <IconToMap />
          </button>
        );
      case GroupDetailMode.member:
        return (
          <button
            aria-label='앨범으로 가기'
            className='h-10 w-10'
            onClick={() => setMode(GroupDetailMode.album)}
          >
            <CloseLg className='mx-auto' />
          </button>
        );
      default:
        throw new Error('잘못된 요청입니다.');
    }
  };

  return (
    <header className='z-50 flex h-[56px] items-center justify-between bg-white px-[16px] py-[8px] pc:border-b pc:px-[24px] pc:py-[8px]'>
      <Link href={URLS.home}>
        <IconLogo />
      </Link>
      <h1 className='text-label_md pc:text-title_xl'>{groupTitle}</h1>
      <div className='flex w-[63px] justify-end'>{handleChangeMode()}</div>
    </header>
  );
};

export default GroupDetailHeader;
