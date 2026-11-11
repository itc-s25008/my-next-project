import { notFound } from 'next/navigation';
import { getNewsList } from '@/app/_libs/microcms';
import NewsList from '@/app/_components/NewsList';
import { NEWS_LIST_LIMIT } from '@/app/_components/_constants';
import Pagination from '@/app/_components/Pagination';

type Props = {
  params: Promise<{
    current: string;
  }>;
};

export default async function Page({ params }: Props) {
  const { current } = await params;
  const currentNum = parseInt(current, 10);

  if (Number.isNaN(currentNum) || currentNum < 1) {
    notFound();
  }


  const { contents: news, totalCount } = await getNewsList({
    limit: NEWS_LIST_LIMIT,
    offset: NEWS_LIST_LIMIT * (currentNum - 1),
  });

  if (news.length === 0) {
    notFound();
  }

  return (
    <>
      <NewsList news={news} />
      <Pagination
        totalCount={totalCount}
        current={currentNum}
      />
    </>
  );
}