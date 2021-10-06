import type { FormControl, UseFormControlOptions } from './types'
import { useState } from 'react'
import { AbstractControlType, useAbstractControl } from '../abstract-control'
import { isNil } from 'lodash-es'

function useFormControl<T extends Record<string, any>, K extends keyof T>({
  field,
}: UseFormControlOptions<T, K>): FormControl<T, K> {
  const [value, updateValue] = useState<T[K] | undefined>()

  const abstractControl = useAbstractControl({
    type: AbstractControlType.control,
    defaultTrigger: 'onChange',
    defaultDisabled: false,
    setValue,
    getValue,
    getControls,
  })

  function getControls(): [string, FormControl<T, K>][] {
    return [[field as string, abstractControl]]
  }

  function getValue(): T[K] | undefined {
    return value
  }

  function setValue(
    newValue: T[K] | (() => T[K] | undefined) | undefined,
    options?: { dirty?: boolean },
  ): void {
    updateValue(newValue)
    if (options && !isNil(options.dirty)) {
      abstractControl.markAsDirty()
    }
  }

  return abstractControl
}

export default useFormControl
