import { InputText } from 'shared/components/input/InputText'
import { object, string } from 'yup'
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
import { defaultPluginIcon } from 'config/defaultIcons'
import { toast } from 'react-hot-toast'

const schema = object().shape({
  name: string().required().default(''),
  description: string().default(''),
  icon: string(),
})

export const PluginForm = ({
  query,
  initial: { icon, ...initial },
}: FormProps<typeof schema>) => {
  const onSuccess = () => {
    toast.success('The plugin has been updated successfully.')
  }

  const onError = ({ message }: { message?: string }) => {
    toast.error(
      `There has been an error while updating the plugin. ${
        !!message && `(${message})`
      }`,
    )
  }

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
                <img
                  src={value || icon || defaultPluginIcon}
                  className="shadow-lg"
                  alt="Plugin icon"
                  style={{ borderRadius: '25%' }}
                />
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
