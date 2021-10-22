import { number, object } from 'yup'
import { UncontrolledForm } from 'shared/components/form/UncontrolledForm'
import { FormProps } from 'shared/hooks/useApiForm'
import { InputRange } from 'shared/components/input/InputRange'
import { toast } from 'react-hot-toast'
import SubmitButton from 'shared/components/button/SubmitButton'

const schema = object().shape({
  minWidth: number().default(1),
  minHeight: number().default(1),
  maxWidth: number().default(4),
  maxHeight: number().default(4),
})

export const PluginSizeForm = ({
  query,
  initial,
}: FormProps<typeof schema>) => {
  const onSuccess = () => {
    toast.success('The plugin size has been updated successfully.')
  }

  const onError = ({ message }: { message?: string }) => {
    toast.error(
      `There has been an error while updating the plugin size. ${
        !!message && `(${message})`
      }`,
    )
  }
  return (
    <UncontrolledForm
      {...{ schema, query, initial, onSuccess, onError }}
      className="flex flex-col"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <InputRange
          name="minWidth"
          label="Minimum width"
          className="mt-2"
          min={1}
          max={4}
        />
        <InputRange
          name="maxWidth"
          label="Maximum width"
          className="mt-2"
          min={1}
          max={4}
        />
        <InputRange
          name="minHeight"
          label="Minimum height"
          className="mt-2"
          min={1}
          max={4}
        />
        <InputRange
          name="maxHeight"
          label="Maximum height"
          className="mt-2"
          min={1}
          max={4}
        />
      </div>
      <SubmitButton className="ml-auto mt-4" />
    </UncontrolledForm>
  )
}
