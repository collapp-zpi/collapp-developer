import { ComponentProps } from 'react'
import classNames from 'classnames'

const BUTTON_COLORS = {
  blue: 'bg-blue-500 hover:bg-blue-600 focus:bg-blue-600 text-white shadow-md',
  red: 'bg-red-500 hover:bg-red-600 focus:bg-red-600 text-white shadow-md',
  light: 'bg-gray-800 bg-opacity-5 hover:bg-opacity-20 focus:bg-opacity-20',
  'red-link':
    'bg-red-500 text-red-500 bg-opacity-10 hover:bg-opacity-20 focus:bg-opacity-20',
}

export interface ButtonProps extends ComponentProps<'button'> {
  color?: keyof typeof BUTTON_COLORS
}

const Button = ({
  color = 'blue',
  type = 'button',
  children,
  className,
  disabled,
  ...props
}: ButtonProps) => (
  <button
    className={classNames(
      'py-2 px-6 font-bold rounded-lg transition-colors transition-opacity flex items-center disabled:opacity-50',
      BUTTON_COLORS[color],
      className,
      disabled && 'pointer-events-none',
    )}
    {...{ type, disabled }}
    {...props}
  >
    {children}
  </button>
)

export default Button
