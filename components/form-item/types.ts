import type { ReactElement, ReactNode } from 'react'
import type { ValidateMessageGroup } from '../../validators'

export interface FormItemProps<T extends Record<string, any>, F = keyof T> {
  /** key of form group */
  field: F
  /** label of form item */
  label?: ReactNode
  /** error messages */
  messages?: ValidateMessageGroup
  /** form item of this control */
  children: ReactElement
}
