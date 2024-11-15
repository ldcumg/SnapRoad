import { z } from 'zod';

const groupSchema = z.object({
  groupTitle: z
    .string({ message: '그룹명을 입력해주세요!' })
    .min(1, { message: '그룹명은 1글자 이상 8글자 이하여야 합니다.' })
    .max(8, { message: '그룹명은 1글자 이상 8글자 이하여야 합니다.' }),
  groupDesc: z.string().max(40, { message: '그룹 설명은 40글자 이하여야 합니다.' }),
  groupImg: z.union([z.array(z.instanceof(File)), z.null()]).optional(),
});

const inviteCodeRegex = new RegExp(/^[0-9A-Fa-f]{8}\-[0-9A-Fa-f]{4}\-[0-9A-Fa-f]{4}\-[0-9A-Fa-f]{4}\-[0-9A-Fa-f]{12}$/);
const inviteSchema = z.object({
  inviteCode: z.string().min(1, '초대코드를 입력해주세요.').regex(inviteCodeRegex, '초대코드가 올바르지 않습니다.'),
});

export { groupSchema, inviteSchema };
