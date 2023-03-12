import React, { Component } from 'react'
import { Card, Breadcrumb, Form, Input, Radio, Upload, Button, Space, message, Modal } from 'antd'
import { PlusOutlined } from '@ant-design/icons'
import { Link } from 'react-router-dom'
import Channel from 'components/channel'
import ReactQuill from 'react-quill'
import 'react-quill/dist/quill.snow.css'
import styles from './index.module.scss'
import { baseURL } from 'utils/service'
import { publishArticle, getArticle ,editArticle} from 'pages/PageManage/api'
export default class Publish extends Component {
  state = {
    currentRadio: null,
    fileList: [],
    previewOpen: false,
    previewUrl: null,
  }
  FormRef = React.createRef()
  render() {
	
    return (
      <div className={styles.publishWrap}>
        <Card
          title={
            <Breadcrumb separator='>'>
              <Breadcrumb.Item>
                <Link to='/'>首页</Link>
              </Breadcrumb.Item>
              <Breadcrumb.Item>{this.props.match.params.id ? '编辑' : '发布'}文章</Breadcrumb.Item>
            </Breadcrumb>
          }
        >
          <Form
            name='basic'
            labelCol={{ span: 8 }}
            wrapperCol={{ span: 16 }}
            style={{ maxWidth: 800 }}
            onFinish={this.onFinish}
            autoComplete='off'
            ref={this.FormRef}
          >
            <Form.Item label='标题' name='title' rules={[{ required: true, message: '请输入文章标题!' }]}>
              <Input />
            </Form.Item>
            <Form.Item label='频道' name='channel_id' rules={[{ required: true, message: '请选择频道!' }]}>
              <Channel />
            </Form.Item>
            <Form.Item label='封面' name='type' rules={[{ required: true, message: '请选择对应封面数量' }]}>
              <Radio.Group onChange={this.changeRadio}>
                <Radio value={1}>单图</Radio>
                <Radio value={3}>三图</Radio>
                <Radio value={0}>无图</Radio>
              </Radio.Group>
            </Form.Item>

            {!this.state.currentRadio ? null : (
              <Form.Item wrapperCol={{ offset: 8 }}>
                <Upload
                  listType='picture-card'
                  action={`${baseURL}upload`}
                  fileList={this.state.fileList}
                  onChange={this.uploadChange}
                  onPreview={this.handlePreview}
                  name='image'
                  beforeUpload={this.beforeUpload}
                >
                  {this.state.fileList.length < this.state.currentRadio ? <PlusOutlined /> : null}
                </Upload>
              </Form.Item>
            )}

            <Form.Item label='内容' name='content' rules={[{ required: true, message: '请填写内容!' }]}>
              <ReactQuill />
            </Form.Item>

            <Form.Item wrapperCol={{ offset: 8 }}>
              <Space>
                <Button type='primary' htmlType='submit'>
                  {this.props.match.params.id ? '编辑' : '发布'}文章
                </Button>

                <Button onClick={this.handleDraft}>存入草稿</Button>
              </Space>
            </Form.Item>
          </Form>
        </Card>

        <Modal open={this.state.previewOpen} title='图片预览' footer={null} onCancel={this.handleCancel}>
          <img alt='example' style={{ width: '100%' }} src={this.state.previewUrl} />
        </Modal>
      </div>
    )
  }
  async componentDidMount() {
    if (this.props.match.params.id) {
      // 编辑
      const { data } = await getArticle(this.props.match.params.id)
      const fileList = data.cover.images.map(item => ({ url: item, thumbUrl: item }))

      const obj = {
        ...data,
        type: data.cover.type,
      }

      this.FormRef.current.setFieldsValue(obj)

      this.setState({
        fileList,
        currentRadio: data.cover.type,
      })
    } else {
      // 新增
    }
  }
  onFinish = val => {
    this.submit(val)
  }

  submit = (val, draft) => {
    if (this.state.fileList.length !== this.state.currentRadio) {
      return message.warning('请上传对应数量图片')
    }
    const params = {
      ...val,
      cover: {
        type: val.type,
        images: this.state.fileList.map(item => item.url || item.response.data.url),
      },
    }
    try {
      if (this.props.match.params.id) {
				editArticle(params,draft,this.props.match.params.id)
      } else {
        publishArticle(params, draft)
      }

      this.props.history.push('/home/pageManage')
    } catch (error) {
      console.log(error)
    }
  }
  handleDraft = async () => {
    try {
      const re = await this.FormRef.current.validateFields()
      this.submit(re, true)
    } catch (error) {
      console.log(error)
    }
  }
  changeRadio = e => {
    this.setState({
      fileList: [],
      currentRadio: e.target.value,
    })
  }

  uploadChange = ({ file, fileList }) => {
    this.setState({
      fileList,
    })
  }

  handlePreview = file => {
    this.setState({
      previewOpen: true,
      previewUrl: file.url || file.response.data.url,
    })
  }
  handleCancel = () => {
    this.setState({
      previewOpen: false,
    })
  }
  beforeUpload = file => {
    if (file.size / 1024 > 250 || file.type !== 'image/png') {
      message.warning('只能上传250kb以下的png格式！')
      return Upload.LIST_IGNORE
    }
  }
}
