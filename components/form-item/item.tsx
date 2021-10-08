import type { ChangeEvent, ReactElement, ReactNode } from 'react'
import type { FormItemProps } from './types'
import { FormContext } from '../form'
import { Children, cloneElement, useContext, useMemo, useRef } from 'react'
import type { AsyncValidator, Validator } from '../../validators'
import { useFormControl } from '../../hooks'
import classNames from 'classnames'
import { useMount, useUnmount } from 'ahooks'
import { ValidatorErrorGroup } from '../../validators'
import { isArray, isFunction } from 'lodash-es'

function Item<
  T extends Record<string, any> = Record<string, any>,
  F extends keyof T = keyof T,
>({
  label,
  children,
  field,
  messages,
}: FormItemProps<T, F>): ReactElement | null {
  const validator = useRef(new ValidatorErrorGroup(messages))
  const { initialValues, configuration, trigger, addControl, removeControl } =
    useContext(FormContext)

  const initialValue = (initialValues as any)[field] as T[F]

  const config = (configuration as any)[field] as {
    validators: Validator | Validator[] | undefined
    asyncValidators: AsyncValidator | AsyncValidator[] | undefined
  }

  config.validators = bindFunction(config.validators, validator.current)
  config.asyncValidators = bindFunction(
    config.asyncValidators,
    validator.current,
  )

  const formControl = useFormControl<T, F>({
    field,
    initialValue,
    validators: config.validators,
    asyncValidators: config.asyncValidators,
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
    formControl.setValue(event.target.value as T[F], {
      dirty: trigger === 'onChange',
    })
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

function bindFunction<
  T extends
    | Validator
    | Validator[]
    | AsyncValidator
    | AsyncValidator[]
    | undefined,
>(validators: T, vm: ValidatorErrorGroup): T {
  let result: T
  if (isArray(validators)) {
    result = validators.map((validator) => validator.bind(vm)) as T
  } else if (isFunction(validators)) {
    result = validators.bind(vm) as T
  }
  return result!
}
