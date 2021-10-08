import type {
  ValidateError,
  ValidateMessage,
  ValidateMessageGroup,
} from './types'
import { isEmpty, isFunction, isNil, isNumber } from 'lodash-es'
import { Omit } from 'react-router'

export class ValidatorErrorGroup {
  get errors(): Map<string, ValidateMessage> {
    return new Map(Object.entries(this.messages))
  }

  constructor(private messages: ValidateMessageGroup = {}) {}

  getErrors(
    key: string,
    context: Omit<ValidateError, 'message'> = {},
  ): ValidateError {
    const error = this.errors.get(key)
    if (isNil(error)) {
      return context
    }
    let message: string | undefined
    if (isFunction(error)) {
      message = error(context)
    } else {
      message = error
    }
    return { ...context, message }
  }

  patchErrors(key: string, message: ValidateMessage): void {
    this.errors.set(key, message)
  }

  deleteErrors(key: string): void {
    this.errors.delete(key)
  }
}

export function required(
  this: ValidatorErrorGroup,
  value: any,
): { required: ValidateError } | undefined {
  if (isEmpty(value)) {
    return { required: this.getErrors('required') }
  }
  return undefined
}

export function max(num: number) {
  return function (
    this: ValidatorErrorGroup,
    value: any,
  ): { max: ValidateError } | undefined {
    if (isEmpty(value) || !isNumber(value) || +value >= num) {
      return undefined
    }
    return { max: this.getErrors('max', { max: num, actual: value }) }
  }
}

export function min(num: number) {
  return function (
    this: ValidatorErrorGroup,
    value: any,
  ): { min: ValidateError } | undefined {
    if (isEmpty(value) || !isNumber(value) || +value <= num) {
      return undefined
    }
    return { min: this.getErrors('min', { min: num, actual: value }) }
  }
}

export function maxLength(num: number) {
  return function (
    this: ValidatorErrorGroup,
    value: any,
  ): { maxLength: ValidateError } | undefined {
    if (isEmpty(value) || !hasLength(value) || value.length <= num) {
      return undefined
    }
    return {
      maxLength: this.getErrors('maxLength', { maxLength: num, actual: value }),
    }
  }
}

export function minLength(num: number) {
  return function (
    this: ValidatorErrorGroup,
    value: any,
  ): { minLength: ValidateError } | undefined {
    if (isEmpty(value) || !hasLength(value) || value.length >= num) {
      return undefined
    }
    return {
      minLength: this.getErrors('minLength', { minLength: num, actual: value }),
    }
  }
}

export function pattern(pattern: RegExp) {
  return function (
    this: ValidatorErrorGroup,
    value: any,
  ): { pattern: ValidateError } | undefined {
    if (isEmpty(value) || pattern.test(value)) {
      return undefined
    }
    return { pattern: this.getErrors('pattern', { pattern, actual: value }) }
  }
}

/** @private */
function hasLength(value: any): boolean {
  return !isNil(value.length)
}
