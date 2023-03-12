// 根组件

import React, { Component, Suspense } from 'react'
import { Link, Switch, Route, Router } from 'react-router-dom'
// import Login from './pages/Login/index.js'
// import LayoutBox from './pages/Layout/index.js'

import history from './utils/histroy'
import AuthRoute from 'utils/authRoute'
import { Redirect } from 'react-router-dom'
import 'dayjs/locale/zh-cn'
import locale from 'antd/locale/zh_CN'
import { ConfigProvider } from 'antd'

const Login = React.lazy(() => import('pages/Login/index'))
const LayoutBox = React.lazy(() => import('pages/Layout/index'))

export default class App extends Component {
  render() {
    return (
      <ConfigProvider locale={locale}>
        <Router history={history}>
          <div>
            {/* <Link to='/home'>首页布局</Link>
          <Link to='/login'>登录</Link> */}
            <Suspense fallback={<div> loading ...</div>}>
              <Switch>
                <AuthRoute path='/home' component={LayoutBox} />
                <Route path='/login' component={Login} />
                <Redirect from='/' to='/home' exact />
              </Switch>
            </Suspense>
          </div>
        </Router>
      </ConfigProvider>
    )
  }
}
