import { useController } from 'react-hook-form'
import { ComponentProps } from 'react'
import { useApiRequest } from '../form/Form'
import classNames from 'classnames'
import styled from 'styled-components'
import { InputFrame, InputGeneric } from './InputFrame'
import { RequestState } from '../../hooks/useRequest'

type InputTextProps = InputGeneric & ComponentProps<'input'>

const InputLabel = styled.div`
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  pointer-events: none;
  transform-origin: left top;
  transition: transform 0.2s ease;

  input:not(:placeholder-shown) + &,
  input:focus + & {
    transform: scale(0.75) translateY(-0.5em);
  }
`

export const InputText = ({
  name,
  label,
  innerClassName,
  className,
  disabled,
  icon,
  ...props
}: InputTextProps) => {
  const {
    field: { ref, ...field },
    fieldState: { invalid },
  } = useController({ name })
  const { status } = useApiRequest()

  return (
    <InputFrame {...{ name, className, icon }} isError={invalid}>
      <input
        ref={ref}
        {...field}
        {...props}
        value={field?.value ?? props?.value ?? ''}
        className={classNames(
          'w-full outline-none px-4 pb-1 pt-5 text-gray-500',
          innerClassName,
        )}
        placeholder=" "
        disabled={status === RequestState.Loading || disabled}
      />
      <InputLabel className="ml-4 my-3 opacity-70">{label}</InputLabel>
    </InputFrame>
  )
}
