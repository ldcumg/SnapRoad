import { groupSchema } from '@/schemas/groupSchemas';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

const useMakeGroupForm = () => {
  return useForm({
    mode: 'onSubmit',
    defaultValues: {
      groupTitle: '',
      groupDesc: '',
    },
    resolver: zodResolver(groupSchema),
  });
};

export { useMakeGroupForm };
