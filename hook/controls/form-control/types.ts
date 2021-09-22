import type { AbstractControl, ControlParams } from '../types'

export interface FormControlParams<
  T extends Record<string, unknown>,
  K extends keyof T
> extends ControlParams {
  /**
   * 表单项的初始值
   */
  initialValue?: T[K] | (() => T[K] | undefined) | undefined
  /**
   * 当前表单项的字段
   */
  field: K
}

export interface FormControl<
  T extends Record<string, unknown>,
  K extends keyof T
> extends AbstractControl {
  /* 当前表单项的值 */
  value: T[K] | undefined

  /**
   * 手动修改当前表单项的值
   * @param value
   * @param options
   */
  setValue: (
    value: T[K] | (() => T[K] | undefined) | undefined,
    options?: { dirty?: boolean },
  ) => void
}
