import { formSchema } from './formSchemas';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

export const usePostForm = () => {
  return useForm({
    mode: 'onChange',
    resolver: zodResolver(formSchema),
  });
};
