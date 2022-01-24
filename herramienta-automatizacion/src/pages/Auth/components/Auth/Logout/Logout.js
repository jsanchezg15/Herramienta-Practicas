import React from 'react'
import { Button } from "semantic-ui-react"
import firebase from "../../../utils/Firebase"
import "firebase/auth"

import "./Logout.scss"

export default Logout = (props) => {
    
    const { setShowoglout } = props

    const logOut = () => firebase.auth().signOut()

    const Cancel = () => setShowoglout(false)
    
    return (
        <div className="logout">
            <p>Are you sure you want to log out?</p>
            
            <Button className="accept" onClick={logOut}>
                Yes
            </Button>
            
            <Button className="cancel" onClick={Cancel}>
                No
            </Button>
        </div>
    )
}
