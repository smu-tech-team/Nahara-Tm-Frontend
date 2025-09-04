// pages/podcast/[id].js
import Head from "next/head";

export async function getServerSideProps(context) {
  const { id } = context.params;
  const res = await fetch(`https://nahara-production.up.railway.app/api/podcast/${id}`);
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
      <link rel="canonical" href={`https://nahara-production.up.railway.app/api/podcast/${podcast._id}`} />

      <meta property="og:title" content={podcast.title} />
      <meta property="og:description" content={podcast.description} />
      <meta property="og:image" content={`https://nahara-production.up.railway.app/${podcast.coverImageUrl}`} />
      <meta property="og:url" content={`https://nahara-production.up.railway.app/api/podcast/${podcast._id}`} />
      <meta property="og:type" content="article" />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={podcast.title} />
      <meta name="twitter:description" content={podcast.description} />
      <meta name="twitter:image" content={`https://nahara-production.up.railway.app/${podcast.coverImageUrl}`} />
      <meta name="twitter:url" content={`https://nahara-production.up.railway.app/api/podcast/${podcast._id}`} />
</Head>


      <main>
        {/* render podcast info here */}
      </main>
    </>
  );
}
