import type { AsyncValidator, ValidateErrors, Validator } from './types'
import { isArray, isNil } from 'lodash-es'
import { AbstractControl } from '../hooks/abstract-control'

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

export function executeValidates<
  T extends (value: any, control: AbstractControl) => any,
>(value: any, control: AbstractControl, validators: T[]): ReturnType<T>[] {
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
