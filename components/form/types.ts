import type { FormControl, FormGroup } from '../../hooks'
import type {
  AsyncValidator,
  ValidateTrigger,
  Validator,
} from '../../validators'

export interface FormProps<T extends Record<string, any>> {
  /**
   * control of the form
   */
  control: FormGroup<T>
  /**
   * form submit event
   *
   * it will return all enabled control's value
   */
  onSubmit?: (value: Partial<T>) => void
}

export interface FormContextValue {
  /** all initial value's group */
  initialValues: Record<string, any>
  /** validators' configuration */
  configuration: Record<
    string,
    {
      validators: Validator | Validator[] | undefined
      asyncValidators: AsyncValidator | AsyncValidator[] | undefined
    }
  >
  trigger: ValidateTrigger
  addControl: (field: string, control: FormControl<any, any>) => void
  removeControl: (field: string) => void
}
