import { useState } from 'react';

type PostFormProps = {
  groupId: string;
};

const PostForm = ({ groupId }: PostFormProps) => {
  const [description, setDescription] = useState('');
  const [hashtag, setHashtag] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log('제출된 내용:', { groupId, description, hashtag, date, time });
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
          onChange={(e) => setDescription(e.target.value)}
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
          onChange={(e) => setHashtag(e.target.value)}
          className='hashtag-input'
        />

        <label htmlFor='date'>날짜</label>
        <input
          type='date'
          id='date'
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className='date-input'
        />

        <label htmlFor='time'>시간</label>
        <input
          type='time'
          id='time'
          value={time}
          onChange={(e) => setTime(e.target.value)}
          className='time-input'
        />

        <button
          type='submit'
          className='submit-button'
          disabled={loading}
        >
          {loading ? '저장 중...' : '작성 완료'}
        </button>
      </form>
    </div>
  );
};

export default PostForm;
