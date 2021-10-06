import type { ReactElement } from 'react'
import type { FormItemProps } from './types'

function Item<T extends Record<string, any>, F = keyof T>({
  label,
  children
}: FormItemProps<T, F>): ReactElement | null {
  return (
    <div className="form-item">
      <div className="form-item-label">{label}</div>
      <div className="form-item-content">{children}</div>
    </div>
  )
}

export default Item
