import { z } from 'zod';

export const profileSchema = z.object({
  nickname: z.string().min(1, '닉네임을 입력해주세요!').max(10, '10글자 이하로 입력해주세요!'),
});
