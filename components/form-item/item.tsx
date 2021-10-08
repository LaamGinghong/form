import type { ChangeEvent, ReactElement, ReactNode } from 'react'
import type { FormItemProps } from './types'
import { FormContext } from '../form'
import { Children, cloneElement, useContext, useMemo } from 'react'
import type { AsyncValidator, Validator } from '../../validators'
import { useFormControl } from '../../hooks'
import classNames from 'classnames'
import { useMount, useUnmount } from 'ahooks'

function Item<
  T extends Record<string, any> = Record<string, any>,
  F extends keyof T = keyof T,
>({ label, children, field }: FormItemProps<T, F>): ReactElement | null {
  const { initialValues, configuration, addControl, removeControl } =
    useContext(FormContext)

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

  const value = useMemo(() => {
    return formControl.getAllValue()
  }, [formControl])

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

  useMount(() => {
    addControl(field as string, formControl)
  })

  useUnmount(() => {
    removeControl(field as string)
  })

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    formControl.setValue(event.target.value as T[F])
  }

  const formItemElement = useMemo<ReactNode>(() => {
    if (!Children.only(children)) {
      return null
    }
    return cloneElement(children, {
      value,
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
