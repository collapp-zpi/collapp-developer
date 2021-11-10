import type { GetServerSideProps, InferGetServerSidePropsType } from 'next'
import Head from 'next/head'
import { DraftPlugin } from '@prisma/client'
import { Layout } from 'layouts/Layout'
import { useRouter } from 'next/router'
import dayjs from 'dayjs'
import { defaultPluginIcon } from 'config/defaultIcons'
import { generateKey, objectPick } from 'shared/utils/object'
import { object, string } from 'yup'
import { useFilters, withFilters } from 'shared/hooks/useFilters'
import { useQuery } from 'shared/hooks/useQuery'
import { FiltersForm } from 'shared/components/form/FiltersForm'
import { InputText } from 'shared/components/input/InputText'
import { AiOutlineSearch } from 'react-icons/ai'
import { LogoSpinner } from 'shared/components/LogoSpinner'
import { Pagination } from 'shared/components/Pagination'
import { truncate } from 'shared/utils/text'
import { withAuth } from 'shared/hooks/useAuth'

export const getServerSideProps: GetServerSideProps = async (context) => {
  const params = objectPick(context.query, ['limit', 'page', 'name'])
  const search = new URLSearchParams(params)

  const res = await fetch(`${process.env.BASE_URL}/api/published?${search}`, {
    method: 'GET',
    headers: {
      ...(context?.req?.headers?.cookie && {
        cookie: context.req.headers.cookie,
      }),
    },
  })

  if (!res.ok) {
    return {
      props: {
        error: await res.json(),
        isError: true,
      },
    }
  }

  return {
    props: {
      fallback: {
        [generateKey('published', params)]: await res.json(),
      },
    },
  }
}

const filtersSchema = object().shape({
  name: string().default(''),
})

const Published = ({
  props,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const router = useRouter()
  const [, setFilters] = useFilters()
  const { data } = useQuery('published', '/api/published')

  if (props?.isError) {
    return <div>error hello</div>
  }

  return (
    <Layout>
      <Head>
        <title>Published</title>
      </Head>
      <div className="bg-white p-6 rounded-3xl shadow-2xl overflow-x-auto mb-4">
        <FiltersForm schema={filtersSchema}>
          <InputText icon={AiOutlineSearch} name="name" label="Plugin name" />
        </FiltersForm>
      </div>

      {!data && (
        <div className="m-12">
          <LogoSpinner />
        </div>
      )}
      {!!data && !data.entities?.length && (
        <div className="bg-white p-8 rounded-3xl shadow-2xl text-gray-400 text-center text-lg">
          No plugins found
        </div>
      )}

      {!!data && !!data.entities?.length && (
        <>
          <div className="bg-white px-8 py-4 rounded-3xl shadow-2xl overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr>
                  <th className="text-left p-4">Name</th>
                  <th className="text-left p-4">Description</th>
                  <th className="text-left p-4">Date</th>
                </tr>
              </thead>
              <tbody>
                {data.entities.map(
                  ({ id, name, description, updatedAt, icon }: DraftPlugin) => (
                    <tr
                      key={id}
                      onClick={() => router.push(`/published/${id}`)}
                      className="cursor-pointer border-t-2 border-gray-100 hover:bg-gray-50 transition-colors"
                    >
                      <td className="p-4 flex items-center">
                        <img
                          src={icon || defaultPluginIcon}
                          className="shadow-lg w-8 h-8 mr-3 bg-gray-200 rounded-25"
                          alt="Plugin icon"
                        />
                        {truncate(name, 50)}
                      </td>
                      <td className="p-4">{truncate(description, 100)}</td>
                      <td className="p-4 text-sm">
                        {dayjs(updatedAt).format('LLL')}
                      </td>
                    </tr>
                  ),
                )}
              </tbody>
            </table>
          </div>
          <div className="flex justify-center mt-8">
            <Pagination
              page={data?.pagination.page}
              pages={data?.pagination.pages}
              setPage={(page) => setFilters({ page: String(page) })}
            />
          </div>
        </>
      )}
    </Layout>
  )
}

export default withAuth(withFilters(Published, ['limit', 'page', 'name']))
