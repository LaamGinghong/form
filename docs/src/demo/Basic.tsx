import type { VFC } from 'react'
import { Button, Input, Typography } from 'antd'
import { Form, FormItem } from '../../../components'
import { useFormGroup } from '../../../hooks'
import { required } from '../../../validators'

const Basic: VFC = () => {
  const control = useFormGroup({
    name: ['', [required]],
    password: ['', [required]],
  })

  const handleSubmit = (value: unknown) => {
    console.log(value)
  }

  return (
    <Typography>
      <Typography.Title level={3}>Basic</Typography.Title>
      <Form control={control} onSubmit={handleSubmit}>
        <FormItem
          field="name"
          label="Name"
          messages={{ required: 'Name is required' }}
        >
          <Input />
        </FormItem>
        <FormItem
          field="password"
          label="Password"
          messages={{ required: 'Password is required' }}
        >
          <Input type="password" />
        </FormItem>
        <div>
          <Button htmlType="submit">Submit</Button>
        </div>
      </Form>
    </Typography>
  )
}

export default Basic
