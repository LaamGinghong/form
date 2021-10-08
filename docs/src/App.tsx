import type { VFC } from 'react'
import { Layout, Menu } from 'antd'
import Page from './Page'
import 'antd/dist/antd.min.css'

const App: VFC = () => {
  return (
    <Layout>
      <Layout.Sider>
        <Menu style={{ height: '100vh', overflow: 'auto' }}>
          <Menu.Item key="basic">Basic</Menu.Item>
        </Menu>
      </Layout.Sider>
      <Layout.Content
        style={{ height: '100vh', overflow: 'auto', padding: '20px' }}
      >
        <Page />
      </Layout.Content>
    </Layout>
  )
}

export default App
