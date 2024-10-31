import { imageUploadSchema } from '@/schemas/imageUploadSchema';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

type ImageUploadFormValues = z.infer<typeof imageUploadSchema>;

export const useImageUploadForm = () => {
  return useForm<ImageUploadFormValues>({
    mode: 'onChange',
    resolver: zodResolver(imageUploadSchema),
  });
};
