import type { GetServerSideProps, InferGetServerSidePropsType } from 'next'
import Head from 'next/head'
import { DraftPlugin } from '@prisma/client'
import { AuthLayout } from 'layouts/AuthLayout'
import { useRouter } from 'next/router'
import Button from 'shared/components/button/Button'
import { GoPlus } from 'react-icons/go'
import dayjs from 'dayjs'
import { defaultPluginIcon } from 'config/defaultIcons'
import classNames from 'classnames'
import { useFilters, withFilters } from 'shared/hooks/useFilters'
import { useQuery } from 'shared/hooks/useQuery'
import { FiltersForm } from 'shared/components/form/FiltersForm'
import { object, string } from 'yup'
import { InputText } from 'shared/components/input/InputText'
import { AiOutlineSearch } from 'react-icons/ai'
import { LogoSpinner } from 'shared/components/LogoSpinner'
import { Pagination } from 'shared/components/Pagination'
import { generateKey, objectPick } from 'shared/utils/object'

export const getServerSideProps: GetServerSideProps = async (context) => {
  const params = objectPick(context.query, ['limit', 'page', 'name'])
  const search = new URLSearchParams(params)

  const res = await fetch(`${process.env.BASE_URL}/api/plugins?${search}`, {
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
        [generateKey('plugins', params)]: await res.json(),
      },
    },
  }
}

const filtersSchema = object().shape({
  name: string().default(''),
})

const Plugins = ({
  props,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const router = useRouter()
  const [, setFilters] = useFilters()
  const { data } = useQuery('plugins', '/api/plugins')

  if (props?.isError) {
    return <div>error hello</div>
  }

  return (
    <AuthLayout>
      <Head>
        <title>Plugins</title>
      </Head>
      <Button
        onClick={() => router.push('/plugins/create')}
        className="ml-auto mb-4"
      >
        <GoPlus className="mr-2 -ml-2" />
        Add
      </Button>

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
                  <th className="text-left p-4">Pending</th>
                </tr>
              </thead>
              <tbody>
                {data.entities.map(
                  ({
                    id,
                    name,
                    description,
                    isPending,
                    isBuilding,
                    createdAt,
                    icon,
                  }: DraftPlugin) => (
                    <tr
                      key={id}
                      onClick={() => router.push(`/plugins/${id}`)}
                      className="cursor-pointer border-t-2 border-gray-100 hover:bg-gray-50 transition-colors"
                    >
                      <td className="p-4 flex items-center">
                        <img
                          src={icon || defaultPluginIcon}
                          className="shadow-lg w-8 h-8 mr-3 bg-gray-200 rounded-25"
                          alt="Plugin icon"
                        />
                        {name}
                      </td>
                      <td className="p-4">{description}</td>
                      <td className="p-4">{dayjs(createdAt).format('LLL')}</td>
                      <td className="p-4">
                        <div
                          className={classNames(
                            'w-4 h-4 rounded-full',
                            isBuilding
                              ? 'bg-yellow-500'
                              : isPending
                              ? 'bg-green-500'
                              : 'bg-gray-300',
                          )}
                        />
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
    </AuthLayout>
  )
}

export default withFilters(Plugins, ['limit', 'page', 'name'])
