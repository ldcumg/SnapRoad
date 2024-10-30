import { z } from 'zod';

export const imageUploadSchema = z.object({
  files: z
    .array(z.instanceof(File))
    .max(10, '최대 10장의 이미지만 업로드할 수 있습니다.')
    .nonempty('최소 1장의 이미지를 업로드해야 합니다.'),
});
