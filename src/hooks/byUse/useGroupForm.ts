import { groupSchema, inviteSchema } from '@/schemas/groupSchemas';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

const useMakeGroupForm = () => {
  return useForm({
    mode: 'onChange',
    defaultValues: {
      groupTitle: '',
      groupDesc: '',
      groupImg: null,
    },
    resolver: zodResolver(groupSchema),
  });
};

const useInviteGroupForm = () => {
  return useForm({
    mode: 'onSubmit',
    defaultValues: {
      inviteCode: '',
    },
    resolver: zodResolver(inviteSchema),
  });
};
export { useMakeGroupForm, useInviteGroupForm };
