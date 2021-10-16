import type { GetServerSideProps } from 'next'
import { getSession } from 'next-auth/react'

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getSession(context)
  if (!session)
    return {
      redirect: {
        destination: '/',
        permanent: true,
      },
    }

  return {
    redirect: {
      destination: '/panel/plugins',
      permanent: true,
    },
  }
}

const Panel = () => null

export default Panel
