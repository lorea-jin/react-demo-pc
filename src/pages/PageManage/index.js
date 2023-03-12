import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { Card, Breadcrumb, Form, Button, Radio, DatePicker, Table, Space, Tag, Modal, message } from 'antd'
import { EditOutlined, DeleteOutlined, ExclamationCircleFilled } from '@ant-design/icons'
import { getTable, deleteArticle } from './api'
import styles from './index.module.scss'
import { articleTags } from 'constant/index'
import defualtPic from 'assets/images/none.png'
import Channel from 'components/channel'
const { RangePicker } = DatePicker
export default class PageManage extends Component {
  state = {
    articles: [],
  }
  columns = [
    {
      title: '封面',
      dataIndex: 'cover',
      key: 'cover',
      render(data) {
        return <img src={data.images[0] ? data.images[0] : defualtPic} alt='' className='coverItem' />
      },
    },
    {
      title: '标题',
      dataIndex: 'title',
      key: 'title',
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render(id) {
        const obj = articleTags.find(item => item.id === id)
        return <Tag color={obj.color}>{obj.title}</Tag>
      },
    },
    {
      title: '发布时间',
      dataIndex: 'pubdate',
      key: 'pubdate',
    },
    {
      title: '阅读数',
      dataIndex: 'read_count',
      key: 'read_count',
    },
    {
      title: '评论数',
      dataIndex: 'comment_count',
      key: 'comment_count',
    },
    {
      title: '点赞数',
      dataIndex: 'like_count',
      key: 'like_count',
    },
    {
      title: '操作',
      render: data => {
        return (
          <Space>
            <Button type='primary' shape='circle' icon={<EditOutlined />} onClick={()=>this.toEdit(data.id)} />
            <Button type='primary' shape='circle' danger icon={<DeleteOutlined />} onClick={() => this.handleDelete(data.id)} />
          </Space>
        )
      },
    },
  ]
  reqParams = {
    per_page: 10,
    page: 1,
  }
  render() {
    return (
      <div className={styles.pageWrap}>
        <Card
          title={
            <Breadcrumb separator='>'>
              <Breadcrumb.Item>
                <Link to='/home'>首页</Link>{' '}
              </Breadcrumb.Item>
              <Breadcrumb.Item>内容管理</Breadcrumb.Item>
            </Breadcrumb>
          }
        >
          <Form name='basic' style={{ maxWidth: 600 }} onFinish={this.onFinish} autoComplete='off' size='middle'>
            <Form.Item label='状态' name='status'>
              <Radio.Group>
                <Radio value={-1}>全部</Radio>
                <Radio value={0}>草稿</Radio>
                <Radio value={1}>待审核</Radio>
                <Radio value={2}>审核通过</Radio>
                <Radio value={3}>审核失败</Radio>
              </Radio.Group>
            </Form.Item>
            <Form.Item label='频道' name='channel_id'>
              <Channel />
            </Form.Item>
            <Form.Item label='日期' name='period'>
              <RangePicker />
            </Form.Item>
            <Form.Item>
              <Button type='primary' htmlType='submit'>
                筛选
              </Button>
            </Form.Item>
          </Form>
        </Card>

        <Card title={`根据条件查询的到${this.state.articles?.total_count}条结果：`} className='resultNumber'>
          <Table
            dataSource={this.state.articles.results}
            columns={this.columns}
            rowKey='id'
            pagination={{
              position: ['bottomRight'],
              total: this.state.articles.total_count,
              pageSize: this.reqParams.per_page,
              current: this.reqParams.page,
              onChange: this.onChangePage,
            }}
          />
        </Card>
      </div>
    )
  }

  onFinish = ({ status, period, channel_id }) => {
    if (status === -1) {
      this.reqParams.status = null
    } else {
      this.reqParams.status = status
    }
    if (period) {
      this.reqParams.begin_pubdate = period[0].startOf('day').format('YYYY-MM-DD HH:mm:ss')
      this.reqParams.end_pubdate = period[1].endOf('day').format('YYYY-MM-DD HH:mm:ss')
    } else {
      this.reqParams.begin_pubdate = null
      this.reqParams.end_pubdate = null
    }
    if (channel_id !== undefined) {
      this.reqParams.channel_id = channel_id
    } else {
      this.reqParams.channel_id = null
    }

    this.getTable()
  }
  componentDidMount() {
    this.getTable()
  }

  async getTable() {
    console.log(this.reqParams)
    const { data } = await getTable(this.reqParams)
    this.setState({
      articles: data,
    })
  }

  onChangePage = (page, pageSize) => {
    this.reqParams.page = page
    this.reqParams.per_page = pageSize
    this.getTable()
  }

  handleDelete = id => {
    Modal.confirm({
      title: '温馨提示',
      icon: <ExclamationCircleFilled />,
      content: '确认是否要删除这篇文章？',
      onOk: async () => {
        await deleteArticle(id)
        this.getTable()
        message.success('删除成功')
      },
    })
  }

	toEdit=(id)=>{
		this.props.history.push(`/home/publish/${id}`)
	}
}
