import { z } from 'zod';

export const searchPlaceSchema = z.object({
  searchInput: z.string().trim().min(1, { message: '장소를 입력해주세요.' }),
});
