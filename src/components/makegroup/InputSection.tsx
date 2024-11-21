import ImagePreview from './ImagePreview';
import LengthInput from '@/stories/LengthInput';
import { FormState, UseFormRegister } from 'react-hook-form';

interface FormValues {
  groupTitle: string;
  groupDesc: string;
  groupImg: File[];
}

type Props = {
  register: UseFormRegister<FormValues>;
  formState: FormState<FormValues>;
  imgPreview: string | null;
  groupTitleLen: number;
  groupDescLen: number;
  clearInputValue: (e: React.MouseEvent<HTMLButtonElement>) => void;
  handleInputImageChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

const InputSection = ({
  register,
  formState,
  imgPreview,
  groupTitleLen,
  groupDescLen,
  clearInputValue,
  handleInputImageChange,
}: Props) => {
  return (
    <section className='flex w-full flex-col items-center justify-center gap-2'>
      <div>
        <label htmlFor='group_image'>
          <ImagePreview imgPreview={imgPreview} />
        </label>
        <input
          type='file'
          id='group_image'
          accept='image/*'
          className='hidden'
          onChange={handleInputImageChange}
        />
      </div>
      <div className='flex w-full flex-col justify-center gap-6'>
        <LengthInput
          register={register}
          name='groupTitle'
          placeholder='그룹 이름을 입력해주세요.'
          clearInputValue={clearInputValue}
          curLength={groupTitleLen}
          maxLength={8}
        />
        {/* <p className='text-red-600 min-h-[20px] text-[14px]'>
          {formState.errors.groupTitle && formState.errors.groupTitle.message}
        </p> */}
        <div className='relative flex w-full justify-center'>
          <textarea
            id='group_desc'
            className='text-body-md h-[140px] w-full resize-none rounded-xl border border-solid border-gray-100 bg-white p-3 text-gray-900 outline-none placeholder:text-gray-400'
            {...register('groupDesc')}
            placeholder='그룹에 대해서 설명해주세요.'
            maxLength={40}
          />
          <p className='absolute bottom-3 right-3 text-gray-300'>{groupDescLen}/40</p>
        </div>
        {/* <p className='text-red-600 min-h-[20px] text-[14px]'>
          {formState.errors.groupDesc && formState.errors.groupDesc.message}
        </p> */}
      </div>
    </section>
  );
};

export default InputSection;
