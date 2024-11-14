import SignUpForm from '@/components/auth/SignUpForm';
import { IconLogo } from '@/lib/icon/Icon_ Logo';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: '회원가입 페이지',
  description: '회원가입 페이지 입니다.',
};

const SignUpPage = () => {
  return (
    <div className='mb-32 px-4'>
      {/* TODO 분리하면 좋을듯 */}
      <div className='flex flex-col items-center gap-4 pb-5 pt-10'>
        <IconLogo />
        <span className='text-title_xl text-gray-900'>회원가입</span>
      </div>
      <SignUpForm />
    </div>
  );
};

export default SignUpPage;
