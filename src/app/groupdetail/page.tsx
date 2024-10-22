type Props = {
  searchParams: { group_id: string };
};

const GroupDetailPage = ({ searchParams: { group_id } }: Props) => {
  return (
    <div>
      <p>GroupDetailPage</p>
      <p>{group_id}</p>
    </div>
  );
};

export default GroupDetailPage;
