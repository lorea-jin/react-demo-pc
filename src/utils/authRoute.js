// 判断是否有权限

import React, { Component } from 'react'
import { Route } from 'react-router-dom'
import { HasToken } from 'utils/localstorage.js'
import { Redirect } from 'react-router-dom'

export default class authRoute extends Component {
  render() {
    const { component: Component, ...rest } = this.props
    return (
      <Route
        {...rest}
        render={props => {
					// console.log(props);
          return HasToken() ? <Component {...props} /> : <Redirect to={
					{ pathname:'/login',
						state:{
							from:props.location.pathname
						}
					}} />
        }}
      />
    )
  }
}
