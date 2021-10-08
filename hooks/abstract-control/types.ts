import type {
  AsyncValidator,
  ValidateErrors,
  ValidateStatus,
  ValidateTrigger,
  Validator,
} from '../../validators'
import type { FormControl } from '../form-control'
import type { ControlsGroup } from '../form-group'

export const enum AbstractControlType {
  control,
  group,
}

export interface UseAbstractControlOptions {
  type: AbstractControlType
  value?: any
  controls?: ControlsGroup<any>
  setValue: (value: any, options?: { dirty?: boolean }) => void
  getValue: () => any
  getControls: () => [string, FormControl<any, any>][]
  initialValue?: any
  defaultDisabled?: boolean
  defaultTrigger?: ValidateTrigger
  validators?: Validator | Validator[]
  asyncValidators?: AsyncValidator | AsyncValidator[]
}

export interface AbstractControl {
  /**
   * @private
   * 代表当前 control 的类型
   */
  type: AbstractControlType
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
  //  TODO parent root
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
  /* 手动修改触发校验器的时机 */
  setTrigger: (trigger: ValidateTrigger) => void
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
  /**
   * 合并新的校验器
   *
   * 注意：是 **合并**
   */
  patchValidator: (validator: Validator | Validator[]) => void
  /**
   * 合并新的异步校验器
   *
   * 注意：是 **合并**
   */
  patchAsyncValidator: (validator: AsyncValidator | AsyncValidator[]) => void
  /* 手动设置为 dirty 状态 */
  markAsDirty: () => void
  /* 手动设置为非 dirty 状态 */
  markAsUnDirty: () => void
  /* 手动设置为 blurred 状态 */
  markAsBlurred: () => void
  /* 手动设置为 unblurred 状态 */
  markAsUnBlurred: () => void
  /* 设置当前项为禁用状态 */
  disable: () => void
  /* 设置当前项为可用状态 */
  enable: () => void
  /**
   * 获取当前合法的 value
   *
   * 被禁用和不合法的字段会被过滤
   *
   */
  getValidValue: () => any
  /* 获取当前所有 value */
  getAllValue: () => any
  /* 替换表单的值 */
  setValue: (value: any) => void
}
