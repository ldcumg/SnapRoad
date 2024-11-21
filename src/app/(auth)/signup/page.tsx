import SignUpForm from '@/components/auth/SignUpForm';
import SignUpHeader from '@/components/auth/SignUpHeader';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: '회원가입 페이지',
  description: '회원가입 페이지 입니다.',
};

const SignUpPage = () => {
  return (
    <div className='mb-32 px-4 py-2'>
      <SignUpHeader />
      <SignUpForm />
    </div>
  );
};

export default SignUpPage;
