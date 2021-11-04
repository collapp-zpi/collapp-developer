import { number, object } from 'yup'
import useApiForm, { FormProps } from 'shared/hooks/useApiForm'
import {
  InputRangeFrame,
  PureInputRange,
} from 'shared/components/input/InputRange'
import { toast } from 'react-hot-toast'
import SubmitButton from 'shared/components/button/SubmitButton'
import { usePluginContext } from 'includes/plugins/components/PluginContext'
import { useState } from 'react'
import Form, { useApiRequest } from 'shared/components/form/Form'
import { useController } from 'react-hook-form'
import { ErrorMessage } from '@hookform/error-message'
import { useSWRConfig } from 'swr'
import { updatePlugin } from 'includes/plugins/endpoints'
import { generateKey } from 'shared/utils/object'

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
  initial,
}: Omit<FormProps<typeof schema>, 'query'>) => {
  const { id } = usePluginContext()
  const { mutate } = useSWRConfig()

  const apiForm = useApiForm({
    query: updatePlugin(id),
    schema,
    initial,
    onSuccess: (_, methods) => {
      toast.success('The plugin size has been updated successfully.')
      mutate(generateKey('plugin', id)).then((data) => {
        const { minWidth, maxWidth, minHeight, maxHeight } = data
        methods.reset({ minWidth, maxWidth, minHeight, maxHeight })
      })
    },
    onError: ({ message }) => {
      toast.error(
        `There has been an error while updating the plugin size. ${
          !!message && `(${message})`
        }`,
      )
    },
  })

  return (
    <Form {...apiForm} className="flex flex-col">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Inputs />
      </div>
      <SubmitButton className="ml-auto mt-4" />
    </Form>
  )
}

const Inputs = () => {
  const { isPending } = usePluginContext()
  const { isLoading } = useApiRequest()

  const minWidth = useController({ name: 'minWidth' })
  const maxWidth = useController({ name: 'maxWidth' })

  const minHeight = useController({ name: 'minHeight' })
  const maxHeight = useController({ name: 'maxHeight' })

  const [width, setWidth] = useState([
    minWidth.field.value ?? 1,
    maxWidth.field.value ?? 4,
  ])
  const [height, setHeight] = useState([
    minHeight.field.value ?? 1,
    maxHeight.field.value ?? 4,
  ])

  const disabled = isPending || isLoading

  return (
    <>
      <InputRangeFrame
        className="mt-2"
        label="Width"
        display={width[0] === width[1] ? width[0] : `${width[0]} - ${width[1]}`}
      >
        <PureInputRange
          values={width}
          onChange={setWidth}
          onFinalChange={([min, max]) => {
            minWidth.field.onChange(min)
            maxWidth.field.onChange(max)
          }}
          min={1}
          max={4}
          disabled={disabled}
        />
        <div className="text-red-400 ml-1 mt-0.5 text-sm">
          <ErrorMessage name="minWidth" />
          <ErrorMessage name="maxWidth" />
        </div>
      </InputRangeFrame>
      <InputRangeFrame
        className="mt-2"
        label="Height"
        display={
          height[0] === height[1] ? height[0] : `${height[0]} - ${height[1]}`
        }
      >
        <PureInputRange
          values={height}
          onChange={setHeight}
          onFinalChange={([min, max]) => {
            minHeight.field.onChange(min)
            maxHeight.field.onChange(max)
          }}
          min={1}
          max={4}
          disabled={disabled}
        />
        <div className="text-red-400 ml-1 mt-0.5 text-sm">
          <ErrorMessage name="minHeight" />
          <ErrorMessage name="maxHeight" />
        </div>
      </InputRangeFrame>
    </>
  )
}
