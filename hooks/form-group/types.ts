import type {
  AsyncValidator,
  Validator,
  ValidatorOptions,
} from '../../validators'
import type { AbstractControl } from '../abstract-control'
import type { FormControl } from '../form-control'

export type ControlsGroup<T extends Record<string, any>> = {
  [K in keyof T]: FormControl<T, K>
}

export type FormGroupConfig<T extends Record<string, any>> = {
  [K in keyof T]: FormGroupConfigItem<T[K]>
}

export type FormGroupConfigItem<V> =
  | V
  | [V]
  | [V, Validator | Validator[], (AsyncValidator | AsyncValidator[])?]
  | [V, ValidatorOptions]

export interface FormGroup<T extends Record<string, any>>
  extends AbstractControl {
  /**
   * 子表单控制器
   */
  controls: ControlsGroup<T>
  /**
   * 获取当前合法的 value
   *
   * 被禁用和不合法的字段会被过滤
   *
   */
  getValidValue: () => Partial<T>
  /* 获取当前所有 value */
  getAllValue: () => T
  /* 替换表单的值 */
  setValue: (value: T) => void
  /* 设置表单项的值 */
  patchValue: <Path extends string>(
    field: Path,
    value: LodashGet<T, Path>,
    options?: { dirty?: boolean },
  ) => void
  /** 添加子表单控制器 */
  patchControl: <Field extends keyof T>(
    field: Field,
    control: FormControl<T, Field>,
  ) => void
}
