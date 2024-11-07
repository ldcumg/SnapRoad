type Props = {
  imgPreview: string | null;
};

const ImagePreview = ({ imgPreview }: Props) => {
  return (
    <>
      {imgPreview ? (
        <div className='relative flex justify-center items-start w-[232px] h-[216px] rounded-xl'>
          <img
            src={imgPreview}
            alt='업로드 그룹 썸네일 이미지'
            className='flex justify-center items-center w-[200px] h-[200px] border border-gray-100 rounded-xl'
          />
          <div className='absolute bottom-0 right-0 w-[48px] h-[48px] flex justify-center items-center border border-solid border-black rounded-[24px] bg-white'>
            <img
              src='/svgs/cameraIcon.svg'
              alt=''
              className='w-6 h-6'
            />
          </div>
        </div>
      ) : (
        <div className='relative flex justify-center items-start rounded-xl w-[232px] h-[216px]'>
          <img
            className='w-[200px] h-[200px] rounded-xl'
            src='/images/group_default_thumbnail.png'
            alt=''
          />
          <div className='absolute bottom-0 right-0 w-[48px] h-[48px] flex justify-center items-center border border-solid border-gray-100 shadow-BG_S rounded-[24px] bg-white'>
            <img
              src='/svgs/cameraIcon.svg'
              alt=''
              className='w-6 h-6'
            />
          </div>
        </div>
      )}
    </>
  );
};

export default ImagePreview;
