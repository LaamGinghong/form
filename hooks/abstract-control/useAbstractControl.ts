import type { AbstractControl, UseAbstractControlOptions } from './types'
import { AbstractControlType } from './types'
import { useMemo, useRef, useState } from 'react'
import type {
  AsyncValidator,
  ValidateErrors,
  ValidateStatus,
  Validator,
} from '../../validators'
import { toAsyncValidator, toValidator } from '../../validators'
import { FormControl } from '../form-control'
import { isArray, isNil } from 'lodash-es'

function useAbstractControl({
  getValue,
  value,
  controls,
  getControls,
  defaultDisabled = false,
  defaultTrigger = 'onChange',
  setValue,
  type,
  initialValue,
  validators,
  asyncValidators,
}: UseAbstractControlOptions): AbstractControl {
  const [status, setStatus] = useState<ValidateStatus>()
  const [errors, setErrors] = useState<ValidateErrors>()
  // update by form item changed
  const [blurred, setBlurred] = useState(false)
  // update by form item changed
  const [dirty, setDirty] = useState(false)
  const [disabled, setDisabled] = useState(defaultDisabled)
  const [trigger, setTrigger] = useState(defaultTrigger)

  const abstractControl = useMemo<AbstractControl>(
    () => ({
      type,
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
      markAsUnDirty,
      markAsBlurred,
      markAsUnBlurred,
      disable,
      enable,
      getAllValue,
      getValidValue,
      setValue,
    }),
    [value, controls, status, errors, blurred, dirty, disabled, trigger],
  )

  const validator = useRef<Validator | undefined>(
    (() => {
      if (type !== AbstractControlType.control) {
        return undefined
      }
      return toValidator(validators)
    })(),
  )

  const asyncValidator = useRef<AsyncValidator | undefined>(
    (() => {
      if (type !== AbstractControlType.control) {
        return undefined
      }
      return toAsyncValidator(asyncValidators)
    })(),
  )

  async function validate(): Promise<ValidateErrors | undefined> {
    if (type !== AbstractControlType.control) {
      const errors = await Promise.all(
        getControls().map(([, control]) => control.validate()),
      )
      if (errors.every(Boolean)) {
        return undefined
      }
      const keys = Object.keys(getControls())
      return keys.reduce<ValidateErrors>((errs, key, index) => {
        errs[key] = errors[index]!
        return errs
      }, {})
    }
    let errors = validator.current?.(getValue(), abstractControl)
    if (isNil(errors) && asyncValidator.current) {
      setStatus('validating')
      errors = await asyncValidator.current(getValue(), abstractControl)
    }
    return errors
  }

  function reset(): void {
    if (type === AbstractControlType.control) {
      setValue(initialValue, { dirty: false })
      return
    }
    forEachControls((control) => {
      control.reset()
    })
  }

  function clear(): void {
    if (type === AbstractControlType.control) {
      setValue(undefined)
      return
    }
    forEachControls((control) => {
      control.clear()
    })
  }

  function setValidator(
    newValidators: Validator | Validator[] | undefined,
  ): void {
    if (type === AbstractControlType.control) {
      validator.current = toValidator(newValidators)
      return
    }
    forEachControls((control) => {
      control.setValidator(newValidators)
    })
  }

  function setAsyncValidator(
    newValidators: AsyncValidator | AsyncValidator[] | undefined,
  ): void {
    if (type === AbstractControlType.control) {
      asyncValidator.current = toAsyncValidator(newValidators)
      return
    }
    forEachControls((control) => {
      control.setAsyncValidator(newValidators)
    })
  }

  function patchValidator(newValidator: Validator | Validator[]): void {
    if (type !== AbstractControlType.control) {
      forEachControls((control) => control.patchValidator(newValidator))
      return
    }
    const cur: Validator[] = isNil(validator.current) ? [] : [validator.current]
    const newValidators: Validator[] = isArray(newValidator)
      ? newValidator
      : [newValidator]
    validator.current = toValidator([...cur, ...newValidators])
  }

  function patchAsyncValidator(
    newValidator: AsyncValidator | AsyncValidator[],
  ): void {
    if (type !== AbstractControlType.control) {
      forEachControls((control) => control.patchAsyncValidator(newValidator))
      return
    }
    const cur: AsyncValidator[] = isNil(asyncValidator.current)
      ? []
      : [asyncValidator.current]
    const newValidators: AsyncValidator[] = isArray(newValidator)
      ? newValidator
      : [newValidator]
    asyncValidator.current = toAsyncValidator([...cur, ...newValidators])
  }

  function markAsDirty(): void {
    markDirty(true)
  }

  function markAsUnDirty(): void {
    markDirty(false)
  }

  function markAsBlurred(): void {
    markBlurred(true)
  }

  function markAsUnBlurred(): void {
    markBlurred(false)
  }

  function disable(): void {
    markDisabled(true)
  }

  function enable(): void {
    markDisabled(false)
  }

  function getValidValue(): any {
    const value: any = {}
    forEachControls((control, key) => {
      if (!control.disabled) {
        value[key] = control.getAllValue()
      }
    })
    return value
  }

  function getAllValue(): any {
    return getValue()
  }

  /** @private */
  function forEachControls(
    cb: (control: FormControl<any, any>, key: string) => void,
  ): void {
    getControls().forEach(([key, control]) => {
      cb(control, key)
    })
  }

  /** @private */
  function markDirty(dirty: boolean): void {
    if (type === AbstractControlType.control) {
      setDirty(dirty)
      return
    }
    forEachControls((control) => {
      dirty ? control.markAsDirty() : control.markAsUnDirty()
    })
  }

  /** @private */
  function markBlurred(blurred: boolean): void {
    if (type === AbstractControlType.control) {
      setBlurred(blurred)
      return
    }
    forEachControls((control) => {
      blurred ? control.markAsBlurred() : control.markAsUnBlurred()
    })
  }

  /** @private */
  function markDisabled(disabled: boolean): void {
    if (type === AbstractControlType.control) {
      setDisabled(disabled)
      return
    }
    forEachControls((control) => {
      disabled ? control.disable() : control.enable()
    })
  }

  return abstractControl
}

export default useAbstractControl
