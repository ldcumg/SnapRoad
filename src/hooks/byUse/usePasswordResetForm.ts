import { resetPasswordSchema } from '@/schemas/passwordResetSchemas';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

const useResetPasswordForm = () => {
  return useForm({
    mode: 'onChange',
    resolver: zodResolver(resetPasswordSchema),
  });
};

export { useResetPasswordForm };
