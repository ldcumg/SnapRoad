import { postSchema } from '@/schemas/postSchema';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

export const usePostForm = () => {
  return useForm({
    mode: 'onChange',
    resolver: zodResolver(postSchema),
  });
};
