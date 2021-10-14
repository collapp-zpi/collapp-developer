import { useRouter } from 'next/router'
import { AuthLayout } from '../../../layouts/AuthLayout'
import { FormEvent } from 'react'

const CreatePlugin = () => {
  const router = useRouter()

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    const res = await fetch(`/api/plugins`, {
      method: 'POST',
      body: JSON.stringify({
        name: e.target.name.value,
        description: e.target.description.value,
      }),
    })

    console.log(res)
  }

  return (
    <AuthLayout>
      <form onSubmit={handleSubmit}>
        <input type="text" name="name" placeholder="Name" />
        <input type="text" name="description" placeholder="Description" />
        <button type="submit">Submit</button>
        <button type="button" onClick={() => router.push('/panel/plugins')}>
          Back
        </button>
      </form>
    </AuthLayout>
  )
}

export default CreatePlugin
