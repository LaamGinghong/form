import type { ReactElement, ReactNode } from 'react'
import type { FormItemProps } from './types'
import { FormContext } from '../form'
import { Children, cloneElement, useContext, useMemo } from 'react'
import type { AsyncValidator, Validator } from '../../validators'
import { useFormControl } from '../../hooks'
import classNames from 'classnames'

function Item<
  T extends Record<string, any> = Record<string, any>,
  F extends keyof T = keyof T
>({ label, children, field }: FormItemProps<T, F>): ReactElement | null {
  const { initialValues, configuration } = useContext(FormContext)

  const initialValue = (initialValues as any)[field] as T[F]

  const { validators, asyncValidators } = (configuration as any)[field] as {
    validators: Validator | Validator[] | undefined
    asyncValidators: AsyncValidator | AsyncValidator[] | undefined
  }

  const formControl = useFormControl<T, F>({
    field,
    initialValue,
    validators,
    asyncValidators,
  })

  const statusElement = useMemo<ReactNode>(() => {
    if (!formControl.errors) {
      return null
    }
    return (
      <div
        className={classNames('form-item-status', {
          valid: formControl.status === 'valid',
          invalid: formControl.status === 'invalid',
          validating: formControl.status === 'validating',
        })}
      />
    )
  }, [formControl.errors, formControl.status])

  const handleChange = (event: Event) => {
    console.log(event)
  }

  const formItemElement = useMemo<ReactNode>(() => {
    if (!Children.only(children)) {
      return null
    }
    return cloneElement(children, {
      value: formControl.getAllValue(),
      onChange: handleChange,
    })
  }, [children, formControl.getAllValue()])

  return (
    <div className="form-item">
      <div className="form-item-label">{label}</div>
      <div className="form-item-content">
        {formItemElement}
        {statusElement}
      </div>
    </div>
  )
}

export default Item
