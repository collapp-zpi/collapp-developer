import { CgSpinner } from 'react-icons/cg'

export const Loading = () => (
  <main className="bg-gray-100 flex flex-col h-full min-h-screen text-gray-500">
    <CgSpinner size="3em" className="animate-spin m-auto" />
  </main>
)
