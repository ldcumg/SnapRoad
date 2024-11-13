import { useState } from 'react';

interface HashtagInputProps {
  hashtags: string[];
  setHashtags: (tags: string[]) => void;
}

const HashtagInput = ({ hashtags, setHashtags }: HashtagInputProps) => {
  const [inputValue, setInputValue] = useState('');

  const addHashtag = () => {
    const trimmedTag = inputValue.trim().replace(/^#/, '');
    if (trimmedTag && !hashtags.includes(trimmedTag)) {
      setHashtags([...hashtags, trimmedTag]);
      setInputValue('');
    }
  };

  const removeHashtag = (tagToRemove: string) => {
    setHashtags(hashtags.filter((tag) => tag !== tagToRemove));
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && inputValue.trim()) {
      e.preventDefault();
      addHashtag();
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  return (
    <div className='flex flex-wrap items-center rounded-md border border-gray-100 bg-white px-3 py-3'>
      <div className='flex flex-wrap gap-2'>
        {hashtags.map((tag, index) => (
          <span
            key={index}
            className='flex items-center text-base font-semibold text-gray-500'
          >
            #{tag}
            <button
              type='button'
              onClick={() => removeHashtag(tag)}
              className='ml-1 text-gray-400 hover:text-danger'
            >
              &times;
            </button>
          </span>
        ))}
      </div>
      <input
        type='text'
        value={inputValue}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        placeholder='# 해시태그를 추가해 보세요'
        className='ml-1 min-w-[100px] flex-grow outline-none'
      />
    </div>
  );
};

export default HashtagInput;

// import { useState, forwardRef } from 'react';
// import { useController, Control } from 'react-hook-form';

// interface HashtagInputProps {
//   control: Control<{ desc: string; date: string; time: string; hashtags?: string[] }>;
//   name: 'hashtags';
//   placeholder?: string;
//   errorText?: string;
// }

// // HashtagInput을 forwardRef로 수정
// const HashtagInput = forwardRef<HTMLInputElement, HashtagInputProps>(
//   ({ control, name, placeholder, errorText }, ref) => {
//     const { field } = useController({
//       name,
//       control,
//       defaultValue: [], // 기본값 설정
//     });

//     const [inputValue, setInputValue] = useState('');
//     const [hashtags, setHashtags] = useState<string[]>(Array.isArray(field.value) ? field.value : []);

//     const addHashtag = () => {
//       const trimmedTag = inputValue.trim().replace(/^#/, ''); // '#'을 제거하고 공백 제거
//       if (trimmedTag && !hashtags.includes(trimmedTag)) {
//         const updatedHashtags = [...hashtags, trimmedTag];
//         setHashtags(updatedHashtags);
//         field.onChange(updatedHashtags); // react-hook-form 상태 업데이트
//       }
//       setInputValue('');
//     };

//     const removeHashtag = (tagToRemove: string) => {
//       const updatedHashtags = hashtags.filter((tag) => tag !== tagToRemove);
//       setHashtags(updatedHashtags);
//       field.onChange(updatedHashtags);
//     };

//     const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
//       if (e.key === 'Enter' && inputValue.trim()) {
//         e.preventDefault();
//         addHashtag();
//       }
//     };

//     const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//       setInputValue(e.target.value);
//     };

//     return (
//       <div>
//         <div className='flex flex-wrap items-center rounded-md border border-gray-100 bg-white px-3 py-3 text-gray-900 focus:border-gray-300'>
//           <div className='flex flex-wrap gap-2'>
//             {hashtags.map((tag, index) => (
//               <span
//                 key={index}
//                 className='flex items-center text-base font-semibold text-gray-500'
//               >
//                 #{tag}
//                 <button
//                   type='button'
//                   onClick={() => removeHashtag(tag)}
//                   className='ml-1 text-gray-400 hover:text-danger'
//                 >
//                   &times;
//                 </button>
//               </span>
//             ))}
//           </div>
//           <input
//             type='text'
//             value={inputValue}
//             onChange={handleInputChange}
//             onKeyDown={handleKeyDown}
//             placeholder={placeholder || '# 해시태그를 추가해 보세요'}
//             className='ml-1 min-w-[100px] flex-grow outline-none'
//             ref={ref} // ref를 전달
//           />
//         </div>
//         {errorText && <p className='mt-1 text-sm text-danger'>{errorText}</p>}
//       </div>
//     );
//   },
// );

// export default HashtagInput;
