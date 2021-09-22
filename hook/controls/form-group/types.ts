import type {
  AsyncValidator,
  Validator,
  ValidatorOptions,
} from '../../validators'
import type { AbstractControl, ControlParams } from '../types'
import type { FormControl } from '../form-control'

export type FormGroupConfigItem<T> =
  | T
  | [T]
  | [T, Validator]
  | [T, Validator[]]
  | [T, AsyncValidator]
  | [T, AsyncValidator[]]
  | [T, ValidatorOptions]

export type FormGroupConfig<T> = {
  [K in keyof T]: FormGroupConfigItem<T[K]>
}

export type GroupControl<T extends Record<string, unknown>> = {
  [K in keyof T]?: FormControl<T, K>
}

export interface FormGroupParams<T extends Record<string, unknown>>
  extends ControlParams {
  /**
   * 配置表单组信息
   *
   * 如：默认值、校验器
   */
  config: FormGroupConfig<T>
}

export interface FormGroup<T extends Record<string, unknown>>
  extends AbstractControl {
  /**
   * 表单项键值对
   *
   * 如果子表单是 **disabled**，则不会添加到 controls 中
   */
  controls: GroupControl<T>
  /* 替换表单的值 */
  setValue: (value: T) => void
  /* 设置表单项的值 */
  patchValue: <Path extends string>(
    field: Path,
    value: LodashGet<T, Path>,
  ) => void
  /**
   * 获取当前合法的 value
   *
   * 被禁用的字段会被过滤
   */
  getValue: () => Partial<T>
}
