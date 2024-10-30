import ImagePreview from './ImagePreview';
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
};

const InputSection = ({ register, formState, imgPreview, groupTitleLen, groupDescLen }: Props) => {
  return (
    <section className='flex flex-col justify-center items-center gap-[30px]'>
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
      <div className='p-[10px] flex flex-col justify-center gap-[3px]'>
        <div className='h-[44px] flex flex-row items-center px-[5px] border-b border-solid border-black'>
          <input
            id='group_title'
            className='w-[323px] text-[20px]'
            {...register('groupTitle')}
            type='text'
            placeholder='그룹 이름을 입력해주세요.'
            maxLength={8}
          />
          <p className='right-[6px] text-[#bdbdbd]'>{groupTitleLen}/8</p>
        </div>
        <p className='text-red-600 min-h-[20px] text-[14px]'>
          {formState.errors.groupTitle && formState.errors.groupTitle.message}
        </p>
        <div className='relative flex justify-center'>
          <textarea
            id='group_desc'
            className='w-[343px] h-[169px] bg-[#bdbdbd] text-black text-[14px] py-[16px] px-[20px] placeholder:text-white resize-none'
            {...register('groupDesc')}
            placeholder='이 그룹에 대해서 설명해주세요.'
            maxLength={40}
          />
          <p className='absolute bottom-[9px] right-[16px] text-white'>{groupDescLen}/40</p>
        </div>
        <p className='text-red-600 min-h-[20px] text-[14px]'>
          {formState.errors.groupDesc && formState.errors.groupDesc.message}
        </p>
      </div>
    </section>
  );
};

export default InputSection;
