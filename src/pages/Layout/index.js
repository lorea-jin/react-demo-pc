import React, { Component } from 'react'
import { HomeOutlined, SnippetsOutlined, EditOutlined, LogoutOutlined } from '@ant-design/icons'
import { Layout, Menu, message, Popconfirm } from 'antd'
import styles from './index.module.scss'
import { RemoveToken } from 'utils/localstorage.js'
import { Route } from 'react-router-dom'
// import Overview from '../overview/index'
// import PageManage from '../PageManage/index'
// import Publish from '../Publish/index'
import { getUserProfile } from 'pages/Login/api/user'
const Overview=React.lazy(()=>import('pages/overview/index'))
const PageManage=React.lazy(()=>import('pages/PageManage/index'))
const Publish=React.lazy(()=>import('pages/Publish/index'))

const { Header, Content, Sider } = Layout
const MenuList = [
  { icon: HomeOutlined, name: '数据概览', path: '/home' },
  { icon: SnippetsOutlined, name: '内容管理', path: '/home/pageManage' },
  { icon: EditOutlined, name: '发布文章', path: '/home/publish' },
].map((obj, index) => {
  return {
    key: obj.path,
    icon: React.createElement(obj.icon),
    label: obj.name,
  }
})

export default class LayoutBox extends Component {
  state = {
    profile: {},
    currentRoute: this.props.location.pathname,
  }
  render() {
    return (
      <div className={styles.LayoutWrap}>
        <Layout className='layout-content'>
          <Header className='header'>
            <div className='logo' />
            <div className='profile'>
              <span>{this.state.profile.name || '小李子'}</span>
              <Popconfirm title='确定要退出本系统吗？' placement='bottomRight' okText='是' cancelText='否' onConfirm={this.confirmLogout}>
                <span>
                  <LogoutOutlined /> 退出
                </span>
              </Popconfirm>
            </div>
          </Header>

          <Layout>
            {/* 左 */}
            <Sider width={200}>
              <Menu
                onClick={this.clickMenu}
                mode='inline'
                selectedKeys={[this.state.currentRoute]}
                theme='dark'
                style={{
                  height: '100%',
                  borderRight: 0,
                }}
                items={MenuList}
              />
            </Sider>
            {/* 右侧内容 */}
            <Layout className='routeOut'>
              <Content>
                <Route path='/home' component={Overview} exact></Route>
                <Route path='/home/pageManage' component={PageManage}></Route>
                <Route path='/home/publish' component={Publish} exact></Route>
                <Route path='/home/publish/:id' component={Publish}></Route>
              </Content>
            </Layout>
          </Layout>
        </Layout>
      </div>
    )
  }

  confirmLogout = () => {
    RemoveToken()
    this.props.history.push('/login')
    message.success('退出成功')
  }

  async componentDidMount() {
    const { data } = await getUserProfile()
    this.setState({
      profile: data,
    })
  }

  componentDidUpdate(prevous) {
    let nowUrl = this.props.location.pathname
    if (prevous.location.pathname !== nowUrl) {
      if (nowUrl.startsWith('/home/publish')) {
        nowUrl = '/home/publish'
      }
      this.setState({
        currentRoute: nowUrl,
      })
    }
  }
  clickMenu = val => {
    this.props.history.push(val.key)
  }
}
