// 组件入口

import React from 'react'
// import ReactDom from 'react-dom'
import { createRoot } from 'react-dom/client';
import App from './App'

	import './assets/styles/index.scss'
	import './index.scss'

// ReactDom.render(<App />, document.querySelector('#root'))
createRoot(document.querySelector('#root')).render(<App />)