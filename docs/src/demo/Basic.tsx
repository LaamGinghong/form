import type { VFC } from 'react'
import { Button, Input, Typography } from 'antd'
import { Form, FormItem } from '../../../components'
import { useFormGroup } from '../../../hooks'

const Basic: VFC = () => {
  const control = useFormGroup({
    name: [''],
    password: [''],
  })

  const handleSubmit = () => {
    console.log(control.getAllValue())
  }

  return (
    <Typography>
      <Typography.Title level={3}>Basic</Typography.Title>
      <Form control={control}>
        <FormItem field="name" label="Name">
          <Input />
        </FormItem>
        <FormItem field="password" label="Password">
          <Input type="password" />
        </FormItem>
        <div>
          <Button onClick={handleSubmit}>Submit</Button>
        </div>
      </Form>
    </Typography>
  )
}

export default Basic
