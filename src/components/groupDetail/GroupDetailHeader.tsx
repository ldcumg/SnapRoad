'use client';

import URLS from '@/constants/urls';
import CloseLg from '@/lib/icon/Close_Lg';
import { IconLogo } from '@/lib/icon/Icon_ Logo';
import Icon_To_Album from '@/lib/icon/Icon_To_Album';
import Icon_To_Map from '@/lib/icon/Icon_To_Map';
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
            <Icon_To_Album />
          </button>
        );
      case GroupDetailMode.album:
        return (
          <button onClick={() => setMode(GroupDetailMode.map)}>
            <Icon_To_Map />
          </button>
        );
      case GroupDetailMode.member:
        return (
          <button
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
