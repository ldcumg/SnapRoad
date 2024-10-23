import { groupSchema } from '@/schemas/groupSchemas';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

const useMakeGroupForm = () => {
  return useForm({
    mode: 'onSubmit',
    defaultValues: {
      groupTitle: '',
      groupDesc: '',
      groupImg: null,
    },
    resolver: zodResolver(groupSchema),
  });
};

export { useMakeGroupForm };
