import { useApiRequest } from '../form/Form'
import Button, { ButtonProps } from './Button'
import { CgSpinner } from 'react-icons/cg'
import { RequestState } from '../../hooks/useRequest'
import classNames from 'classnames'

const SubmitButton = ({
  children = 'Submit',
  type = 'submit',
  className,
  ...props
}: ButtonProps) => {
  const { status } = useApiRequest()
  const isLoading = status === RequestState.Loading

  return (
    <Button
      {...props}
      type={type}
      className={classNames(
        'flex items-center relative',
        className,
        isLoading && 'pl-8',
      )}
    >
      {isLoading && <CgSpinner className="absolute left-3 animate-spin" />}
      {children}
    </Button>
  )
}

export default SubmitButton
