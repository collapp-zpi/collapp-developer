import { useApiRequest } from '../form/Form'
import Button, { ButtonProps } from './Button'
import { CgSpinner } from 'react-icons/cg'
import { useFormContext } from 'react-hook-form'

const SubmitButton = ({
  children = 'Submit',
  type = 'submit',
  ...props
}: ButtonProps) => {
  const { formState } = useFormContext()
  const { isDirty } = formState
  const { isLoading } = useApiRequest()

  return (
    <Button {...props} type={type} disabled={isLoading || !isDirty}>
      {isLoading && <CgSpinner className="animate-spin mr-2 -ml-2" />}
      {children}
    </Button>
  )
}

export default SubmitButton
