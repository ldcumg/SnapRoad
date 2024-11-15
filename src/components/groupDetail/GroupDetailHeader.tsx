import URLS from '@/constants/urls';
import { IconLogo } from '@/lib/icon/Icon_ Logo';
import { Link } from 'lucide-react';

const GroupDetailHeader = ({
  groupTitle,
  handleChangeMode,
}: {
  groupTitle: string;
  handleChangeMode: () => JSX.Element;
}) => {
  return (
    <header className='z-50 flex h-[56px] items-center justify-between bg-white px-4 py-2'>
      <Link href={URLS.home}>
        <IconLogo />
      </Link>
      <h1 className='text-label_md'>{groupTitle}</h1>
      <div className='flex w-[63px] justify-end'>{handleChangeMode()}</div>
    </header>
  );
};

export default GroupDetailHeader;
