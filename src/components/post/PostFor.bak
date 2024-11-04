import { postSchema, PostFormData } from '@/schemas/postSchema';
import { fetchSignedUrl } from '@/services/client-action/postImageActions';
import { useImageUploadStore } from '@/stores/useImageUploadStore';
import { usePostDataStore } from '@/stores/usePostDataStore';
import { Button } from '@/stories/Button';
import { Input } from '@/stories/Input';
import browserClient from '@/utils/supabase/client';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { FieldValues } from 'react-hook-form';

const PostForm = () => {
  const { userId, groupId, lat, lng, addressName } = usePostDataStore();
  const { images: imagesData } = useImageUploadStore();
  if (!groupId || !userId) return <div>로딩 중...</div>;

  const router = useRouter();
  const decodedAddressName = addressName ? decodeURIComponent(addressName) : undefined;

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<PostFormData>({
    resolver: zodResolver(postSchema),
  });

  const [imageUrls, setImageUrls] = useState<string[]>([]);

  // 이미지 URL 생성
  useEffect(() => {
    const fetchImageUrls = async () => {
      const urls = await Promise.all(
        imagesData.map(async (image) => {
          const url = await fetchSignedUrl('tour_images', groupId, image.post_image_name || '');
          return url;
        }),
      );
      setImageUrls(urls);
    };

    fetchImageUrls();
  }, [imagesData, groupId]);

  const onSubmit = async (data: PostFormData) => {
    const coverImage = imagesData.find((image) => image.is_cover);
    const postLat = lat || null;
    const postLng = lng || null;
    const imageArray = imagesData.map((image) => image.post_image_name || '');

    const postData = {
      user_id: userId,
      group_id: groupId,
      post_desc: data.description,
      post_date: data.date,
      post_time: data.time,
      post_lat: postLat,
      post_lng: postLng,
      post_thumbnail_image: coverImage?.post_image_name!,
      image_array: imageArray,
      post_address: decodedAddressName!,
    };

    try {
      const { data: post, error: postError } = await browserClient
        .from('posts')
        .insert(postData)
        .select('post_id')
        .single();

      if (postError || !post) {
        console.error('포스트 제출에 실패했습니다:', postError?.message);
        return;
      }

      console.log('포스트가 성공적으로 제출되었습니다. post_id:', post);

      const postId = post.post_id;
      const { error: imageError } = await browserClient
        .from('images')
        .update({ post_id: postId })
        .eq('upload_session_id', imagesData[0].upload_session_id!);

      if (imageError) {
        console.error('이미지에 post_id 업데이트에 실패했습니다:', imageError.message);
      }

      const tagData = data.hashtag.map((tag) => ({
        tag_title: tag,
        post_id: postId,
        group_id: groupId,
      }));

      if (tagData.length > 0) {
        const { error: tagError } = await browserClient.from('tags').insert(tagData);
        if (tagError) {
          console.error('태그 저장에 실패했습니다:', tagError.message);
        }
      }

      router.push(`/group/${groupId}`);
    } catch (error) {
      console.error('포스트 제출 중 오류 발생:', error);
    }
  };

  return (
    <div className='PostForm'>
      <form
        className='w-full border border-black flex flex-col'
        onSubmit={handleSubmit(onSubmit)}
      >
        <label htmlFor='description'>대표</label>
        <textarea
          id='description'
          {...register('description')}
          maxLength={1000}
          placeholder='여행을 떠나고 싶은 마음으로.'
          className='description-textarea'
        />
        {errors.description && <p className='text-danger text-sm'>{errors.description.message}</p>}

        <Input
          type='text'
          label={'해시태그'}
          {...register('hashtag')}
          placeholder='예: 여행 친구랑'
        />
        {errors.hashtag && <p className='text-danger text-sm'>{errors.hashtag.message}</p>}

        <Input
          type='date'
          label={'날짜'}
          {...register('date')}
        />
        {errors.date && <p className='text-danger text-sm'>{errors.date.message}</p>}

        <label htmlFor='time'>시간</label>
        <Input
          type='time'
          label={'시간'}
          {...register('time')}
        />
        {errors.time && <p className='text-danger text-sm'>{errors.time.message}</p>}
        <Button
          type='submit'
          label='제출하기'
          variant='primary'
        />
      </form>
    </div>
  );
};

export default PostForm;

// import { fetchSignedUrl } from '@/services/client-action/postImageActions';
// import { useImageUploadStore } from '@/stores/useImageUploadStore';
// import { usePostDataStore } from '@/stores/usePostDataStore';
// import browserClient from '@/utils/supabase/client';
// import { useRouter } from 'next/navigation';
// import { useEffect, useState } from 'react';

