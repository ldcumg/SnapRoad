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
    if (e.key === 'Enter') {
      e.preventDefault();
      addHashtag();
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  return (
    <div className='flex flex-wrap items-center rounded-md border border-gray-100 bg-white px-3 py-2'>
      <div className='flex flex-wrap gap-2'>
        {hashtags.map((tag, index) => (
          <span
            key={index}
            className='flex items-center py-1 text-sm font-medium text-gray-700'
          >
            #{tag}
            <button
              type='button'
              onClick={() => removeHashtag(tag)}
              className='ml-1 text-gray-500 hover:text-red-500'
              aria-label={`${tag} 해시태그 삭제`}
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
        placeholder='해시태그를 입력하고 Enter 키를 누르세요'
        className='ml-1 flex-grow text-gray-700 placeholder-gray-400 outline-none'
        autoCorrect='off'
        autoCapitalize='none'
        autoComplete='off'
      />
    </div>
  );
};

export default HashtagInput;
