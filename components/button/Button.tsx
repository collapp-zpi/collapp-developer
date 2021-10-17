import { ComponentProps } from 'react'
import classNames from 'classnames'

const BUTTON_COLORS = {
  blue: 'bg-blue-500 hover:bg-blue-600 focus:bg-blue-600 text-white shadow-md',
  light: 'bg-gray-200 hover:bg-gray-300 focus:bg-gray-300',
}

export interface ButtonProps extends ComponentProps<'button'> {
  color?: keyof typeof BUTTON_COLORS
}

const Button = ({
  color = 'blue',
  type = 'button',
  children,
  className,
  ...props
}: ButtonProps) => (
  <button
    className={classNames(
      'py-2 px-6 font-bold rounded-lg transition-colors flex items-center',
      BUTTON_COLORS[color],
      className,
    )}
    type={type}
    {...props}
  >
    {children}
  </button>
)

export default Button
