import { Suspense } from "react";
import { notFound } from "next/navigation";
import { getNewsDetail, getNewsList } from "@/app/_libs/microcms";
import Article from "@/app/_components/Article";
import ButtonLink from "@/app/_components/ButtonLink";
import styles from "./page.module.css";

type Props = {
  params: Promise<{
    slug: string;
  }>;
  searchParams: Promise<{
    dk?: string;
  }>;
};

export const revalidate = 0;

// 既知の記事は、ビルド時に事前生成する
export async function generateStaticParams() {
  const { contents } = await getNewsList({ fields: "id", limit: 100 });
  return contents.map((news) => ({ slug: news.id }));
}

// Page 自身は await しない。params をそのまま渡す
export default function Page({ params, searchParams }: Props) {
  return (
    <Suspense fallback={<p>読み込み中...</p>}>
      <NewsDetail params={params} searchParams={searchParams} />
    </Suspense>
  );
}

// await は Suspense の内側で行う
async function NewsDetail({
  params,
  searchParams,
}: Pick<Props, "params" | "searchParams">) {
  const { slug } = await params;
  const { dk } = await searchParams;
  const data = await getNewsDetail(slug, {
    draftKey: dk,
  }).catch(notFound);

  return (
    <>
      <Article data={data} />
      <div className={styles.footer}>
        <ButtonLink href="/news">ニュース一覧へ</ButtonLink>
      </div>
    </>
  );
}