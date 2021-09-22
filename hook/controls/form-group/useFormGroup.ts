import type { FormGroup, FormGroupParams, GroupControl } from './types'
import type { AbstractControl } from '../types'
import { useMemo, useState } from 'react'
import { useImmer } from 'use-immer'
import type {
  ValidateErrors,
  ValidateStatus,
  ValidateTrigger,
} from '../../validators'
import { AsyncValidator, isOptions, Validator } from '../../validators'
import { ControlType } from '../types'
import { get } from 'lodash-es'

function useFormGroup<T extends Record<string, unknown>>({
  config,
  validatorOrOptions,
  asyncValidators,
}: FormGroupParams<T>): FormGroup<T> {
  /** @internal */
  const TYPE = ControlType.group

  const [controls, updateControls] = useImmer<GroupControl<T>>({})
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

  const instance = useMemo<FormGroup<T>>(
    () => ({
      TYPE,
      controls,
      status,
      errors,
      blurred,
      dirty,
      disabled,
      parent,
      root,
      trigger,
      validate,
      reset,
      clear,
      setValue,
      patchValue,
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
      getValue,
      getAllValue,
    }),
    [controls, status, errors, blurred, dirty, disabled, parent, root, trigger],
  )

  async function validate(): Promise<ValidateErrors | undefined> {
    const errors = await Promise.all(
      getControlList().map((control) => control.validate()),
    )
    if (errors.some(Boolean)) {
      return undefined
    }
    const keys = Object.keys(controls)
    return keys.reduce<ValidateErrors>((errs, key, index) => {
      errs[key] = errors[index]!
      return errs
    }, {})
  }

  function reset(): void {
    forEachControls((control) => control.reset())
  }

  function clear(): void {
    forEachControls((control) => control.clear())
  }

  function setValue(value: T): void {
    Object.entries(value).forEach(([key, value]) => {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      patchValue(key, value)
    })
  }

  function patchValue<Path extends string>(
    field: Path,
    value: LodashGet<T, Path>,
  ): void {
    const control = get(controls, field)
    if (!control) {
      return
    }
    control.setValue(value)
  }

  function setValidator(
    newValidator: Validator | Validator[] | undefined,
  ): void {
    forEachControls((control) => control.setValidator(newValidator))
  }

  function setAsyncValidator(
    newValidator: AsyncValidator | AsyncValidator[] | undefined,
  ): void {
    forEachControls((control) => control.setAsyncValidator(newValidator))
  }

  function patchValidator(newValidator: Validator | Validator[]): void {
    forEachControls((control) => control.patchValidator(newValidator))
  }

  function patchAsyncValidator(
    newValidator: AsyncValidator | AsyncValidator[],
  ): void {
    forEachControls((control) => control.patchAsyncValidator(newValidator))
  }

  function markAsDirty(): void {
    forEachControls((control) => control.markAsDirty())
  }

  function markAsBlurred(): void {
    forEachControls((control) => control.markAsBlurred())
  }

  function disable(): void {
    forEachControls((control) => control.disable())
  }

  function enable(): void {
    forEachControls((control) => control.enable())
  }

  function getValue(): Partial<T> {
    return getControlEntries()
      .filter(([, control]) => !control.disabled)
      .reduce<Partial<T>>((obj, [field, control]) => {
        ;(obj as any)[field] = control.getValue()
        return obj
      }, {})
  }

  function getAllValue(): T {
    return getControlEntries().reduce<T>((obj, [field, control]) => {
      ;(obj as any)[field] = control.getAllValue()
      return obj
    }, {} as T)
  }

  /** @internal */
  function getControlEntries(): [string, AbstractControl][] {
    return Object.entries(controls)
  }

  /** @internal */
  function getControlList(): AbstractControl[] {
    return Object.values(controls)
  }

  /** @internal */
  function forEachControls(callback: (control: AbstractControl) => void): void {
    getControlList().forEach((control) => {
      callback(control)
    })
  }

  return instance
}

export default useFormGroup
