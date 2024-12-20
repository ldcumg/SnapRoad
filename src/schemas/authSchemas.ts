import { z } from 'zod';

const passwordRegex = new RegExp(/^(?=.*?[A-Za-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/);

const emailSchema = z.string().email({
  message: '유효하지 않은 이메일 형식이에요!',
});

const passwordSchema = z.string().regex(passwordRegex, '문자,숫자,특수문자 포함 8자리 이상을 입력해주세요!');

export const signUpSchema = z
  .object({
    email: emailSchema,
    password: passwordSchema,
    confirmPassword: z.string(),
    nickname: z.string().max(10, '10글자 이하로 입력해주세요!'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: '비밀번호가 일치하지 않아요!',
    path: ['confirmPassword'],
  });

export const loginSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
});

/** 비밀번호 변경 관련 */
export const sendEmailSchema = z.object({
  email: emailSchema,
});

export const resetPasswordSchema = z
  .object({
    password: passwordSchema,
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: '비밀번호가 일치하지 않아요!',
    path: ['confirmPassword'],
  });
