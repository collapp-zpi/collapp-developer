import { ReactNode, useState } from 'react'
import { Range } from 'react-range'
import { useController } from 'react-hook-form'
import { useApiRequest } from 'shared/components/form/Form'
import { RequestState } from 'shared/hooks/useRequest'
import classNames from 'classnames'
import { ErrorMessage } from '@hookform/error-message'

type Props = {
  name: string
  children?: (value: number) => ReactNode
  min?: number
  max: number
  step?: number
  className?: string
  label?: string
  disabled?: boolean
}

export const InputRange = ({
  name,
  children,
  min = 0,
  max,
  step = 1,
  className,
  label,
  disabled = false,
}: Props) => {
  const {
    field: { value, onChange, ...field },
    // fieldState: { invalid },
  } = useController({ name })
  const { status } = useApiRequest()
  const [innerValue, setInnerValue] = useState(value ?? min)

  return (
    <label className={classNames('block', className)}>
      <div className="flex items-center justify-between">
        {!!label && <h1 className="text-gray-500 mr-4">{label}</h1>}
        <span className="text-gray-400 font-bold">
          {children ? children(innerValue) : innerValue}
        </span>
      </div>
      <div className="w-full px-1">
        <Range
          {...field}
          disabled={status === RequestState.Loading || disabled}
          values={[innerValue]}
          onChange={([value]) => setInnerValue(value)}
          onFinalChange={([value]) => onChange(value)}
          renderTrack={({ props, children }) => (
            <div className="w-full h-9" {...props}>
              <div className="w-full h-1 rounded-full bg-gray-300 absolute top-4" />
              {children}
            </div>
          )}
          renderThumb={({ props }) => (
            <div
              className="h-4 w-4 rounded-full bg-blue-500 shadow focus:outline-none focus:bg-blue-700"
              {...props}
            />
          )}
          {...{ min, max, step }}
        />
      </div>
      <div className="text-red-400 ml-1 mt-0.5 text-sm">
        <ErrorMessage name={name} />
      </div>
    </label>
  )
}
