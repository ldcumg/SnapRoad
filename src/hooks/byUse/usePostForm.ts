import { formSchema } from '../../schemas/formSchemas';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

// formSchema를 사용하여 타입을 지정합니다.
type PostFormData = z.infer<typeof formSchema>;

export const usePostForm = () => {
  return useForm<PostFormData>({
    mode: 'onChange',
    resolver: zodResolver(formSchema),
  });
};
