import { InputText } from 'shared/components/input/InputText'
import { mixed, object, string } from 'yup'
import { UncontrolledForm } from 'shared/components/form/UncontrolledForm'
import { InputTextarea } from 'shared/components/input/InputTextarea'
import { FiAlignCenter } from 'react-icons/fi'
import { BiText } from 'react-icons/bi'
import { FormProps } from 'shared/hooks/useApiForm'
import SubmitButton from 'shared/components/button/SubmitButton'
import { InputPhoto } from 'shared/components/input/InputPhoto'
import { CgClose } from 'react-icons/cg'
import { MouseEvent as ReactMouseEvent } from 'react'
import classNames from 'classnames'

const schema = object().shape({
  name: string().required().default(''),
  description: string().default(''),
  icon: string(),
})

export const PluginForm = ({
  query,
  initial: { icon, ...initial },
  onSuccess,
  onError,
}: FormProps<typeof schema>) => {
  return (
    <UncontrolledForm
      {...{ schema, query, initial, onSuccess, onError }}
      className="flex flex-col"
    >
      <div className="flex flex-col md:flex-row">
        <InputPhoto name="icon">
          {({ open, getRootProps, value, onChange }) => {
            const handleClearIcon = (e: ReactMouseEvent<HTMLDivElement>) => {
              e.stopPropagation()
              onChange(undefined)
            }
            return (
              <div
                {...getRootProps()}
                onClick={open}
                className={classNames(
                  'h-28 w-28 rounded-xl border-2 p-2 mr-2 cursor-pointer relative',
                  value && 'border-blue-400',
                )}
              >
                {value && (
                  <div
                    className="right-1 top-1 absolute bg-gray-300 p-1 rounded-lg"
                    onClick={handleClearIcon}
                  >
                    <CgClose />
                  </div>
                )}
                {(icon || value) && (
                  <img
                    src={value || icon}
                    className="shadow-lg"
                    style={{ borderRadius: '25%' }}
                  />
                )}
              </div>
            )
          }}
        </InputPhoto>
        <div className="flex-grow flex flex-col">
          <InputText
            name="name"
            label="Name"
            icon={BiText}
            className="mt-2 md:mt-0"
          />
          <InputTextarea
            name="description"
            label="Description"
            className="mt-2"
            icon={FiAlignCenter}
          />
        </div>
      </div>
      <SubmitButton className="ml-auto mt-4" />
    </UncontrolledForm>
  )
}
