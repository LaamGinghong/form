import type { FormControl, FormControlParams } from './types'
import { ControlType } from '../types'
import type { AbstractControl } from '../types'
import { MutableRefObject, useEffect, useMemo, useRef, useState } from 'react'
import type {
  AsyncValidator,
  ValidateErrors,
  ValidateStatus,
  ValidateTrigger,
  Validator,
} from '../../validators'
import { isOptions, toAsyncValidator, toValidator } from '../../validators'
import { isArray, isNil } from 'lodash-es'

function useFormControl<T extends Record<string, never>, K extends keyof T>({
  initialValue,
  // field, TODO
  validatorOrOptions,
  asyncValidators,
}: FormControlParams<T, K>): FormControl<T, K> {
  const TYPE = ControlType.control

  const [value, setValue] = useState<T[K] | undefined>(initialValue)
  const [status, setStatus] = useState<ValidateStatus>()
  const [errors, setErrors] = useState<ValidateErrors>()
  const [dirty, setDirty] = useState(false)
  const [blurred, setBlurred] = useState(false)
  const [disabled, setDisabled] = useState<boolean>(() => {
    if (isOptions(validatorOrOptions)) {
      return !!validatorOrOptions.disabled
    }
    return false
  })
  const [parent, setParent] = useState<AbstractControl>()
  const [root, setRoot] = useState<AbstractControl>()
  const [trigger, setTrigger] = useState<ValidateTrigger>(() => {
    let trigger: ValidateTrigger = 'onChange'
    if (isOptions(validatorOrOptions)) {
      trigger = validatorOrOptions.trigger ?? trigger
    }
    return trigger
  })

  const validator = useRef<Validator | undefined>(
    (() => {
      if (isOptions(validatorOrOptions)) {
        return toValidator(validatorOrOptions.validators)
      }
      return toValidator(validatorOrOptions)
    })(),
  )
  const asyncValidator = useRef<AsyncValidator | undefined>(
    (() => {
      if (isOptions(validatorOrOptions)) {
        return toAsyncValidator(validatorOrOptions.asyncValidators)
      }
      return toAsyncValidator(asyncValidators)
    })(),
  )

  const instance = useMemo<FormControl<T, K>>(
    () => ({
      TYPE,
      value,
      status,
      errors,
      dirty,
      blurred,
      disabled,
      parent,
      root,
      trigger,
      validate,
      setValue: handleSetValue,
      reset,
      clear,
      setParent,
      setErrors,
      setTrigger,
      setValidator,
      setAsyncValidator,
      patchValidator,
      patchAsyncValidator,
      markAsDirty,
      markAsBlurred,
      disable,
      enable,
    }),
    [value, status, errors, dirty, blurred, disabled, parent, root, trigger],
  )

  useEffect(() => {
    if (!parent) {
      return
    }
    let root: AbstractControl = instance
    while (root.parent) {
      root = root.parent
    }
    setRoot(root)
  }, [parent])

  async function validate(): Promise<ValidateErrors | undefined> {
    let errors = validator.current?.(value, instance)
    if (isNil(errors) && asyncValidator.current) {
      setStatus('validating')
      errors = await asyncValidator.current(value, instance)
    }
    return errors
  }

  function handleSetValue(
    value: T[K] | (() => T[K] | undefined) | undefined,
    options?: { dirty?: boolean },
  ) {
    setValue(value)
    if (options) {
      setDirty((prevState) => options.dirty ?? prevState)
    }
  }

  function reset(): void {
    handleSetValue(initialValue, { dirty: false })
    setBlurred(false)
  }

  function clear(): void {
    handleSetValue(undefined)
  }

  function setValidator(
    newValidator: Validator | Validator[] | undefined,
  ): void {
    validator.current = toValidator(newValidator)
  }

  function setAsyncValidator(
    newValidator: AsyncValidator | AsyncValidator[] | undefined,
  ): void {
    asyncValidator.current = toAsyncValidator(newValidator)
  }

  function patchValidator(newValidator: Validator | Validator[]): void {
    patchValidators(newValidator, validator)
  }

  function patchAsyncValidator(
    newValidator: AsyncValidator | AsyncValidator[],
  ): void {
    patchValidators(newValidator, asyncValidator)
  }

  function markAsDirty(): void {
    if (dirty) {
      return
    }
    setDirty(true)
    parent?.markAsDirty()
  }

  function markAsBlurred(): void {
    if (blurred) {
      return
    }
    setBlurred(true)
    parent?.markAsBlurred()
  }

  function disable(): void {
    setDisabled(true)
    // TODO parent.setControl
  }

  function enable(): void {
    setDisabled(false)
    // TODO parent.setControl
  }

  /** @internal */
  function patchValidators(
    newValidator: Validator | Validator[],
    validator: MutableRefObject<Validator | undefined>,
  ): void
  function patchValidators(
    newValidator: AsyncValidator | AsyncValidator[],
    asyncValidator: MutableRefObject<AsyncValidator | undefined>,
  ): void
  function patchValidators(
    newValidator: Validator | Validator[] | AsyncValidator | AsyncValidator[],
    validator:
      | MutableRefObject<Validator | undefined>
      | MutableRefObject<AsyncValidator | undefined>,
  ): void {
    const validators: any[] = isNil(validator.current)
      ? []
      : [validator.current]
    if (isArray(newValidator)) {
      validators.push(...newValidator)
    } else {
      validators.push(newValidator)
    }
    validator.current = toValidator(validators)
  }

  return instance
}

export default useFormControl
