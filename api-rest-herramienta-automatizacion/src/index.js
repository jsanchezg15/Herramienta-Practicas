// "npm run dev" o "node src/index.js" para ejecutar servidor

const express = require("express");
const morgan  = require("morgan")
const cors    = require('cors')
const upload  = require('express-fileupload')

const app = express();

// Settings

app.set('port', process.env.PORT || 8080)
app.set('json spaces', 4)

// middleware

app.use(morgan("dev"))
app.use(upload())
app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use(cors({origin: "http://localhost:5000"}))

// routes

app.use(require("./routes/Routes"))

app.listen(app.get('port'), () => {
	console.log("Server using port " + app.get('port'));
});

