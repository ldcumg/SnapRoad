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
