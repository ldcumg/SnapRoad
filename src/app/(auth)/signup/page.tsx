import SignUpForm from '@/components/auth/SignUpForm';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: '회원가입 페이지',
  description: '회원가입 페이지 입니다.',
};

const SignUpPage = () => {
  return (
    <div className='px-4 mb-32'>
      {/* TODO 분리하면 좋을듯 */}
      <div className='flex flex-col items-center gap-4 pt-10 pb-5'>
        <img
          src='/svgs/Logo.svg'
          alt='로고'
        />
        <span className='text-gray-900 text-title_xl'>회원가입</span>
      </div>
      <SignUpForm />
    </div>
  );
};

export default SignUpPage;
