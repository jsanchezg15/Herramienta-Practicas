// Styles
import './LoaderAnimation.scss'

const LoaderAnimation = () => {
	return (
		<div className="container">
			<div className="loader">
				<div className="loader--dot"></div>
				<div className="loader--dot"></div>
				<div className="loader--dot"></div>
				<div className="loader--dot"></div>
				<div className="loader--dot"></div>
				<div className="loader--dot"></div>
				<div className="loader--text"></div>
			</div>
		</div>
	)
}

export default LoaderAnimation