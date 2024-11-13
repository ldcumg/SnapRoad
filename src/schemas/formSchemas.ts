import { z } from 'zod';

export const formSchema = z.object({
  desc: z.string().min(1, '내용은 필수 항목입니다.'),
  // hashtags: z.string().optional(),
  // hashtags: z.string().min(1, '해시태그를 입력해 주세요.'),
  // hashtags: z.array(z.string()).optional(),
  hashtags: z.array(z.string()).min(1, '해시태그를 하나 이상 입력해 주세요.'),
  date: z.string().min(1, '날짜는 필수 항목입니다.'),
  time: z.string().min(1, '시간은 필수 항목입니다.'),
  // images: z.array(z.string()).optional(),
});

export type PostFormData = z.infer<typeof formSchema>;
