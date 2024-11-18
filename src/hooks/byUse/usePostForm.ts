import { formSchema, editPostSchema } from '../../schemas/formSchemas';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

export const usePostForm = () => {
  return useForm({
    mode: 'onChange',
    resolver: zodResolver(formSchema),
  });
};

export const useEditForm = () => {
  return useForm({
    mode: 'onChange',
    resolver: zodResolver(editPostSchema),
  });
};
