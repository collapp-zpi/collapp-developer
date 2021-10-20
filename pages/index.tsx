import Head from 'next/head'
import { Layout } from 'layouts/Layout'

const Home = () => {
  return (
    <Layout>
      <Head>
        <title>Collapp Developer</title>
        <meta name="description" content="Collapp developer basic setup" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
    </Layout>
  )
}

export default Home
