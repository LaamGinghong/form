import { useMemo, useRef, useState } from 'react'
import { isNil } from 'lodash-es'
import { useUpdateEffect } from 'ahooks'
import type { FormControl, FormControlParams } from './types'
import type {
  AsyncValidator,
  ValidateErrors,
  ValidateStatus,
  ValidateTrigger,
  Validator,
} from '../../validate'
import { isOptions, toAsyncValidator, toValidator } from '../../validate'

function useFormControl<T = any>({
  validatorOrOptions,
  asyncValidator,
  initialValue,
}: FormControlParams<T>): FormControl<T> {
  const [value, setValue] = useState<T | undefined>(initialValue)
  const [status, setStatus] = useState<ValidateStatus>()
  const [errors, setErrors] = useState<ValidateErrors>()
  const [blurred, setBlurred] = useState(false)
  const [dirty, setDirty] = useState(false)
  const [trigger, setTrigger] = useState<ValidateTrigger>(() => {
    let trigger: ValidateTrigger = 'onChange'
    if (isOptions(validatorOrOptions)) {
      trigger = validatorOrOptions.trigger ?? trigger
    }

    return trigger
  })

  const validators = useRef<Validator | undefined>(
    (() => {
      if (isOptions(validatorOrOptions)) {
        return toValidator(validatorOrOptions.validators)
      }

      return toValidator(validatorOrOptions)
    })(),
  )

  const asyncValidators = useRef<AsyncValidator | undefined>(
    (() => {
      if (isOptions(validatorOrOptions)) {
        return toAsyncValidator(validatorOrOptions.asyncValidators)
      }

      return toAsyncValidator(asyncValidator)
    })(),
  )

  const instance = useMemo<FormControl<T>>(
    () => ({
      value,
      status,
      errors,
      blurred,
      dirty,
      trigger,
      validate,
      reset,
      clear,
      setValue: handleSetValue,
      setValidator,
      setAsyncValidator,
      setErrors,
      setTrigger,
      markAsDirty,
      markAsBlurred,
    }),
    [value, status, errors, blurred, dirty, trigger],
  )

  useUpdateEffect(() => {
    if (trigger !== 'onChange') {
      return
    }

    validate()
  }, [value, trigger])

  useUpdateEffect(() => {
    setStatus(errors ? 'invalid' : 'valid')
  }, [errors])

  async function validate(): Promise<ValidateErrors | undefined> {
    let errors: ValidateErrors | undefined
    errors = validators.current?.(value)
    if (isNil(errors) && asyncValidators.current) {
      setStatus('validating')
      errors = await asyncValidators.current(value)
    }

    setErrors(errors)
    return errors
  }

  function reset(): void {
    handleSetValue(initialValue, { dirty: false })
    setBlurred(false)
  }

  function clear(): void {
    handleSetValue(undefined)
  }

  function handleSetValue(
    value: T | (() => T) | undefined,
    options?: { dirty?: boolean },
  ): void {
    setValue(value)
    if (options) {
      setDirty((prevState) => options.dirty ?? prevState)
    }
  }

  function setValidator(validator: Validator | Validator[] | undefined): void {
    validators.current = toValidator(validator)
  }

  function setAsyncValidator(
    validator: AsyncValidator | AsyncValidator[] | undefined,
  ): void {
    asyncValidators.current = toAsyncValidator(validator)
  }

  function markAsDirty(): void {
    setDirty(true)
  }

  function markAsBlurred(): void {
    setBlurred(true)
  }

  return instance
}

export default useFormControl
