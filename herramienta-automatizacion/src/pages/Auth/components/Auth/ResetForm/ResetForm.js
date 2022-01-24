import React, { useState } from "react"
import { Button, Form, Input } from "semantic-ui-react"
import { toast } from "react-toastify"
//import { validateEmail } from "../../../utils/Validations"
import { firebase } from "../../../../utils/Firebase"
import "firebase/auth"

import "./ResetForm.scss"

const validateEmail = (emailData) => {
	return true
}

const LoginForm = (props) => {

	const { setSelectedForm } = props
	
	const [formData,  setFormData]  = useState({email: ""})
	const [formError, setFormError] = useState({})
	const [isLoading, setIsLoading] = useState(false)

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
			
		setFormError(errors)

		const formOk = Object.keys(errors).length === 0 ? true : false 

		if(formOk) {
			setIsLoading(true)

			firebase
				.auth()
				.sendPasswordResetEmail(formData.email)
				
				.then(() => {
					toast.success("Email send it")
				})
				
				.catch(() => {
					console.log("error") 
				})
				
				.finally(() => {
					setIsLoading(false)
					setSelectedForm(null)
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

					{formError.email && <span className="error-text"> Please introduce a valid mail. </span>}
				</Form.Field>
			 
				<Button className="change" type="submit" loading={isLoading}>
					Submit
				</Button>
			</Form>

			<div className="login-form__options">
				<p onClick={() => setSelectedForm(null)}>Back</p>
				<p>
					¿No tienes cuenta?{" "}
					<span onClick={() => setSelectedForm("register")}>Regíster</span>
				</p>
			</div>
		</div>
	)
}

export default LoginForm