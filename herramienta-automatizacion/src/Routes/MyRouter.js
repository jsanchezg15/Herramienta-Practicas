import React from 'react'
import {
	BrowserRouter,
	Switch,
	Route,
	Redirect
} from 'react-router-dom'

// Components
import MainMenu from '../pages/MainMenu/page/MainMenu'
import Auth from '../pages/Auth/page/Auth/Auth'

const MyRouter = (props) => {

	const user = props.user

	return (
		<BrowserRouter>
			{
				user ? 
					<Redirect to="/menu"/> 
				: 
					<Redirect to="/auth"/>
			}

			<Switch>
				<Route path="/auth">
					<Auth/>
				</Route>
				<Route path="/menu">
					<MainMenu/>
				</Route>
			</Switch>
		</BrowserRouter>
	)
}

export default MyRouter