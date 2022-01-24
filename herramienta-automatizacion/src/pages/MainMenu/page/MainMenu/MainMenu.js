import React from 'react'
import { Tab } from 'semantic-ui-react'

// Styles
import 'semantic-ui-css/semantic.min.css'
import 'react-toastify/dist/ReactToastify.css'
import './MainMenu.scss'

// Components
import ImagesUploader from '../../../UploadImagesFirebase/page/ImagesUploader/ImagesUploader'
import HtmlParser from '../../../GoogleFromExtract/HtmlParser'
import { auth } from '../../../utils/Firebase'

// Images
import LogoNameWhite from "../../assets/logo-name-white.png"


const MainMenu = () => {

	const panes = [
		{
			menuItem: 'Upload images',
			render: () => (
				<div className="main">
					<img className="logo" src={LogoNameWhite} alt="Comligo"/>
					<ImagesUploader/>
				</div>
			)
		},
		{
			menuItem: 'Extract html',
			render: () => (
				<div className="main">
					<img className="logo" src={LogoNameWhite} alt="Comligo"/>
					<HtmlParser/>
				</div>
			)			
		},
		{
			menuItem: 'Logout',
			render: () => <div onLoad={auth.signOut()}/>
		}
	]

	const style = {
		padding: "15px",
	}

	const menu = {
		inverted: true,
		secondary: true,
		pointing: true,
		color: "orange",
	}

	return (
		<div>
			<Tab style={style} menu={menu} panes={panes}/>
		</div>
	)
}

export default MainMenu