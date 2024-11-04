import ImagePreview from './ImagePreview';
import LengthInput from '@/stories/LengthInput';
import { FormState, UseFormRegister } from 'react-hook-form';

type Props = {
  register: UseFormRegister<{
    groupTitle: string;
    groupDesc: string;
    groupImg: null;
  }>;
  formState: FormState<{
    groupTitle: string;
    groupDesc: string;
    groupImg: null;
  }>;
  imgPreview: string | null;
  groupTitleLen: number;
  groupDescLen: number;
  clearInputValue: (e: React.MouseEvent<HTMLButtonElement>) => void;
};

const InputSection = ({ register, formState, imgPreview, groupTitleLen, groupDescLen, clearInputValue }: Props) => {
  return (
    <section className='flex flex-col justify-center items-center gap-2 w-full'>
      <div>
        <label htmlFor='group_image'>
          <ImagePreview imgPreview={imgPreview} />
        </label>
        <input
          type='file'
          id='group_image'
          accept='image/*'
          className='hidden'
          {...register('groupImg')}
        />
      </div>
      <div className='flex flex-col justify-center gap-6 w-full'>
        <LengthInput
          register={register}
          name='groupTitle'
          clearInputValue={clearInputValue}
          placeholder='그룹 이름을 입력해주세요.'
          curLength={groupTitleLen}
          maxLength={8}
        />
        {/* <p className='text-red-600 min-h-[20px] text-[14px]'>
          {formState.errors.groupTitle && formState.errors.groupTitle.message}
        </p> */}
        <div className='relative flex justify-center w-full'>
          <textarea
            id='group_desc'
            className='w-full h-[140px] bg-white text-gray-900 text-body-md p-3 placeholder:text-gray-400 resize-none outline-none border border-solid border-gray-100 rounded-xl '
            {...register('groupDesc')}
            placeholder='이 그룹에 대해서 설명해주세요.'
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
