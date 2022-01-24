import React, { useState } from "react"
import { Button, Icon, Form, Input } from "semantic-ui-react"
import { toast } from "react-toastify"
//import validateEmail from "../../../utils/Validations"
import { firebase } from "../../../../utils/Firebase"
import "firebase/auth"

import "./LoginForm.scss"

const validateEmail = (emailData) => {
	return true
}

const LoginForm = (props) => {

	const { setSelectedForm } = props

	const [showPassword, setShowPassword] = useState(false)
	const [formData,     setFormData]     = useState({email: "", password: ""})
	const [formError,    setFormError]    = useState({})
	const [isLoading,    setIsLoading]    = useState(false)
	const [userActive,   setUserActive]   = useState(true)
	const [user,         setUser]         = useState(null)

	const handlerShowPassword = () => setShowPassword(!showPassword)

	const onChange = e => {
		setFormData({
			...formData,
			[e.target.name]: e.target.value
		})
	}

	const onSubmit = () => {
		
		const errors = {}

		if(!validateEmail(formData.email)) 
			errors.email = true
		
		if(formData.password.length < 6) 
			errors.password = true

		setFormError(errors)

		const formOk = Object.keys(errors).length === 0 ? true : false 

		if(formOk) {
			setIsLoading(true)
			
			firebase
				.auth()
				.signInWithEmailAndPassword(formData.email, formData.password)
				
				.then(response => {
					setUser(response.user)
					setUserActive(response.user.emailVerified)
					
					if(!response.user.emailVerified) 
						toast.warning("Plaese verify the account before try login.")
				})
				
				.catch(err => {
					handlerErrors(err.code)
				})

				.finally(() => {
					setIsLoading(false)
				})
		}
	}

	return (
		<div className="login-form">
			<h1>Spanish courses for all</h1>

			<Form onSubmit={onSubmit} onChange={onChange}>
				
				<Form.Field>
					<Input
						type="text"
						name="email"
						placeholder="email"
						icon="mail outline"
						error={formError.email}
					/>
					{formError.email && <span className="error-text"> Please give a valid email. </span>}
				</Form.Field>
				
				<Form.Field>
					<Input
						type={showPassword ? "text" : "password"}
						name="password"
						placeholder="password"
						error={formError.password}
						icon={
							<Icon
								name={"eye" + showPassword ? " slash outline" : ""}
								link
								onClick={handlerShowPassword}
							/>
						}
					/>
					{formError.password && <span className="error-text"> Please insert a password greatter than 5 characters. </span>}
				</Form.Field>

				<Button className="login "type="submit" loading={isLoading}>
					Log in
				</Button>

				<Button className="change "type="submit" onClick={() => setSelectedForm("reset")}>
					Forgot password?
				</Button>
			</Form>

			{!userActive && 
				<ButtonResetSendEmailVerification
					user={user}
					setIsLoading={setIsLoading}
					setUserActive={setUserActive}
				/>
			}

			<div className="login-form__options">
				<p onClick={() => setSelectedForm(null)}>Back</p>
				<p>
					I don´t have a Comligo account{" "}
					<span onClick={() => setSelectedForm("register")}>Register</span>
				</p>
			</div>
		</div>
	)
}

const ButtonResetSendEmailVerification = (props) => {
	
	const { user, setIsLoading, setUserActive } = props

	const resendVerificationEmail = () => {
		user
			.sendEmailVerification()

			.then(() => {
				toast.success("Verifiying email was send it.")
			})

			.catch(err => {
				handlerErrors(err.code)
			})

			.finally(() => {
				setIsLoading(false)
				setUserActive(true)
			})
	}

	return (
		<div className="resend-verification-email">
			<p>
				Resend the verifiying email.. 
				<span onClick={resendVerificationEmail}>{` `}click here.</span>
			</p>
		</div>
	);
}

const handlerErrors = (code) => {
	switch(code) {
		case "auth/wrong-password":
			toast.warning("User or password is wrong verify.")
			break
		case "auth/too-many-requests":
			toast.warning("The number of request exceed try another way to log in.")
			break
		case "auth/user-not-found":
			toast.warning("User or password is wrong verify")
			break
		default:
			break
	}
}

export default LoginForm