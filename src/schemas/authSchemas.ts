import { z } from 'zod';

const signUpSchema = z.object({
  email: z
    .string()
    .min(1, {
      message: '이메일을 입력해주세요.',
    })
    .email({
      message: '이메일 형식으로 입력해주세요.',
    }),
  password: z.string().min(6, {
    message: '비밀번호는 6자 이상이어야 합니다.',
  }),
  nickname: z
    .string()
    .min(1, {
      message: '닉네임을 입력해주세요.',
    })
    .min(2, {
      message: '닉네임은 두 글자 이상 입력해주세요.',
    }),
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
