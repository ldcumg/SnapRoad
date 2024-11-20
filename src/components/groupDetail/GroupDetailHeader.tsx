'use client';

import URLS from '@/constants/urls';
import { IconLogo } from '@/lib/icon/Icon_ Logo';
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
          <button onClick={() => setMode(GroupDetailMode.album)}>
            <img src='/svgs/Swap_Btn_To_Album.svg' />
          </button>
        );
      case GroupDetailMode.album:
        return (
          <button onClick={() => setMode(GroupDetailMode.map)}>
            <img src='/svgs/Swap_Btn_To_Map.svg' />
          </button>
        );
      case GroupDetailMode.member:
        return (
          <button
            className='h-10 w-10'
            onClick={() => setMode(GroupDetailMode.album)}
          >
            <img
              className='mx-auto'
              src='/svgs/Close_Member_List.svg'
            />
          </button>
        );
      default:
        throw new Error('잘못된 요청입니다.');
    }
  };
  return (
    <header className='z-50 flex h-[56px] items-center justify-between bg-white px-[16px] py-[8px] pc:px-[24px] pc:py-[8px] pc:border-b'>
      <Link href={URLS.home}>
        <IconLogo />
      </Link>
      <h1 className='text-label_md pc:text-title_xl'>{groupTitle}</h1>
      <div className='flex w-[63px] justify-end'>{handleChangeMode()}</div>
    </header>
  );
};

export default GroupDetailHeader;
