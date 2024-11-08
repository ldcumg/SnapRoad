import { formSchema } from './query/formSchemas';
import { useForm } from './query/useFormMutations';
import { usePostForm } from './query/usePostForm';
import { Button } from '@/stories/Button';
import TextAreaWithCounter from '@/stories/TextAreas';
import { useMemo, useState } from 'react';
import { FieldValues } from 'react-hook-form';

const FixPostForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = usePostForm();

  const { mutate: postForm } = useForm();
  const [isChecked, setIsChecked] = useState(false);
  const [isCheckedInSheet, setIsCheckedInSheet] = useState(false);

  const handlePostForm = async (value: FieldValues) => {
    console.log('폼 데이터 제출', value);
    postForm(formSchema.parse(value));
  };

  // 필드 값 감시
  const text = watch('text');
  const hashtags = watch('hashtags');
  const date = watch('date');
  const time = watch('time');

  // 필드 빈값 확인
  const isFormValueFilled = useMemo(() => {
    return text && hashtags && date && time;
  }, [text, hashtags, date, time]);

  return (
    <>
      <form
        className='flex flex-col'
        onSubmit={handleSubmit(handlePostForm)}
      >
        <TextAreaWithCounter
          id='formValue'
          {...register('text')}
          placeholder='내용 입력항목입니다.'
          maxLength={1000}
          errorText={errors.text && String(errors.text.message)}
          variant='default'
        />

        {/* <textarea
          {...register('text')}
          maxLength={1000}
          placeholder='내용 입력'
        />
        {errors.text && <span>{errors.text.message && String(errors.text.message)}</span>} */}

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

        <Button
          type='submit'
          label='게시물 업로드'
          variant='primary'
          // disabled={!isFormValueFilled || Object.keys(errors).length > 0}
        />
      </form>
    </>
  );
};
export default FixPostForm;
