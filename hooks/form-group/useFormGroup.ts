import type { ControlsGroup, FormGroup, FormGroupConfig } from './types'
import { useMemo, useState } from 'react'
import type { ValidateTrigger } from '../../validators'
import { AbstractControlType, useAbstractControl } from '../abstract-control'
import type { FormControl } from '../form-control'

function useFormGroup<T extends Record<string, any> = Record<string, any>>(
  config: FormGroupConfig<T>,
  defaultTrigger: ValidateTrigger = 'onChange',
): FormGroup<T> {
  const [controls, setControls] = useState({} as ControlsGroup<T>)
  const abstractControl = useAbstractControl({
    type: AbstractControlType.group,
    defaultTrigger,
    setValue,
    getValue,
    getControls,
  })

  function getControls(): [string, FormControl<T, any>][] {
    return Object.entries(controls)
  }

  function getValue(): T {
    return Object.entries(controls).reduce<T>((val, [key, con]) => {
      const control = con as FormControl<T, any>
      if (!control.disabled) {
        ;(val as any)[key] = control.getValidValue()
      }
      return val
    }, {} as T)
  }

  function setValue(value: T, options?: { dirty?: boolean }): void {
    Object.entries(value).forEach(([key, val]) => {
      ;((controls as any)[key] as FormControl<T, any>).setValue(val, options)
    })
  }

  function patchValue<Path extends string>(
    field: Path,
    value: LodashGet<T, Path>,
    options?: { dirty?: boolean },
  ): void {
    ;((controls as any)[field] as FormControl<T, any>).setValue(value, options)
  }

  function patchControl<Field extends keyof T>(
    field: Field,
    control: FormControl<T, Field>,
  ): void {
    setControls((prev) => Object.assign({}, prev, { [field]: control }))
  }

  return useMemo(
    () => ({ ...abstractControl, controls, patchValue, patchControl }),
    [abstractControl],
  )
}

export default useFormGroup
