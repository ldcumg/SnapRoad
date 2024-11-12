import LogoUserHeader from '@/components/layout/LogoUserHeader';
import EditForms from '@/components/post/EditForms';
import PostAddress from '@/components/post/PostAddress';
import ImageBottomSheet from '@/components/post/PostBottomSheet';
import PostImage from '@/components/post/PostImage';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '수정하기',
  description: 'A Next.js project with TypeScript and TailwindCSS.',
  keywords: 'Next.js, Typescript, TailwindCSS',
};

type Props = {
  params: { groupId: string };
  children: React.ReactNode;
};

const EditPage = ({ params: { groupId } }: Props) => {
  return (
    <>
      <LogoUserHeader />

      <div className='mt-14'>
        <PostAddress groupId={groupId} />
        <ImageBottomSheet />
        <PostImage showImages={false} />
        <EditForms />
      </div>
    </>
  );
};

export default EditPage;
