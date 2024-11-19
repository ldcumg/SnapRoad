import { z } from 'zod';

export const formSchema = z.object({
  desc: z.string().min(1, '내용은 필수 항목입니다.'),
  hashtags: z.array(z.string()).optional(),
  date: z.string().min(1, '날짜는 필수 항목입니다.'),
  time: z.string().min(1, '시간은 필수 항목입니다.'),
});

export const editPostSchema = z.object({
  desc: z.string().optional(),
  hashtags: z.array(z.string()).optional(),
  date: z.string().optional(),
  time: z.string().optional(),
});

export type PostFormData = z.infer<typeof formSchema>;
export type EditPostFormData = z.infer<typeof editPostSchema>;
