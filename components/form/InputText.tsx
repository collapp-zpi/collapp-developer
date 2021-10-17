import { useController } from 'react-hook-form'
import { ErrorMessage } from '@hookform/error-message'
import { ComponentProps } from 'react'
import { useApiRequest } from './Form'
import { RequestState } from '../../hooks/useRequest'
import classNames from 'classnames'
import { IconType } from 'react-icons'
import styled from 'styled-components'

interface InputTextProps extends ComponentProps<'input'> {
  name: string
  label?: string
  innerClassName?: string
  icon?: IconType
}

const InputLabel = styled.div`
  position: absolute;
  left: 0;
  top: 0;
  height: 100%;
  width: 100%;
  display: flex;
  align-items: center;
  pointer-events: none;
  transform-origin: left top;
  transition: transform 0.2s ease;

  input:not(:placeholder-shown) + &,
  input:focus + & {
    transform: scale(0.75) translateY(-0.4em);
  }
`

export const InputText = ({
  name,
  label,
  innerClassName,
  className,
  disabled,
  icon: Icon,
  ...props
}: InputTextProps) => {
  const {
    field: { ref, ...field },
  } = useController({ name })
  const { status } = useApiRequest()

  return (
    <div className={className}>
      <label>
        <div className="border-gray-200 focus-within:border-blue-400 focus-within:text-blue-500 transition-all border-2 bg-white rounded-lg flex overflow-hidden">
          {!!Icon && (
            <div className="flex items-center justify-center pl-3 opacity-70 -mr-1 z-10">
              <Icon size="1.3em" />
            </div>
          )}
          <div className="relative flex-grow">
            <input
              ref={ref}
              {...field}
              {...props}
              value={field?.value ?? props?.value ?? ''}
              className={classNames(
                'w-full outline-none px-4 pb-0.5 pt-5 text-gray-500',
                innerClassName,
              )}
              placeholder=" "
              disabled={status === RequestState.Loading || disabled}
            />
            <InputLabel className="ml-4 opacity-70">{label}</InputLabel>
          </div>
        </div>
        <div className="text-red-400 ml-1 mt-0.5 text-sm">
          <ErrorMessage name={name} />
        </div>
      </label>
    </div>
  )
}
