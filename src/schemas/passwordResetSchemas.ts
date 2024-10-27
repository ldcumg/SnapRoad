import { z } from 'zod';

const resetPasswordSchema = z
  .object({
    password: z.string().min(6, {
      message: '비밀번호는 6자 이상이어야 합니다.',
    }),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: '비밀번호가 일치하지 않습니다.',
    path: ['confirmPassword'],
  });

export { resetPasswordSchema };
