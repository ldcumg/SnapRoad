import { profileSchema } from '@/schemas/profileSchemas';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

export const useProfileForm = () => {
  return useForm({
    mode: 'onChange',
    resolver: zodResolver(profileSchema),
  });
};
