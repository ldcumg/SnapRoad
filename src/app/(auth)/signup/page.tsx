import SignUpForm from '@/components/auth/SignUpForm';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: '회원가입 페이지',
  description: '회원가입 페이지',
};

const SignUpPage = () => {
  return <SignUpForm />;
};

export default SignUpPage;
