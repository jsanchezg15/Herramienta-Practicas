import React from 'react'
import { Card, Image, Icon } from 'semantic-ui-react'

// Styles
import "./ImageCard.scss"

const ImageCard = (props) => {

	const { image, deleteImage } = props

	return (
		<div className="main__card">
			<Card>
				<Image 
					src={image.preview} 
					wrapped 
					alt="image not found"
				/>
							
				<Card.Content extra>
					<a onClick={() => deleteImage(image.id)}>
						<Icon name='delete'/>
						Delete
					</a>
				</Card.Content>
			</Card>
		</div>
	)
}

export default ImageCard