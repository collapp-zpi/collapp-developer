import { useController } from 'react-hook-form'
import { ErrorMessage } from '@hookform/error-message'
import { ComponentProps } from 'react'

interface InputTextProps extends ComponentProps<'input'> {
  name: string
  label?: string
}

export const InputText = ({ name, label, ...props }: InputTextProps) => {
  const {
    field: { ref, ...field },
  } = useController({ name })

  return (
    <div>
      <label>
        <div>{label}</div>
        <input
          ref={ref}
          {...field}
          {...props}
          value={field?.value ?? props?.value ?? ''}
        />
        <ErrorMessage name={name} />
      </label>
    </div>
  )
}
