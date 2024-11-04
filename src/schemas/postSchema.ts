import { z } from 'zod';

export const postSchema = z.object({
  description: z.string().min(1, '포스트 내용을 입력해주세요').max(1000, '최대 1000자까지 입력 가능합니다.'),
  hashtag: z
    .string()
    .transform((value) =>
      value
        .split('#')
        .map((tag) => tag.trim())
        .filter((tag) => tag),
    ) // 해시태그 분리 및 공백 제거
    .refine((tags) => tags.length <= 5, { message: '최대 5개의 해시태그만 입력 가능합니다.' }), // 최대 5개의 태그만 허용
  date: z.string().optional(),
  time: z.string().optional(),
});

export type PostFormData = z.infer<typeof postSchema>;
