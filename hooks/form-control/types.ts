import type { AbstractControl } from '../abstract-control'
import type { AsyncValidator, Validator } from '../../validators'

export interface UseFormControlOptions<
  T extends Record<string, any>,
  K extends keyof T
> {
  /**
   * 当前表单项的字段
   */
  field: K
  /** 初始值 */
  initialValue: T[K] | (() => T[K] | undefined) | undefined
  /** 表单校验器 */
  validators?: Validator | Validator[]
  /** 异步校验器 */
  asyncValidators?: AsyncValidator | AsyncValidator[]
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
