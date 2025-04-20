// pages/podcast/[id].js
import Head from "next/head";

export async function getServerSideProps(context) {
  const { id } = context.params;
  const res = await fetch(`http://localhost:8087/api/podcast/${id}`);
  const podcast = await res.json();

  return {
    props: { podcast },
  };
}

export default function PodcastPage({ podcast }) {
  return (
    <>
     <Head>
      <title>{podcast.title}</title>
      <meta name="description" content={podcast.description} />
      <link rel="canonical" href={`http://localhost:8087/api/podcast/${podcast._id}`} />

      <meta property="og:title" content={podcast.title} />
      <meta property="og:description" content={podcast.description} />
      <meta property="og:image" content={`http://localhost:8087/${podcast.coverImageUrl}`} />
      <meta property="og:url" content={`http://localhost:8087/api/podcast/${podcast._id}`} />
      <meta property="og:type" content="article" />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={podcast.title} />
      <meta name="twitter:description" content={podcast.description} />
      <meta name="twitter:image" content={`http://localhost:8087/${podcast.coverImageUrl}`} />
      <meta name="twitter:url" content={`http://localhost:8087/api/podcast/${podcast._id}`} />
</Head>


      <main>
        {/* render podcast info here */}
      </main>
    </>
  );
}
