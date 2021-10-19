import classNames from 'classnames'
import React, { ReactNode } from 'react'

const Modal = ({
  visible,
  isVisible,
  children,
}: {
  visible: boolean
  isVisible: (visible: boolean) => void
  children: ReactNode
}) => (
  <div
    className={classNames(
      'fixed left-0 top-0 w-full h-full z-50 flex items-center justify-center transition-opacity backdrop-filter backdrop-blur',
      !visible && 'opacity-0 pointer-events-none',
    )}
  >
    <div
      className="absolute left-0 top-0 w-full h-full bg-black opacity-50"
      onClick={() => isVisible(false)}
    />
    <div className="bg-white p-4 z-10 rounded-xl shadow-lg">{children}</div>
  </div>
)

export default Modal
