import { number, object } from 'yup'
import { UncontrolledForm } from 'shared/components/form/UncontrolledForm'
import { FormProps } from 'shared/hooks/useApiForm'
import { InputRange } from 'shared/components/input/InputRange'
import { toast } from 'react-hot-toast'
import SubmitButton from 'shared/components/button/SubmitButton'
import { usePluginContext } from 'includes/plugins/components/PluginContext'

const schema = object().shape({
  minWidth: number()
    .default(1)
    .when(['maxWidth'], (maxWidth: number, schema) =>
      schema.max(maxWidth, `Min. width can't be larger than max. width`),
    ),
  minHeight: number()
    .default(1)
    .when(['maxHeight'], (maxHeight: number, schema) =>
      schema.max(maxHeight, `Min. height can't be larger than max. height`),
    ),
  maxWidth: number().default(4),
  maxHeight: number().default(4),
})

export const PluginSizeForm = ({
  query,
  initial,
}: FormProps<typeof schema>) => {
  const { isPending } = usePluginContext()
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
          disabled={isPending}
        />
        <InputRange
          name="maxWidth"
          label="Maximum width"
          className="mt-2"
          min={1}
          max={4}
          disabled={isPending}
        />
        <InputRange
          name="minHeight"
          label="Minimum height"
          className="mt-2"
          min={1}
          max={4}
          disabled={isPending}
        />
        <InputRange
          name="maxHeight"
          label="Maximum height"
          className="mt-2"
          min={1}
          max={4}
          disabled={isPending}
        />
      </div>
      <SubmitButton className="ml-auto mt-4" />
    </UncontrolledForm>
  )
}
