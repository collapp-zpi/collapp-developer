import { forwardRef, ReactNode, useState } from 'react'
import { Range } from 'react-range'
import { useController } from 'react-hook-form'
import { useApiRequest } from 'shared/components/form/Form'
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
  const { isLoading } = useApiRequest()
  const [innerValue, setInnerValue] = useState(value ?? min)

  return (
    <label className={classNames('block', className)}>
      <div className="flex items-center justify-between">
        {!!label && <h1 className="text-gray-500 mr-4">{label}</h1>}
        <span className="text-gray-400 font-bold">
          {children ? children(innerValue) : innerValue}
        </span>
      </div>
      <PureInputRange
        {...field}
        disabled={isLoading || disabled}
        onFinalChange={onChange}
        onChange={setInnerValue}
        value={innerValue}
        {...{ min, max, step }}
      />
      <div className="text-red-400 ml-1 mt-0.5 text-sm">
        <ErrorMessage name={name} />
      </div>
    </label>
  )
}

type PureInputRangeProps = {
  value: number
  onFinalChange?: (value: number) => void
  onChange: (value: number) => void
  min?: number
  max: number
  step?: number
  disabled?: boolean
}

export const PureInputRange = forwardRef<Range, PureInputRangeProps>(
  function InnerPureInput(
    { value, min, max, onChange, onFinalChange, step, disabled, ...props },
    ref,
  ) {
    return (
      <div className={classNames('w-full px-1', disabled && 'opacity-50')}>
        <Range
          {...props}
          ref={ref}
          values={[value]}
          onChange={([value]) => onChange(value)}
          onFinalChange={([value]) => (onFinalChange ?? onChange)(value)}
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
          {...{ min, max, step, disabled }}
        />
      </div>
    )
  },
)
