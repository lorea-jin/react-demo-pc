import React, { Component } from 'react'
import { Select } from 'antd'
import { getChannel } from 'pages/PageManage/api'

const { Option } = Select
export default class channel extends Component {
  state = {
    channels: [],
  }
  render() {

    return (
      <Select placeholder='请选择文章频道' allowClear onChange={this.handleChange} value={this.props.value}>
        {this.state.channels.map(item => (
          <Option value={item.id} key={item.id}>
            {item.name}
          </Option>
        ))}
      </Select>
    )
  }

  async getChannel() {
    const { data } = await getChannel()
    this.setState({
      channels: data.channels,
    })
  }

	componentDidMount() {
    this.getChannel()
  }

	handleChange=(val)=>{
		this.props.onChange(val)
	}
}
