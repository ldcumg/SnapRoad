import ImageSlide from '@/components/post/ImageSlide';
import Link from 'next/link';
import { useRouter } from 'next/router';

const PostPage = () => {
  const router = useRouter();
  const { groupId } = router.query; 

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    console.log('그룹 ID:', groupId);
    
  };

  return (
    <div>
      <h1>그룹 {groupId} 포스트 작성</h1>
      <Link href={`/post/${groupId}`}>
        <button>포스트 작성하기</button>
      </Link>

      <form onSubmit={handleSubmit}>
        <label>
          제목:
          <input
            type='text'
            required
          />
        </label>
        <label>
          내용:
          <textarea required />
        </label>
        {/* <ImageSlide /> */}
        <button type='submit'>포스트 등록</button>
      </form>
    </div>
  );
};

export default PostPage;
