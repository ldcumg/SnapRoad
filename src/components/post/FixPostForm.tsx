import { useForm } from './query/useFormMutations';
import { usePostForm } from './query/usePostForm';
import { Button } from '@/stories/Button';
import { FieldValues } from 'react-hook-form';

const FixPostForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = usePostForm();

  const { mutate: postForm } = useForm();

  const onSubmit = async (value: FieldValues) => {
    console.log('폼 데이터 제출', value);
  };

  return (
    <>
      <form
        className='flex flex-col'
        onSubmit={handleSubmit(onSubmit)}
      >
        <textarea
          {...register('text')}
          placeholder='내용 입력'
        />
        {errors.text && <span>{errors.text.message && String(errors.text.message)}</span>}

        <input
          {...register('hashtags')}
          placeholder='#해시태그'
        />
        {errors.hashtags && <span>{errors.hashtags.message && String(errors.hashtags.message)}</span>}

        <input
          type='date'
          {...register('date')}
        />
        {errors.date && <span>{errors.date.message && String(errors.date.message)}</span>}

        <input
          type='time'
          {...register('time')}
        />
        {errors.time && <span>{errors.time.message && String(errors.time.message)}</span>}

        <button type='submit'>업로드</button>
      </form>
    </>
  );
};
export default FixPostForm;
