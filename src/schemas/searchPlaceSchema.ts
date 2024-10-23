import { z } from 'zod';

export const searchPlaceSchema = z.object({
  searchTerm: z.string().trim().min(1, { message: '장소를 입력해주세요.' }),
});
