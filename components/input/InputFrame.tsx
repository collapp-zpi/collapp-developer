import { ErrorMessage } from '@hookform/error-message'
import { IconType } from 'react-icons'
import { ReactNode } from 'react'

export interface InputGeneric {
  name: string
  label?: string
  innerClassName?: string
  icon?: IconType
}

interface InputFrameProps {
  name: string
  className?: string
  icon?: IconType
  children: ReactNode
}

export const InputFrame = ({
  name,
  className,
  icon: Icon,
  children,
}: InputFrameProps) => (
  <div className={className}>
    <label>
      <div className="border-gray-200 focus-within:border-blue-400 focus-within:text-blue-500 transition-all border-2 bg-white rounded-lg flex overflow-hidden">
        {!!Icon && (
          <div className="flex justify-center p-3 opacity-70 -mr-4 z-10">
            <Icon size="1.3em" />
          </div>
        )}
        <div className="relative flex-grow flex">{children}</div>
      </div>
      <div className="text-red-400 ml-1 mt-0.5 text-sm">
        <ErrorMessage name={name} />
      </div>
    </label>
  </div>
)
