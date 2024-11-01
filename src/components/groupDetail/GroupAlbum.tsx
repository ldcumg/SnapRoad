'use client';

import { getGroupPostsImagesQuery } from '@/hooks/queries/post/useGroupPostsQuery';
import { GroupDetailMode, type GroupInfo } from '@/types/groupTypes';
import Link from 'next/link';

type Props = {
  groupId: string;
  groupInfo: GroupInfo;
  setMode: React.Dispatch<React.SetStateAction<GroupDetailMode>>;
};

const GroupAlbum = ({ groupId, groupInfo: { group_image_url, user_group, group_desc }, setMode }: Props) => {
  const { data: postsImages, isPending, isError, error } = getGroupPostsImagesQuery(groupId);

  if (isPending) return;

  if (isError) throw new Error(error.message);

  const handleScrollTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      <div>
        <img src={group_image_url} />
        <div>
          <button onClick={() => setMode(GroupDetailMode.member)}>사람 {user_group.length}</button>
          <div>설정</div>
          <p>{group_desc}</p>
        </div>
      </div>
      {!!postsImages ? (
        <ol>
          {postsImages.map((image) => (
            <li key={image.id}>
              {/* NOTE - 임시 */}
              <Link href={`/상세/${image.post_id}`}>
                <img src={image.post_image_url} />
              </Link>
            </li>
          ))}
        </ol>
      ) : (
        <p>
          게시물이 없습니다.
          <br />
          추억을 공유해보세요!
        </p>
      )}
      <button onClick={handleScrollTop}>탑 스크롤</button>
    </>
  );
};

export default GroupAlbum;
