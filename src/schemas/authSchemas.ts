import { z } from 'zod';

const passwordRegex = new RegExp(/^(?=.*?[A-Za-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{6,}$/);

const signUpSchema = z
  .object({
    email: z.string().email({
      message: '유효하지 않은 이메일 형식이에요!',
    }),
    password: z.string().regex(passwordRegex, '문자,숫자,특수문자 포함 6자리 이상을 입력해주세요!'),
    confirmPassword: z.string(),
    nickname: z.string().max(10, '10글자 이하로 입력해주세요!'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: '비밀번호가 일치하지 않아요!',
    path: ['confirmPassword'],
  });

const loginSchema = z.object({
  email: z.string().min(1, {
    message: '이메일을 입력해주세요.',
  }),
  password: z.string().min(1, {
    message: '비밀번호를 입력해주세요.',
  }),
});

export { signUpSchema, loginSchema };
