import type {
  AsyncValidator,
  ValidateErrors,
  Validator,
  ValidatorOptions,
} from './types'
import { isArray, isNil, isPlainObject } from 'lodash-es'

export function isOptions(
  value?: Validator | Validator[] | ValidatorOptions,
): value is ValidatorOptions {
  return isPlainObject(value)
}

export function toValidator(
  validator?: Validator | Validator[],
): Validator | undefined {
  return isArray(validator) ? compose(validator) : validator
}

export function toAsyncValidator(
  validator?: AsyncValidator | AsyncValidator[],
): AsyncValidator | undefined {
  return isArray(validator) ? composeAsync(validator) : validator
}

export function compose(validators: Validator[]): Validator | undefined {
  if (!validators.length) {
    return undefined
  }
  return (value, control) =>
    mergeMessages(executeValidates(value, control, validators))
}

export function composeAsync(
  validators: AsyncValidator[],
): AsyncValidator | undefined {
  if (!validators.length) {
    return undefined
  }
  return (value, control) =>
    Promise.all(executeValidates(value, control, validators)).then(
      mergeMessages,
    )
}

export function executeValidates<T extends (value: any, control: any) => any>(
  value: any,
  control: any,
  validators: T[],
): ReturnType<T>[] {
  return validators.map((validator) => validator(value, control))
}

export function mergeMessages(
  errors: Array<any | undefined>,
): ValidateErrors | undefined {
  const result = errors.reduce<any>(
    (res, error) => (isNil(error) ? res : { ...res, ...error }),
    {},
  )
  return Object.keys(result).length ? result : undefined
}
