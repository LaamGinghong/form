import type { AbstractControl } from '../abstract-control'

export interface UseFormControlOptions<
  T extends Record<string, any>,
  K extends keyof T,
> {
  /**
   * 当前表单项的字段
   */
  field: K
}

export interface FormControl<T extends Record<string, any>, K extends keyof T>
  extends AbstractControl {
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
