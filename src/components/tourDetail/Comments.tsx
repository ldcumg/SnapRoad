import Comment from './Comment';
import React from 'react';

interface Comment {
  comment_id: string;
  post_id: string;
  parent_id: string | null;
  user_id: string;
  comment_desc: string;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  profiles: {
    user_id: string;
    user_nickname: string;
  };
}

interface CommentsProps {
  comments: Comment[];
}

const Comments = ({ comments }: CommentsProps) => {
  return (
    <ul className='flex flex-col gap-5 border-t'>
      {comments
        .filter((comment) => comment.parent_id === null)
        .map((parentComment) => {
          return (
            <li
              key={parentComment.comment_id}
              className='border-b'
            >
              <Comment
                nickname={parentComment.profiles.user_nickname}
                commentDesc={parentComment.comment_desc}
              />
              <ul>
                {comments
                  .filter((childComment) => childComment.parent_id === parentComment.comment_id)
                  .map((childComment) => {
                    return (
                      <li
                        className='pl-12'
                        key={childComment.comment_id}
                      >
                        <Comment
                          nickname={childComment.profiles.user_nickname}
                          commentDesc={childComment.comment_desc}
                        />
                      </li>
                    );
                  })}
              </ul>
            </li>
          );
        })}
    </ul>
  );
};

export default Comments;
