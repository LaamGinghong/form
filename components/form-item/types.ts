import type { ReactElement, ReactNode } from 'react'

export interface FormItemProps<
  T extends Record<string, any> = Record<string, any>,
  F = keyof T,
> {
  /** key of form group */
  field: F
  /** label of form item */
  label: ReactNode
  /** form item of this control */
  children: ReactElement
}
