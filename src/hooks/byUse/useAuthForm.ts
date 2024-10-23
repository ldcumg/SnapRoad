import { loginSchema, signUpSchema } from '@/schemas/authSchemas';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

const useSignUpForm = () => {
  return useForm({
    mode: 'onChange',
    resolver: zodResolver(signUpSchema),
  });
};

const useLoginForm = () => {
  return useForm({
    mode: 'onChange',
    resolver: zodResolver(loginSchema),
  });
};

export { useSignUpForm, useLoginForm };
