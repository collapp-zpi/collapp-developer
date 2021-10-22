import { useController } from 'react-hook-form'
import { ComponentProps, useState } from 'react'
import { useApiRequest } from '../form/Form'
import styled from 'styled-components'
import { InputFrame, InputGeneric } from './InputFrame'
import { RequestState } from '../../hooks/useRequest'
import Select, { StylesConfig } from 'react-select'
import classNames from 'classnames'

type InputSelectProps<T> = InputGeneric &
  ComponentProps<'input'> & {
    options: T[]
  }

const InputLabel = styled.div<{ $minimized: boolean }>`
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  pointer-events: none;
  transform-origin: left top;
  transition: transform 0.2s ease;
  transform: ${({ $minimized }) =>
    $minimized && 'scale(0.75) translateY(-0.5em)'};

  div:focus-within > div > & {
    transform: scale(0.75) translateY(-0.5em);
  }
`

const styles: StylesConfig = {
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
  const [isPlaceholderVisible, setPlaceholderVisible] = useState(false)
  const { status } = useApiRequest()

  return (
    <InputFrame {...{ name, className, icon }} isError={invalid}>
      <Select
        {...field}
        {...props}
        ref={ref}
        value={
          value === null ? null : options.find((item) => item.value === value)
        }
        onChange={(data) => onChange(data?.value ?? null)}
        isDisabled={status === RequestState.Loading || disabled}
        onInputChange={(data) => setPlaceholderVisible(!!data)}
        isClearable
        placeholder=""
        options={options}
        styles={styles}
        className={classNames(
          // 'w-full outline-none px-4 pb-1 pt-5 text-gray-500',
          'w-full outline-none text-gray-500',
          innerClassName,
        )}
      />
      <InputLabel
        className="ml-4 my-3 opacity-70"
        $minimized={isPlaceholderVisible || value != null}
      >
        {label}
      </InputLabel>
    </InputFrame>
  )
}