// const PostForm = () => {
//   const { userId, groupId, lat, lng, addressName } = usePostDataStore();
//   const { images: imagesData } = useImageUploadStore();
//   if (!groupId || !userId) return <div>로딩 중...</div>;

//   const router = useRouter();
//   const decodedAddressName = addressName ? decodeURIComponent(addressName) : undefined;
//   const [description, setDescription] = useState('');
//   const [hashtag, setHashtag] = useState('');
//   const [date, setDate] = useState('');
//   const [time, setTime] = useState('');
//   const [imageUrls, setImageUrls] = useState<string[]>([]);

//   useEffect(() => {
//     if (lat && lng) {
//       console.log('위도:', lat);
//       console.log('경도:', lng);
//     }
//     if (addressName) {
//       console.log('주소:', addressName);
//     }
//   }, [lat, lng, addressName]);

//   // 이미지 URL 생성
//   useEffect(() => {
//     const fetchImageUrls = async () => {
//       const urls = await Promise.all(
//         imagesData.map(async (image) => {
//           const url = await fetchSignedUrl('tour_images', groupId, image.post_image_name || '');
//           return url;
//         }),
//       );
//       setImageUrls(urls);
//     };

//     fetchImageUrls();
//   }, [imagesData, groupId]);

//   const submitPost = async (e: React.FormEvent) => {
//     e.preventDefault();

//     const coverImage = imagesData.find((image) => image.is_cover);
//     const postLat = lat || null;
//     const postLng = lng || null;
//     const imageArray = imagesData.map((image) => image.post_image_name || '');

//     const postData = {
//       user_id: userId,
//       group_id: groupId,
//       post_desc: description,
//       post_date: date,
//       post_time: time,
//       post_lat: postLat,
//       post_lng: postLng,
//       post_thumbnail_image: coverImage?.post_image_name!,
//       image_array: imageArray,
//       post_address: decodedAddressName!,
//     };

//     try {
//       const { data: post, error: postError } = await browserClient
//         .from('posts')
//         .insert(postData)
//         .select('post_id')
//         .single();

//       if (postError || !post) {
//         console.error('포스트 제출에 실패했습니다:', postError?.message);
//         return;
//       }

//       console.log('포스트가 성공적으로 제출되었습니다. post_id:', post, postData);

//       const postId = post.post_id;
//       const { error: imageError } = await browserClient
//         .from('images')
//         .update({ post_id: postId })
//         .eq('upload_session_id', imagesData[0].upload_session_id!);

//       if (imageError) {
//         console.error('이미지에 post_id 업데이트에 실패했습니다:', imageError.message);
//       } else {
//         console.log('이미지의 post_id가 성공적으로 업데이트되었습니다.');
//       }

//       const tags = hashtag
//         .split('#')
//         .map((tag) => tag.trim())
//         .filter((tag) => tag);
//       const tagData = tags.map((tag) => ({
//         tag_title: tag,
//         post_id: postId,
//         group_id: groupId,
//       }));

//       if (tagData.length > 0) {
//         const { error: tagError } = await browserClient.from('tags').insert(tagData);
//         if (tagError) {
//           console.error('태그 저장에 실패했습니다:', tagError.message);
//         } else {
//           console.log('태그가 성공적으로 저장되었습니다.');
//         }

//         router.push(`/group/${groupId}`);
//       }
//     } catch (error) {
//       console.error('포스트 제출 중 오류 발생:', error);
//     }
//   };

//   return (
//     <div className='PostForm'>
//       <form
//         className='w-full border border-black flex flex-col'
//         onSubmit={submitPost}
//       >
//         <label htmlFor='description'>대표</label>
//         <textarea
//           id='description'
//           value={description}
//           onChange={(e) => setDescription(e.target.value)}
//           maxLength={1000}
//           placeholder='여행을 떠나고 싶은 마음으로.'
//           className='description-textarea'
//         />
//         <span>{description.length} / 1000</span>

//         <label htmlFor='hashtag'>해시태그</label>
//         <input
//           type='text'
//           id='hashtag'
//           value={hashtag}
//           onChange={(e) => setHashtag(e.target.value)}
//           placeholder='예: 여행 친구랑'
//           className='hashtag-input'
//         />

//         <label htmlFor='date'>날짜</label>
//         <input
//           type='date'
//           id='date'
//           value={date}
//           onChange={(e) => setDate(e.target.value)}
//           className='date-input'
//         />

//         <label htmlFor='time'>시간</label>
//         <input
//           type='time'
//           id='time'
//           value={time}
//           onChange={(e) => setTime(e.target.value)}
//           className='time-input'
//         />

//         <button
//           type='submit'
//           className='submit-button'
//         >
//           포스트 제출
//         </button>
//       </form>
//     </div>
//   );
// };

// export default PostForm;
