import { Button } from '@/stories/Button';
import { useState } from 'react';

const PostForm = () => {
  const groupId = '2fef6a47-a295-40e5-abca-1a40354f91ca';
  const [description, setDescription] = useState('');
  const [hashtag, setHashtag] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [loading, setLoading] = useState(true);

  const handleDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setDescription(e.target.value);
  };

  const handleHashtagChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setHashtag(e.target.value);
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDate(e.target.value);
  };

  const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTime(e.target.value);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log('제출된 내용:', { description, hashtag, date, time });
  };

  return (
    <div className='PostForm'>
      <h1>그룹 {groupId} 포스트 작성</h1>
      <form
        className='w-full border border-black flex flex-col'
        onSubmit={handleSubmit}
      >
        <label htmlFor='description'>대표</label>
        <textarea
          id='description'
          value={description}
          onChange={handleDescriptionChange}
          maxLength={1000}
          placeholder='이행을 떠나고 싶은 마음으로.'
          className='description-textarea'
        />
        <span>{description.length} / 1000</span>

        <label htmlFor='hashtag'># 해시태그를 입력해주세요.</label>
        <input
          type='text'
          id='hashtag'
          value={hashtag}
          onChange={handleHashtagChange}
          className='hashtag-input'
        />

        <label htmlFor='date'>날짜</label>
        <input
          type='date'
          id='date'
          value={date}
          onChange={handleDateChange}
          className='date-input'
        />

        <label htmlFor='time'>시간</label>
        <input
          type='time'
          id='time'
          value={time}
          onChange={handleTimeChange}
          className='time-input'
        />

        <button
          type='submit'
          className='submit-button'
        >
          수정 완료
        </button>
      </form>
    </div>
  );
};

export default PostForm;
