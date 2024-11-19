import { commentSchema } from '@/schemas/commentSchemas';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

export const useCommentForm = () => {
  return useForm({
    resolver: zodResolver(commentSchema),
  });
};
