import Head from 'next/head'
import { Layout } from 'layouts/Layout'
import { getModule } from 'modules'

const Component = getModule('test').client

const Home = () => {
  return (
    <Layout>
      <Head>
        <title>Collapp Developer</title>
        <meta name="description" content="Collapp developer basic setup" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div>
        :D?
        <Component />
      </div>
    </Layout>
  )
}

export default Home
