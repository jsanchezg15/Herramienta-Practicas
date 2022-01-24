const { Router } = require('express')
const { v4 }     = require('uuid')
const fetch      = require('node-fetch')

const router  = Router()
const { storage, db } = require("../firebase/index")

router.get('/getHtml', async (req, res) => {
	try {
		const url  = req.headers.url
		const resp = await fetch(url)
		const data = await resp.text()

		return res.status(200).json(data)
	}
	catch(error) {
		console.log(error)
		return res.status(500).json({error})
	}
})

module.exports = router