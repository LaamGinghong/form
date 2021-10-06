import type { PropsWithChildren, ReactElement } from 'react'
import type { FormProps } from './types'

function Form<T extends Record<string, any> = Record<string, any>>({
  children,
}: PropsWithChildren<FormProps<T>>): ReactElement | null {
  return <form>{children}</form>
}

export default Form
