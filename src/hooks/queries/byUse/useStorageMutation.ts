import { HOME, LOGIN_PAGE } from '@/constants/urls';
import { uploadProfileImage } from '@/services/client-action/storageAction';
import { signUp, login, getSession, updateUser } from '@/services/server-action/authActions';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';

/** 파일 업로드 */
export const useUploadImage = () => {
  return useMutation({
    mutationFn: uploadProfileImage,
    onSuccess: (data) => {},
    onError: (error) => {
      alert(error.message);
    },
  });
};
