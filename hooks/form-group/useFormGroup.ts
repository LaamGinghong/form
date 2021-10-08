import type { ControlsGroup, FormGroup, FormGroupConfig } from './types'
import { useMemo, useState } from 'react'
import type {
  AsyncValidator,
  ValidateTrigger,
  Validator,
} from '../../validators'
import { AbstractControlType, useAbstractControl } from '../abstract-control'
import type { FormControl } from '../form-control'
import { isArray } from 'lodash-es'

function useFormGroup<T extends Record<string, any> = Record<string, any>>(
  config: FormGroupConfig<T>,
  defaultTrigger: ValidateTrigger = 'onChange',
): FormGroup<T> {
  const [controls, setControls] = useState({} as ControlsGroup<T>)

  const abstractControl = useAbstractControl({
    type: AbstractControlType.group,
    controls,
    defaultTrigger,
    setValue,
    getValue,
    getControls,
  })

  function getInitialValue(): T {
    return Object.entries(config).reduce<T>((value, [key, current]) => {
      let val: any
      if (isArray(current)) {
        val = current[0]
      } else {
        val = current
      }
      ;(value as any)[key] = val
      return value
    }, {} as T)
  }

  function getValidators(): Record<
    keyof T,
    {
      validators: Validator | Validator[] | undefined
      asyncValidators: AsyncValidator | AsyncValidator[] | undefined
    }
  > {
    return Object.entries(config).reduce<ReturnType<typeof getValidators>>(
      (config, [key, current]) => {
        const options: {
          validators: Validator | Validator[] | undefined
          asyncValidators: AsyncValidator | AsyncValidator[] | undefined
        } = {
          validators: undefined,
          asyncValidators: undefined,
        }
        if (isArray(current)) {
          options.validators = current[1]
          options.asyncValidators = current[2]
        }
        ;(config as any)[key] = options
        return config
      },
      {} as ReturnType<typeof getValidators>,
    )
  }

  function getControls(): [string, FormControl<T, any>][] {
    return Object.entries(controls)
  }

  function getValue(): T {
    return Object.entries(controls).reduce<T>((val, [, con]) => {
      const control = con as FormControl<T, any>
      if (!control.disabled) {
        return Object.assign(val, control.getValidValue())
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

  function removeControl<Field extends keyof T>(field: Field): void {
    setControls((prev) => {
      Reflect.deleteProperty(prev, field)
      return Object.assign({}, prev)
    })
  }

  return useMemo(
    () => ({
      ...abstractControl,
      controls,
      patchValue,
      patchControl,
      removeControl,
      getInitialValue,
      getValidators,
    }),
    [abstractControl, controls],
  )
}

export default useFormGroup
