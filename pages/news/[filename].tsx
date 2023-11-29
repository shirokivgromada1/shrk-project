import { Layout } from "./../../components/layout/layout";
import { useTina } from "tinacms/dist/react";
import NewsCard from "../../components/news/NewsID/NewsCard";
import { GetServerSidePropsContext } from "next";
import client from "@/tina/__generated__/client";
import { News } from "@/tina/__generated__/types";

export default function Home(
  props: AsyncReturnType<typeof getServerSideProps>["props"]
) {
  // data passes though in production mode and data is updated to the sidebar data in edit-mode
  const { data } = useTina({
    query: props.query,
    variables: props.variables,
    data: props.data,
  });

  return (
    <Layout data={data.global}>
      <NewsCard
        {...(data.news as News)}
        url={data.url}
        filename={data.filename}
      />
    </Layout>
  );
}

export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
  const { data, query, variables } = await client.queries.blogNewsQuery({
    relativePath: ctx?.params?.filename + ".mdx",
  });

  return {
    props: {
      data: {
        ...data,
        filename: ctx?.params?.filename,
        url: `${process.env.NEXT_BASE_URL}/news/${ctx?.params?.filename}`,
      },
      query: query,
      variables: variables,
    },
  };
};

export type AsyncReturnType<T extends (...args: any) => Promise<any>> =
  T extends (...args: any) => Promise<infer R> ? R : any;
