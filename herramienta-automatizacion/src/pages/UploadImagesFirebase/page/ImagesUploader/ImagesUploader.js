import React, { useState } from 'react'
import { toast } from 'react-toastify'
import { Input, Button, Grid } from "semantic-ui-react"
import { chunk } from 'lodash'
import { db } from '../../../utils/Firebase'

// Styles
import './ImagesUploader.scss'
import 'semantic-ui-css/semantic.min.css'
import 'react-toastify/dist/ReactToastify.css'

// Components
import ImageCard  from '../ImageCard/ImageCard'
import MyDropzone from '../MyDropzone/MyDropzone'
import MyProgressBar from '../MyProgressBar/MyProgressBar'
import LoaderAnimation from '../LoaderAnimation/LoaderAnimation'

toast.configure()

const ImagesUploader = () => {
	
	const [images, setImages]       = useState([])
	const [urls,   setUrls]         = useState([])
	const [progress, setProgress]   = useState(0)
	const [searching, setSearching] = useState(false)

	let uploadedImages = 0

	const uploadImages = () => {
		uploadedImages = 0
		setSearching(true)

		const ref = document.getElementById("reference").value || "noReference/"

		const promises = images.map(image => postImage(image, ref))

		Promise.all(promises)
		.then(() => {
			const newUrls = images.map(elem => elem.url)
			setUrls(newUrls)

			if(newUrls.includes(""))
				throw "Some images have not been uploaded correctly"

			toast.info("Files uploaded correctly")
		})
		.catch((err) => {
			toast.error(err)
		})
		.finally(() => {
			setImages([])
			setSearching(false)
			setProgress(0)
		})
	}


	const postImage = async (image, ref) => {
		try {
			const uploadTask = await db.ref(ref + image.id).put(image, {contentType: image.mimetype})
			const imageURL   = await db.ref(ref + image.id).getDownloadURL()

			setProgress(100 * ++uploadedImages / images.length)

			if( !imageURL.includes("https://firebasestorage.googleapis.com") ) 
				throw {message: "ERROR: The url is not correct..."}
			
			image.url = imageURL
		}
		catch(e) {
			console.log(e.message || "Error uploading image")
		}
	}
	

	const deleteImage = (image_id) => {
		setImages(images.filter(elem => elem.id !== image_id))
	}


	const copyToClipboard = () => {
		const arr = []
		
		urls.forEach(elem => {
			arr.push('<div>\n')
			arr.push('\t<img src={"' + elem + '"} alt="boohoo" className="img-responsive"/>\n')
			arr.push('\t<br/>\n')
			arr.push('</div>\n')
		})
		
		navigator.clipboard.writeText(arr.join(''));
		toast.info("Copied html");
	}


	return (
		<div className="images-uploader">		

			<div className="dataInput">
		
				<MyDropzone setImages={setImages}/>

				<div className="horizontal">
					<Input
						type="text"
						name="reference"
						placeholder="reference"
						icon="file outline"
						id="reference"
					/>

					<Button onClick={() => uploadImages()}>  Upload  </Button>
				</div>
			
			</div>

			{images.length !== 0 &&
				<div className="deleteButton">
					<Button onClick={() => setImages([])}>  Delete images  </Button>
				</div>
			}


			{images.length === 0 && urls.length !== 0 && 
				<div className="copyButton">
					<Button onClick={() => copyToClipboard()}>  Copy html  </Button>
				</div>
			}


			<div className="imagesOutput">
				{searching && <LoaderAnimation/>}
				{searching && <MyProgressBar progress={progress}/>}

				<Grid columns={5}>
					{chunk(images, 5).map(row => 
						<Grid.Row>
							{row.map(image => 
								<Grid.Column> <ImageCard image={image} deleteImage={deleteImage}/> </Grid.Column>
							)}
						</Grid.Row>
					)}
				</Grid>
			</div>


			<div className="htmlOutput">
				{images.length === 0 && urls.map(elem => 
					<div className={elem ? '' : 'error'}>
						<pre className="textLine">{'<div>'}</pre>
						<pre className="textLine">{'\t<img src={"' + elem + '"} alt="boohoo" className="img-responsive"/>'}</pre>
						<pre className="textLine">{'\t<br/>'}</pre>
						<pre className="textLine">{'</div>'}</pre>
					</div>
				)}
			</div>

		</div>
	)
	
}

export default ImagesUploader;