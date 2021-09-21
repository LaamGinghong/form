import type {
  AsyncValidator,
  ValidateErrors,
  ValidateStatus,
  ValidateTrigger,
  Validator,
} from '../../validate'

export interface FormControl<T = any> {
  /**
   * 当前表单项的值
   */
  value: T | undefined
  /**
   * 当前表单项的状态
   */
  status: ValidateStatus | undefined
  /**
   * 当前表单项的错误
   *
   * 无错误时为 **undefined**
   */
  errors: ValidateErrors | undefined
  /* 当前表单项是否执行过失焦事件 */
  blurred: boolean
  /**
   * 当前表单项是否进行过 **UI修改**
   *
   * 所谓 **UI修改**：就是是否进行过界面输入值
   *
   * 直接通过代码进行数据修改不算UI修改
   */
  dirty: boolean
  /* 当前表单项是否被禁用 */
  disabled: boolean
  /* 当前表单项的父表单 */
  // TODO parent: AbstractControl | undefined
  /**
   * 触发表单校验的时机
   *
   * 默认 onChange
   * @default onChange
   */
  trigger: ValidateTrigger
  /**
   * 手动执行校验
   *
   * 函数返回结果为错误信息，若校验无误，则返回 undefined
   */
  validate: () => Promise<ValidateErrors | undefined>
  /* 重置表单项的值和所有状态 */
  reset: () => void
  /**
   * 清空当前表单项的值
   *
   * 这个行为并不会触发 dirty 和 blurred 的修改，因为并不是由 UI 发起的事件
   */
  clear: () => void
  /**
   * 手动触发 value 的修改
   *
   * 不会引起 dirty 的修改
   */
  setValue: (value: T, options?: { dirty?: boolean }) => void
  /**
   * 设置新的校验器
   *
   * 注意：是 **替换**
   */
  setValidator: (validator: Validator | Validator[] | undefined) => void
  /**
   * 设置新的异步校验器
   *
   * 注意：是 **替换**
   */
  setAsyncValidator: (
    validator: AsyncValidator | AsyncValidator[] | undefined,
  ) => void
  /* 设置父表单项 */
  // TODO setParent: (control: AbstractControl) => void
  /* 设置表单项的错误信息 */
  setErrors: (errors: ValidateErrors | undefined) => void
  /* 手动设置为 dirty 状态 */
  markAsDirty: () => void
  /* 手动设置为 blurred 状态 */
  markAsBlurred: () => void
  /* 设置当前项为禁用状态 */
  disable: () => void
  /* 设置当前项为可用状态 */
  enable: () => void
  /* 获取当前表单的根表单 */
  // TODO getRoot: () => AbstractControl
}
