import { useController } from 'react-hook-form'
import { ErrorMessage } from '@hookform/error-message'
import { ComponentProps } from 'react'
import styles from './InputText.module.css'

interface InputTextProps extends ComponentProps<'input'> {
  name: string
  label?: string
  outerClassName?: string
}

export const InputText = ({
  name,
  label,
  outerClassName,
  ...props
}: InputTextProps) => {
  const {
    field: { ref, ...field },
  } = useController({ name })

  return (
    <div className={outerClassName}>
      <label>
        <div className="border-gray-200 focus-within:border-blue-400 transition-all border-2 bg-white rounded-lg flex overflow-hidden">
          <div className="relative flex-grow">
            <input
              ref={ref}
              {...field}
              {...props}
              value={field?.value ?? props?.value ?? ''}
              className="w-full outline-none px-4 pb-0.5 pt-5"
              placeholder=" "
            />
            <div className={`ml-4 text-gray-400 ${styles.label}`}>{label}</div>
          </div>
        </div>
        <ErrorMessage name={name} />
      </label>
    </div>
  )
}
