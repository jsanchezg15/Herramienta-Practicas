import React,{useState} from 'react'
import AuthOptions from "../../components/Auth/AuthOptions"

// components of login
import LoginForm from "../../components/Auth/LoginForm"
import RegisterForm from "../../components/Auth/RegisterForm"
import ResetForm from "../../components/Auth/ResetForm"
import BackgroundAuth from "../../assets/jpg/background-auth.jpg"
import LogoNameWhite from "../../assets/png/logo-name-white.png"

// Styles
import "./Auth.scss"


const Auth = () => {
 
	const [selectedForm, setSelectedForm] = useState(null)
		
	const handlerForm = () => {
		
		switch (selectedForm) {
			case "login":
				return <LoginForm setSelectedForm={setSelectedForm} />
			case "register":
				return <RegisterForm setSelectedForm={setSelectedForm} />
			case "reset":
				return <ResetForm setSelectedForm={setSelectedForm} />
			default:
				return <AuthOptions setSelectedForm={setSelectedForm} />
		}
	}

	return (
		<div className="auth" style={{ backgroundImage: `url(${BackgroundAuth})` }}>
			<div className="auth__dark"/>
			
			<div className="auth__box">
				<div className="auth__box-logo">
					<img src={LogoNameWhite} alt="Comligo"/>
				</div>
				{handlerForm()}
			</div>
		</div>
	)
}

export default Auth