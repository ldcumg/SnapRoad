import { z } from 'zod';

const groupSchema = z.object({
  groupTitle: z
    .string({ message: '그룹명을 입력해주세요!' })
    .min(1, { message: '그룹명은 1글자 이상 10글자 이하여야 합니다.' })
    .max(10, { message: '그룹명은 1글자 이상 10글자 이하여야 합니다.' }),
  groupDesc: z.string(),
});

export { groupSchema };
