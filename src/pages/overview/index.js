import React, { Component } from 'react'
import chart from 'assets/images/chart.png' 
export default class Overview extends Component {
	render() {
		return (
			<div style={{width:'100%',
				height: '100%'}}>
				<img src={chart} alt=""   style={{width:'100%',
				height: '100%',objectFit:'contain'}}/>
			</div>
		)
	}
}
