// Status
/**
 * **valid**：校验已通过
 *
 * **invalid**：校验不通过
 *
 * **validating**：正在校验中（异步校验）
 */
export type ValidateStatus = 'invalid' | 'valid' | 'validating'

// Trigger
/**
 * **onSubmit**：表单提交时校验
 *
 * **onChange**：表单项内容改变时校验
 *
 * **onBlur**：表单项失焦时校验（输入框）
 */
export type ValidateTrigger = 'onSubmit' | 'onChange' | 'onBlur'

// Error
export interface ValidateError {
  /* 当前报错信息 */
  message?: ValidateMessage
  /**
   * 当前被校验的值
   *
   * 比方说校验的是 **maxLength** 则返回 value.length
   */
  actual?: any

  /**
   * 校验的规则值域
   *
   * 比方说校验的 **maxLength** 则返回设置 maxLength 的 **value**
   */
  [key: string]: any
}
export type ValidateErrors = Record<string, ValidateError>

// Message
export type ValidateMessageFn = (
  error: Omit<ValidateError, 'message'>,
) => string
export type ValidateMessage = string | ValidateMessageFn

// Function
export type Validator = (
  value: any,
  control: any, // TODO
) => ValidateErrors | undefined
export type AsyncValidator = (
  value: any,
  control: any, // TODO
) => Promise<ValidateErrors | undefined>
export interface ValidatorOptions {
  validators?: Validator | Validator[]
  asyncValidators?: AsyncValidator | AsyncValidator[]
  trigger?: ValidateTrigger
  disabled?: boolean
}
