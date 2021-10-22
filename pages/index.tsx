import Head from 'next/head'
import { Layout } from 'layouts/Layout'
import { getModule } from 'modules'
import { useCallback } from 'react'

const TestComponent = getModule('test').client
const NotesComponent = getModule('notes').client

const useWebsocket = () => {
  const on = useCallback((...args) => console.info(...args), [])
  return {
    send: (...args) => console.log(...args),
    on,
  }
}

const Home = () => {
  const websocket = useWebsocket()
  return (
    <Layout>
      <Head>
        <title>Collapp Developer</title>
        <meta name="description" content="Collapp developer basic setup" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div>
        <TestComponent />
        <NotesComponent websocket={websocket} />
      </div>
    </Layout>
  )
}

export default Home
