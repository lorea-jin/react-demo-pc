import React, { Component } from 'react'
import { Card, Button, Checkbox, Form, Input, message } from 'antd'
import styles from './index.module.scss'
// import { logo } from '../../assets/images'
import logo from 'assets/images/logo.png'
import { login } from './api/user.js'
import { SetToken } from 'utils/localstorage.js'

export default class Login extends Component {
  state = {
    loading: false,
  }
  render() {
    return (
      <div className={styles.login}>
        <Card className='login-Container'>
          <img src={logo} alt='' className='login-logo' />

          <Form size='large' onFinish={this.onFinish} initialValues={{ mobile: '13911111111', code: '246810' }}>
            <Form.Item
              name='mobile'
              rules={[
                { required: true, message: '请输入手机号' },
                { pattern: /^1[3-9]\d{9}$/, message: '请输入正确格式的手机号' },
              ]}
              validateTrigger='onBlur'
            >
              <Input placeholder='请输入手机号' />
            </Form.Item>

            <Form.Item
              name='code'
              rules={[
                { required: true, message: '请输入验证码' },
                { len: 6, message: '请输入正确的验证码' },
              ]}
              validateTrigger='onBlur'
            >
              <Input placeholder='请输入验证码' />
            </Form.Item>

            <Form.Item
              name='agree'
              valuePropName='checked'
              rules={[
                {
                  validator: (_, value) => {
                    return value ? Promise.resolve() : Promise.reject(new Error('请阅读并同意用户协议'))
                  },
                },
              ]}
            >
              <Checkbox>我已阅读并同意[隐私条款]和[用户协议]</Checkbox>
            </Form.Item>

            <Form.Item>
              <Button type='primary' htmlType='submit' block loading={this.state.loading}>
                登录
              </Button>
            </Form.Item>
          </Form>
        </Card>
      </div>
    )
  }

  onFinish = async values => {
    const { mobile, code } = values
    try {
      const { data } = await login({ mobile, code })
      SetToken(data.token)
      this.setState({
        loading: true,
      })
      const url = this.props.location.state?.from || '/home'
			console.log(url);
      this.props.history.push(url)
    } catch (error) {
      console.log(error)
      message.error(error)
    }
  }
}
