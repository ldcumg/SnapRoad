'use client';

import DateInputWithIcon from '../ui/DateInputWithIcon';
import HashtagInput from '../ui/HashtagInput';
import TimeInputWithIcon from '../ui/TimeInputWithIcon';
import { useEditForm } from '@/hooks/byUse/usePostForm';
import { useUpdateForm } from '@/hooks/queries/post/useFormMutations';
import { IconPluslg } from '@/lib/icon/Icon_Plus_lg';
import { formSchema } from '@/schemas/formSchemas';
import { saveTags, deleteTags, updateImagePostId } from '@/services/server-action/formActions';
import { useImageUploadStore } from '@/stores/post/useImageUploadStore';
import { usePostDataStore } from '@/stores/post/usePostDataStore';
import useBottomSheetStore from '@/stores/story/useBottomSheetStore';
import { Button } from '@/stories/Button';
import TextAreaWithCounter from '@/stories/TextAreas';
import { PostDetail as postDetailType } from '@/types/postDetailTypes';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { FieldValues, Controller } from 'react-hook-form';

export type PostAndProfileProps = {
  postDetail: postDetailType;
};

const EditForms = ({ postDetail }: PostAndProfileProps) => {
  const {
    handleSubmit,
    control,
    setValue,
    formState: { errors },
  } = useEditForm();

  const router = useRouter();
  const { userId = '', groupId = '', addressName, lat, lng } = usePostDataStore();
  const { handleFullOpen } = useBottomSheetStore();
  const { images: uploadedImages } = useImageUploadStore();
  const { mutateAsync: updateForm } = useUpdateForm(groupId);

  const [existingImages, setExistingImages] = useState(postDetail.images || []);
  const [hashtags, setHashtags] = useState<string[]>(postDetail.tags?.map((tag) => tag.tag_title) || []);

  useEffect(() => {
    if (postDetail) {
      setValue('desc', postDetail.post_desc || '');
      setValue('hashtags', hashtags);
      setValue('date', postDetail.post_date || '');
      setValue('time', postDetail.post_time || '');
      setExistingImages(postDetail.images || []);
    }
  }, [postDetail, setValue, hashtags]);

  const handlePostForm = async (value: FieldValues) => {
    if (!userId || !groupId || !postDetail.post_id) return;

    const finalImages = [...existingImages, ...uploadedImages];

    if (finalImages.length === 0) {
      alert('이미지가 없어 게시물을 수정할 수 없습니다.');
      return;
    }

    const parsedFormData = {
      ...formSchema.parse(value),
      postId: postDetail.post_id,
      userId,
      groupId,
      lat,
      lng,
      place: addressName || '',
      postThumbnailImage: finalImages.find((img) => img.is_cover)?.post_image_name || '',
      imageArray: finalImages.map((img) => img.post_image_name),
    };

    try {
      await updateForm(parsedFormData);

      if (uploadedImages.length > 0) {
        const uploadSessionId = uploadedImages[0]?.upload_session_id;
        await updateImagePostId(postDetail.post_id, uploadSessionId);
      }

      if (hashtags.length > 0) {
        await deleteTags(postDetail.post_id, groupId);
        await saveTags(hashtags, postDetail.post_id, groupId);
      }

      router.push(`/group/${groupId}/post/${postDetail.post_id}`);
    } catch (error) {
      console.error('폼 제출 에러:', error);
      alert('폼 제출에 실패했습니다. 다시 시도해 주세요.');
    }
  };

  return (
    <form
      className='flex flex-col space-y-4 px-4'
      onSubmit={handleSubmit(handlePostForm)}
    >
      <div className='mb-4 flex w-full content-center items-start gap-4 overflow-x-auto'>
        {(uploadedImages.length > 0 ? uploadedImages : existingImages).map((image, index) => (
          <div
            key={image.post_image_name || image.signed_image_url || index}
            className='relative h-[240px] min-w-[240px] max-w-[240px] flex-1 overflow-hidden border border-gray-200'
          >
            <img
              src={image.signed_image_url || image.post_image_url || '/path/to/placeholder.png'}
              alt={`이미지 ${index + 1}`}
              className='h-full w-full object-cover'
            />
          </div>
        ))}

        <button
          type='button'
          onClick={handleFullOpen}
          className='flex h-[240px] min-w-[240px] max-w-[240px] flex-shrink-0 cursor-pointer items-center justify-center border border-gray-100 bg-gray-50'
        >
          <div className='flex flex-col items-center'>
            <IconPluslg />
            <p className='text-md mt-2'>사진 선택</p>
          </div>
        </button>
      </div>

      <Controller
        name='desc'
        control={control}
        defaultValue={postDetail.post_desc || ''}
        render={({ field }) => (
          <TextAreaWithCounter
            id='formValue'
            variant='default'
            maxLength={1000}
            placeholder='추억을 기록할 수 있는 글을 남겨보세요.'
            errorText={errors.desc && String(errors.desc.message)}
            {...field}
          />
        )}
      />

      <Controller
        name='hashtags'
        control={control}
        defaultValue={hashtags}
        render={() => (
          <HashtagInput
            hashtags={hashtags}
            setHashtags={setHashtags}
          />
        )}
      />

      <Controller
        name='date'
        control={control}
        defaultValue={postDetail.post_date ? new Date(postDetail.post_date) : null}
        render={({ field }) => (
          <DateInputWithIcon
            value={field.value}
            onChange={(e) => field.onChange(e.target.value)}
            onBlur={field.onBlur}
            name={field.name}
          />
        )}
      />

      <Controller
        name='time'
        control={control}
        defaultValue={postDetail.post_time || ''}
        render={({ field }) => (
          <TimeInputWithIcon
            value={field.value}
            onChange={(e) => field.onChange(e.target.value)}
            onBlur={field.onBlur}
            name={field.name}
          />
        )}
      />

      <Button
        type='submit'
        label='게시물 수정'
        variant='primary'
        className='font-bold'
        size='large'
      />
    </form>
  );
};

export default EditForms;
