import type { Metadata } from 'next';

export const generateMetadata = async () => {
  return {
    title: '...',
  };
};

type Props = Readonly<{
  children: React.ReactNode;
  params: { groupId: string };
  // searchParams: {  lat: string; lng: string };
}>;

const GroupDetailLayout = ({ children, params: { groupId } }: Props) => {
  return <>{children}</>;
};

export default GroupDetailLayout;
