import { GetServerSidePropsContext } from 'next'
import Head from 'next/head'
import { DraftPlugin } from '@prisma/client'
import { Layout } from 'layouts/Layout'
import { useRouter } from 'next/router'
import Button from 'shared/components/button/Button'
import { GoPlus } from 'react-icons/go'
import dayjs from 'dayjs'
import classNames from 'classnames'
import { useFilters, withFilters } from 'shared/hooks/useFilters'
import { useQuery } from 'shared/hooks/useQuery'
import { FiltersForm } from 'shared/components/form/FiltersForm'
import { object, string } from 'yup'
import { InputText } from 'shared/components/input/InputText'
import { AiOutlineSearch } from 'react-icons/ai'
import { LogoSpinner } from 'shared/components/LogoSpinner'
import { Pagination } from 'shared/components/Pagination'
import { objectPick } from 'shared/utils/object'
import { Tooltip } from 'shared/components/Tooltip'
import { truncate } from 'shared/utils/text'
import { withAuth } from 'shared/hooks/useAuth'
import { ErrorInfo } from 'shared/components/ErrorInfo'
import { fetchApiFallback } from 'shared/utils/fetchApi'
import { defaultPluginIcon } from 'shared/utils/defaultIcons'

export const getServerSideProps = async (
  context: GetServerSidePropsContext,
) => {
  const params = objectPick(context.query, ['limit', 'page', 'name'])
  const search = new URLSearchParams(params)

  const fetch = fetchApiFallback(context)
  const plugins = await fetch(['plugins', params], `/api/plugins?${search}`)

  return {
    props: {
      fallback: { ...plugins },
    },
  }
}

const filtersSchema = object().shape({
  name: string().default(''),
})

const Plugins = () => {
  const router = useRouter()
  const [, setFilters] = useFilters()
  const { data, error } = useQuery('plugins', '/api/plugins')

  return (
    <Layout>
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
      {!!error && (
        <div className="mt-12">
          <ErrorInfo error={error} />
        </div>
      )}
      {!data && !error && (
        <div className="m-12">
          <LogoSpinner />
        </div>
      )}
      {!!data && !error && !data.entities?.length && (
        <div className="bg-white p-8 rounded-3xl shadow-2xl text-gray-400 text-center text-lg">
          No plugins found
        </div>
      )}
      {!!data && !error && !!data.entities?.length && (
        <>
          <div className="bg-white px-8 py-4 rounded-3xl shadow-2xl overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr>
                  <th className="text-left p-4">Name</th>
                  <th className="text-left p-4">Description</th>
                  <th className="text-left p-4">Date</th>
                  <th className="text-left p-4">Status</th>
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
                        {truncate(name, 50)}
                      </td>
                      <td className="p-4">{truncate(description, 100)}</td>
                      <td className="p-4 text-sm">
                        {dayjs(createdAt).format('LLL')}
                      </td>
                      <td className="p-4">
                        <Tooltip
                          value={
                            isBuilding
                              ? 'Building'
                              : isPending
                              ? 'Pending'
                              : 'Draft'
                          }
                        >
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
                        </Tooltip>
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

export default withAuth(withFilters(Plugins, ['limit', 'page', 'name']))
