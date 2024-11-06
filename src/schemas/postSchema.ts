import { z } from 'zod';

export const postSchema = z.object({
  description: z.string().min(1, '포스트 내용을 입력해주세요').max(1000, '최대 1000자까지 입력 가능합니다.'),
  hashtag: z
    .string()
    .transform((value) =>
      value
        .split(/[#\s]+/)
        .map((tag) => tag.trim())
        .filter((tag) => tag),
    )
    .refine((tags) => tags.length > 0, { message: '최소 하나의 해시태그를 입력해주세요.' })
    .refine((tags) => tags.length <= 5, { message: '최대 5개의 해시태그만 입력 가능합니다.' }),
  date: z.string().min(1, '날짜를 입력해주세요'),
  time: z.string().min(1, '시간을 입력해주세요'),
});

export type PostFormData = z.infer<typeof postSchema>;