import { loginSchema, resetPasswordSchema, sendEmailSchema, signUpSchema } from '@/schemas/authSchemas';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

export const useSignUpForm = () => {
  return useForm({
    mode: 'onChange',
    resolver: zodResolver(signUpSchema),
  });
};

export const useLoginForm = () => {
  return useForm({
    mode: 'onChange',
    resolver: zodResolver(loginSchema),
  });
};

export const useSendEmailForm = () => {
  return useForm({
    mode: 'onChange',
    resolver: zodResolver(sendEmailSchema),
  });
};

export const useResetPasswordForm = () => {
  return useForm({
    mode: 'onChange',
    resolver: zodResolver(resetPasswordSchema),
  });
};
