'use client';

import Link from 'next/link';

type Props = {
  groupId: string;
  desktop: boolean;
  postsPreView: {
    postId: string;
    postImageUrl: string;
  }[];
};

const PostsPreview = ({ groupId, desktop, postsPreView }: Props) => {
  const PRIORITY_CRITERIA = desktop ? 5 : 3;

  return (
    <ol className='flex flex-row gap-[12px] overflow-x-auto pc:min-w-[456px] pc:max-w-[856px]'>
      {postsPreView.map((post, index) => (
        <li
          className='h-[132px] w-[132px] pc:h-[152px] pc:w-[152px]'
          key={post.postId}
        >
          <Link
            className='block h-full w-full'
            href={`/group/${groupId}/post/${post.postId}`}
          >
            <img
              className='h-full min-h-[132px] w-full min-w-[132px] rounded-[8px] object-cover pc:min-h-[152px] pc:min-w-[152px] pc:rounded-[12px]'
              src={post.postImageUrl}
              alt={`Post ${post.postId}`}
              fetchPriority={index < PRIORITY_CRITERIA ? 'high' : 'low'}
            />
          </Link>
        </li>
      ))}
    </ol>
  );
};

export default PostsPreview;
