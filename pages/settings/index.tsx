import Head from 'next/head'
import { AuthLayout } from 'layouts/AuthLayout'
import { toast } from 'react-hot-toast'
import { object, string } from 'yup'
import { UncontrolledForm } from 'shared/components/form/UncontrolledForm'
import { InputPhoto } from 'shared/components/input/InputPhoto'
import { InputText } from 'shared/components/input/InputText'
import { BiText } from 'react-icons/bi'
import SubmitButton from 'shared/components/button/SubmitButton'
import { GetServerSideProps, InferGetServerSidePropsType } from 'next'
import { updateUser } from 'includes/user/endpoints'
import { useSWRConfig } from 'swr'

export const getServerSideProps: GetServerSideProps = async (context) => {
  const res = await fetch(`${process.env.BASE_URL}/api/user`, {
    method: 'GET',
    headers: {
      ...(context?.req?.headers?.cookie && {
        cookie: context.req.headers.cookie,
      }),
    },
  })
  return {
    props: {
      user: await res.json(),
    },
  }
}

const schema = object().shape({
  name: string().required().default(''),
  image: string(),
})

const UserSettings = ({
  user,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const { mutate } = useSWRConfig()
  const onSuccess = () => {
    toast.success('Your profile has been updated successfully.')
    return mutate('user')
  }

  const onError = ({ message }: { message?: string }) => {
    toast.error(
      `There has been an error while updating your profile. ${
        !!message && `(${message})`
      }`,
    )
  }

  return (
    <AuthLayout>
      <Head>
        <title>Settings</title>
      </Head>
      <div className="bg-white px-8 py-8 rounded-3xl shadow-2xl">
        <h1 className="text-2xl font-bold text-gray-500 mb-4">User settings</h1>
        <UncontrolledForm
          {...{ schema, onSuccess, onError }}
          query={updateUser}
          initial={{ name: user.name }}
          className="flex flex-col"
        >
          <div className="flex flex-col md:flex-row">
            <InputPhoto name="image" image={user.image} />
            <div className="flex-grow flex flex-col">
              <InputText
                name="name"
                label="Name"
                icon={BiText}
                className="mt-2 md:mt-0"
              />
            </div>
          </div>
          <SubmitButton className="ml-auto mt-4" />
        </UncontrolledForm>
      </div>
    </AuthLayout>
  )
}

export default UserSettings
