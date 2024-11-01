import { getSession, getUserData } from '@/services/server-action/authActions';
import { UserData, UserDataType } from '@/types/userTypes';
import Link from 'next/link';

const GroupListHeader = async () => {
  const user = await getSession();
  let userData: UserData = { user_nickname: null, user_image_url: null };
  if (user?.id) {
    userData = await getUserData(user?.id);
    console.log('userData :>> ', userData);
  }
  return (
    <div className='py-2 px-4 flex flex-row justify-between'>
      <Link href={'/grouplist'}>
        <img
          src='/svgs/Logo.svg'
          alt='유저이미지'
          className='rounded-[]'
        />
      </Link>
      <Link href={'/mypage'}>
        <img
          src={`${userData?.user_image_url ? userData.user_image_url : '/svgs/User.svg'}`}
          alt='유저이미지'
          className='rounded-[20px] w-10 h-10'
        />
      </Link>
    </div>
  );
};

export default GroupListHeader;
