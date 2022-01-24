import React from 'react'

// Styles
import './MyProgressBar.scss'

const MyProgressBar = (props) => {

	const value = props.progress

	return (
		<div className="progress">
			<div className="color" style={{width: value + "%" }}></div>
		</div>
	)
}

export default MyProgressBar