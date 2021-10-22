import { useController } from 'react-hook-form'
import { ComponentProps, useMemo } from 'react'
import { useApiRequest } from '../form/Form'
import styled from 'styled-components'
import { InputFrame, InputGeneric } from './InputFrame'
import { RequestState } from '../../hooks/useRequest'
import Select, { ContainerProps, components, InputProps } from 'react-select'
import classNames from 'classnames'

type InputSelectProps<T> = InputGeneric &
  ComponentProps<'input'> & {
    options: T[]
  }

const InputLabel = styled.div`
  position: absolute;
  left: -1rem;
  top: -1.25rem;
  width: 100%;
  pointer-events: none;
  transform-origin: left top;
  transition: transform 0.2s ease;

  input:not(:placeholder-shown) + &,
  input:focus + & {
    transform: scale(0.75) translateY(-0.5em);
  }
`

const styles = {
  control: () => ({
    color: 'inherit',
    paddingBottom: '0.25rem',
    paddingTop: '1.25rem',
    paddingLeft: '1rem',
    paddingRight: '1rem',
    display: 'flex',
    alignItems: 'center',
    // justifyContent: 'space-between',
  }),
  valueContainer: (provided) => ({
    ...provided,
    padding: 0,
  }),
  indicatorsContainer: (provided) => ({
    ...provided,
    position: 'absolute',
    right: 0,
    top: '0.45rem',
  }),
  input: (provided) => ({
    ...provided,
    margin: 0,
    padding: 0,
  }),
}

const CustomInput = (label: string) =>
  function Input(props: InputProps) {
    return (
      <>
        <components.Input {...props} placeholder=" " />
        <InputLabel className="ml-4 my-3 opacity-70">{label}</InputLabel>
      </>
    )
  }

export const InputSelect = <T extends { value: string; label: string }>({
  name,
  label,
  innerClassName,
  className,
  disabled,
  icon,
  options,
  ...props
}: InputSelectProps<T>) => {
  const {
    field: { ref, value, onChange, ...field },
    fieldState: { invalid },
  } = useController({ name })
  const { status } = useApiRequest()

  const Input = useMemo(() => CustomInput(label as string), [label])

  return (
    <InputFrame {...{ name, className, icon }} isError={invalid}>
      {/*<input*/}
      {/*  ref={ref}*/}
      {/*  {...field}*/}
      {/*  {...props}*/}
      {/*  value={field?.value ?? props?.value ?? ''}*/}
      {/*  className={classNames(*/}
      {/*    'w-full outline-none px-4 pb-1 pt-5 text-gray-500',*/}
      {/*    innerClassName,*/}
      {/*  )}*/}
      {/*  placeholder=" "*/}
      {/*  disabled={status === RequestState.Loading || disabled}*/}
      {/*/>*/}
      <Select
        ref={ref}
        {...field}
        value={
          value === null ? null : options.find((item) => item.value === value)
        }
        onChange={(data) => onChange(data?.value ?? null)}
        isDisabled={status === RequestState.Loading || disabled}
        isClearable
        placeholder=" "
        options={options}
        styles={styles}
        components={{ Input }}
        className={classNames(
          // 'w-full outline-none px-4 pb-1 pt-5 text-gray-500',
          'w-full outline-none text-gray-500',
          innerClassName,
        )}
      />
    </InputFrame>
  )
}
