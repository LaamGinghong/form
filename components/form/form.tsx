import type { FormEvent, PropsWithChildren, ReactElement } from 'react'
import type { FormContextValue, FormProps } from './types'
import { noop } from 'lodash-es'
import { createContext } from 'react'

export const FormContext = createContext<FormContextValue>({
  initialValues: {},
  configuration: {},
})

export function Form<T extends Record<string, any> = Record<string, any>>({
  control,
  onSubmit = noop,
  children,
}: PropsWithChildren<FormProps<T>>): ReactElement | null {
  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault()
    const error = await control.validate()
    if (error) {
      console.log(error)
      return
    }
    onSubmit(control.getValidValue())
  }

  return (
    <FormContext.Provider
      value={{
        initialValues: control.getInitialValue(),
        configuration: control.getValidators(),
      }}
    >
      <form onSubmit={handleSubmit}>{children}</form>
    </FormContext.Provider>
  )
}
