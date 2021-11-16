import type { GetServerSideProps } from 'next'
import Head from 'next/head'
import { Layout } from 'layouts/Layout'
import { useRouter } from 'next/router'
import Button from 'shared/components/button/Button'
import { GoChevronLeft } from 'react-icons/go'
import { SingleFile } from 'includes/plugins/components/PluginFileForm'
import Link from 'next/link'
import {
  InputRangeFrame,
  PureInputRange,
} from 'shared/components/input/InputRange'
import { withAuth } from 'shared/hooks/useAuth'
import { generateKey } from 'shared/utils/object'
import { useQuery } from 'shared/hooks/useQuery'
import { ErrorInfo } from 'shared/components/ErrorInfo'
import { LogoSpinner } from 'shared/components/LogoSpinner'
import { fetchApi } from 'shared/utils/fetchApi'

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { id } = context.query
  const res = await fetchApi(`/api/published/${id}`)(context)

  if (!res.ok) {
    return {
      props: {
        error: await res.json(),
      },
    }
  }

  return {
    props: {
      fallback: {
        [generateKey('published', String(id))]: await res.json(),
      },
    },
  }
}

const Published = () => {
  const router = useRouter()
  const pathId = String(router.query.id)
  const { data, error } = useQuery(
    ['published', pathId],
    `/api/published/${pathId}`,
  )

  const {
    name,
    description,
    icon,
    minWidth,
    maxWidth,
    minHeight,
    maxHeight,
    source,
    draft,
  } = data || {}

  return (
    <Layout>
      <Head>
        <title>Plugin</title>
      </Head>
      <Button
        color="light"
        onClick={() => router.push('/published')}
        className="mb-4"
      >
        <GoChevronLeft className="mr-2 -ml-2" />
        Back
      </Button>
      {!!error && (
        <div className="mt-6">
          <ErrorInfo error={error} />
        </div>
      )}
      {!data && !error && (
        <div className="m-12">
          <LogoSpinner />
        </div>
      )}
      {!!data && !error && (
        <>
          <div className="bg-white px-8 py-8 rounded-3xl shadow-2xl">
            <div className="flex">
              <img
                src={icon}
                className="rounded-25 w-12 mr-4"
                alt="Plugin icon"
              />
              <h2 className="font-bold text-xl pt-2">{name}</h2>
            </div>
            <p className="mt-2">{description}</p>
          </div>
          <div className="bg-white px-8 py-8 rounded-3xl shadow-2xl mt-8">
            <h1 className="text-xl font-bold text-gray-500 mb-4">
              Plugin size
            </h1>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <InputRangeFrame
                className="mt-2"
                label="Width"
                display={
                  minWidth === maxWidth ? minWidth : `${minWidth} - ${maxWidth}`
                }
              >
                <PureInputRange
                  values={[minWidth, maxWidth]}
                  onChange={() => undefined}
                  min={1}
                  max={4}
                  disabled={true}
                />
              </InputRangeFrame>
              <InputRangeFrame
                className="mt-2"
                label="Height"
                display={
                  minHeight === maxHeight
                    ? minHeight
                    : `${minHeight} - ${maxHeight}`
                }
              >
                <PureInputRange
                  values={[minHeight, maxHeight]}
                  onChange={() => undefined}
                  min={1}
                  max={4}
                  disabled={true}
                />
              </InputRangeFrame>
            </div>
          </div>
          <div className="bg-white px-8 py-8 rounded-3xl shadow-2xl mt-8">
            <h1 className="text-xl font-bold text-gray-500 mb-4">
              Source code
            </h1>
            <SingleFile file={source} />
          </div>
          <div className="bg-white px-8 py-8 rounded-3xl shadow-2xl mt-8">
            <h1 className="text-xl font-bold text-gray-500 mb-4">Manage</h1>
            {!!draft && (
              <div className="flex items-center">
                <div className="flex-grow flex flex-col mr-2">
                  <h4 className="font-bold text-md">View draft</h4>
                  <h6 className="text-sm">
                    Go to the draft version of the plugin
                  </h6>
                </div>
                <Link href={`/plugins/${draft.id}`} passHref>
                  <Button color="light">View</Button>
                </Link>
              </div>
            )}
          </div>
        </>
      )}
    </Layout>
  )
}

export default withAuth(Published)
