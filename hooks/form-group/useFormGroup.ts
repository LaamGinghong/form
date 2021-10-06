import type { FormGroup, FormGroupConfig, UseFormGroupOptions } from './types'
import { useMemo, useState } from 'react'
import type {
  ValidateErrors,
  ValidateStatus,
  ValidateTrigger,
} from '../../validators'
import { isNil } from 'lodash-es'

const DEFAULT_OPTIONS: Required<UseFormGroupOptions> = {
  disabled: false,
  trigger: 'onChange',
}

function useFormGroup<T extends Record<string, any> = Record<string, any>>(
  config: FormGroupConfig<T>,
  options: UseFormGroupOptions = DEFAULT_OPTIONS,
): FormGroup<T> {
  const [status, setStatus] = useState<ValidateStatus>()
  const [errors, setErrors] = useState<ValidateErrors>()
  // update by form item changed
  const [blurred, setBlurred] = useState(false)
  // update by form item changed
  const [dirty, setDirty] = useState(false)
  const [disabled, setDisabled] = useState(!!options.disabled)
  const [trigger, setTrigger] = useState<ValidateTrigger>(() => {
    if (isNil(options.trigger)) {
      return DEFAULT_OPTIONS.trigger
    }
    return options.trigger
  })

  const formGroup = useMemo<FormGroup<T>>(
    () => ({
      status,
      errors,
      blurred,
      dirty,
      disabled,
      trigger,
      validate,
      reset,
      clear,
      setTrigger,
      setValidator,
      setAsyncValidator,
      patchValidator,
      patchAsyncValidator,
      markAsDirty,
      markAsBlurred,
      disable,
      enable,
      getValidValue,
      getAllValue,
      setValue,
      patchValue,
    }),
    [status, errors, blurred, dirty, disabled, trigger],
  )

  function validate(): Promise<ValidateErrors | undefined> {}

  function reset(): void {}

  function clear(): void {}

  function setValidator(): void {}

  function setAsyncValidator(): void {}

  function patchValidator(): void {}

  function patchAsyncValidator(): void {}

  function markAsDirty(): void {}

  function markAsBlurred(): void {}

  function disable(): void {}

  function enable(): void {}

  function getValidValue(): Partial<T> {}

  function getAllValue(): T {}

  function setValue(): void {}

  function patchValue<Path extends string>(
    path: Path,
    value: LodashGet<T, Path>,
  ): void {}

  return formGroup
}

export default useFormGroup
