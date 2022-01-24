import React, { useState } from 'react';
import { Input, Button, List, Form } from "semantic-ui-react";
import { toast } from 'react-toastify'

// Styles
import './HtmlParser.scss';
import 'semantic-ui-css/semantic.min.css';

toast.configure()

const HOST =  process.env.HOST || "http://localhost:8080"

const HtmlParser = () => {

	const [html, setHTML] = useState("")
	const [url,  setUrl]  = useState("")

	const getHTML = async () => {
		try {
			setHTML("")
			setUrl("")

			// Asks the API REST for the HTML of the google form
			// whose url has been introduced in the input text
			// The url is send in the headers
		
			const myUrl = document.getElementById("reference").value

			const resp = await fetch(HOST + "/getHtml", {headers: {url: myUrl}})
			const data = await resp.json()

			if(resp.status === 500) 
				throw {message: "Internal server error"}
			
			const publicLoadData = getPublicLoadData(data)

			let description = publicLoadData[0]
			let questions   = publicLoadData[1]
			let title       = publicLoadData[8] || extractTitle(data)

			questions = questions.map(quest => {
				return {
					label:   quest[0],
					legend:  quest[1],
					text:    quest[2],
					type:    getType(quest[3]),
					entry:   quest[4] ? quest[4][0][0] : "",
					options: quest[4] ? quest[4][0][1] : ""
				}
			})

			setUrl(myUrl)
			convertHTML({description, questions, title})
		}	
		catch(e) {
			console.log(e)
			toast.error("ERROR: " + (e.message || "something went wrong..."))
		}
	}

	const getPublicLoadData = (str) => {
		console.log(str)
		try {
			const dataArray = str.split('var FB_PUBLIC_LOAD_DATA_ = ')[1].split(';')
			dataArray.pop()
			
			const data = dataArray.join(";")
			const json = JSON.parse(data)[1]

			return json
		}
		catch(e) {
			throw {message: "something happened while getting public load data"}
		}
	}

	const extractTitle = (str) => {
		let title = str.split("freebirdFormviewerViewHeaderTitle exportFormTitle freebirdCustomFont")[1]
		title = title.split(">")[1]
		title = title.split("<")[0]
		return title
	}

	const getType = (num) => {
		switch(num) {
			case 0:
				return "text"
			case 1:
				return "paragraph"
			case 2:
				return "radio"
			case 3:
				return "dropdown"
			case 4:
				return "checkbox"
			case 6:
				return "reading_text"
			default:
				return "ERROR_TYPE"
		}
	}

	const convertHTML = (obj) => {
		const classNames = getClassNames(obj.title)
		
		let html = "" 

		html += '<form  onChange={onChange} className="' + classNames.formClass + '" id="' + classNames.formId + '">\n'


		// Title

		html += '\t<fieldset>\n'
		html += '\t\t<div>\n'
		html += '\t\t\t<h2 className="' + classNames.titleClass + '">' + obj.title + '</h2>\n'
		html += '\t\t</div>\n' 
		html += '\t</fieldset>\n'


		// Description

		html += '\t<fieldset>\n'
		html += '\t\t<div className="' + classNames.paragraphClass + '">\n'
		html += '\t\t\t<p>' + obj.description + '</p>\n'
		html += '\t\t</div>\n'
		html += '\t</fieldset>\n'
		

		// email

		html += '\t<fieldset>\n'
        html += '\t\t<legend for="" className="' + classNames.legendClass + '">Email</legend>\n'
		html += '\t\t<div class="form-group">\n'
		html += '\t\t\t<input id="emailAddress" type="email" name="emailAddress" class="' + classNames.inputClass + '" required/>\n'
		html += '\t\t</div>\n'
		html += '\t</fieldset>\n'


		// Questions
		let num = 1

		obj.questions.forEach(elem => {
			
			// Reading text
			if(elem.type === "reading_text") {
				html += '\t<fieldset>\n'
				html += '\t\t<legend for="' + elem.label + '" className="' + classNames.legendClass + '">' + elem.legend + '</legend>\n'
				html += '\t\t<div class="form-group">\n'
				html += '\t\t\t<div>' + elem.text + '</div>\n'
				html += '\t\t</div>\n'
				html += '\t</fieldset>\n'
				return
			}

			html += '\t<fieldset>\n'
			html += '\t\t<legend for="' + elem.label + '" className="' + classNames.legendClass + '">' + num++ + '. ' + elem.legend + '</legend>\n'
			html += '\t\t<div class="form-group">\n'


			// Radio inputs
			if(elem.type === "radio") {
				elem.options.forEach(opt => {
					const optValue = (opt[0] !== "" ? opt[0] : "__other_option__")

					html += '\t\t\t<div class="radio">\n'
					html += '\t\t\t\t<label className="' + classNames.labelClass + '">\n' 
					html += '\t\t\t\t\t<input type="radio" name="entry.' + elem.entry + '" value="' + optValue + '" required/>\n'
					html += '\t\t\t\t\t' + opt[0] + '\n'
					html += '\t\t\t\t</label>\n' 
	
					if(opt[0] === "")
						html += '\t\t\t\t<input type="text" name="entry.' + elem.entry + '.other_option_response" placeholder="Other">\n' 
	
					html += '\t\t\t</div>\n'
				})
			}


			// Checkbox inputs
			if(elem.type === "checkbox") {
				elem.options.forEach(opt => {
					const optValue = (opt[0] !== "" ? opt[0] : "__other_option__")
	
					html += '\t\t\t<div class="checkbox">\n'
					html += '\t\t\t\t<label className="' + classNames.labelClass + '">\n' 
					html += '\t\t\t\t\t<input type="checkbox" name="entry.' + elem.entry + '" value="' + optValue + '"/>\n'
					html += '\t\t\t\t\t' + opt[0] + '\n'
					html += '\t\t\t\t</label>\n' 
	
					if(opt[0] === "")
						html += '\t\t\t\t<input type="text" name="entry.' + elem.entry + '.other_option_response" placeholder="Other">\n' 

					html += '\t\t\t</div>\n'
				})
			}


			// Dropdown inputs
			if(elem.type === "dropdown") {
				html += '\t\t\t<select name="entry.' + elem.entry + '">\n'
				html += '\t\t\t\t<option disabled hidden selected>Choose an option</option>\n'
				
				elem.options.forEach(opt => {
					html += '\t\t\t\t<option value="' + opt[0] + '" required/>\n'
					html += '\t\t\t\t\t' + opt[0] + '\n'
					html += '\t\t\t\t</option>\n'
				})
	
				html += '\t\t\t</select>\n'
			}


			// Text inputs
			if(elem.type === "text" || elem.type === "paragraph") 
				html += '\t\t\t<input name="entry.' + elem.entry + '" type="text" class="' + elem.type + '"/>\n'


			html += '\t\t</div>\n'
			html += '\t</fieldset>\n'
		})

		html += '\t<input type="hidden" name="fvv" value="1"/>\n'
		html += '\t<input type="hidden" name="fbzx" value="8461977738504272510"/>\n'
		html += '\t<input type="hidden" name="pageHistory" value="0"/>\n'
		html += '\t<div class="center">\n'
		html += '\t\t<Button className="btn-primary-uno" onClick={onSubmit} isLoading={isLoading}>Send</Button>\n'
		html += '\t</div>\n'
		html += '</form>\n'

		setHTML(html)
	}

	const getClassNames = (title) => {
		if(title.includes("L1")) {
			return {
				formClass:      "trabajo-l1",
				formId:         "l1-course-form",
				titleClass:     "L1",
				paragraphClass: "parrafo-uno",
				legendClass:    "leyenda",
				inputClass:     "form-control",
				labelClass :    "etiqueta"
			}
		}
		else if(title.includes("L2")) {
			return {
				formClass:      "trabajo-l2",
				formId:         "l2-course-form",
				titleClass:     "L2",
				paragraphClass: "parrafo-dos",
				legendClass:    "leyenda-dos",
				inputClass:     "form-control-estilo-dos",
				labelClass :    "etiqueta-dos"
			}
		}
		else if(title.includes("TEST")) {
			return {
				formClass:      "trabajo-U1",
				formId:         "u1-course-form",
				titleClass:     "U1",
				paragraphClass: "parrafo-u1",
				legendClass:    "leyenda-tres",
				inputClass:     "form-control-estilo-tres",
				labelClass :    "etiqueta-tres"
			}
		}
		toast.error("Form type not found")
		return {
			title: "ERROR"
		}
	}

	const createUrl = (myUrl) => {
		const arr = myUrl.split("/")
		arr[arr.length - 1] = "formResponse"
		return arr.join("/")
	}

	const copyToClipboard = (txt) => {
		navigator.clipboard.writeText(txt);
		toast.info("Copied text");
	}

	return (
		<div className="html-parser">
			
			<div className="horizontal">
				<Input
					type="text"
					id="reference"
					placeholder="url here"
					style={{width: "100%"}}
					icon="search"
				/>

				<Button onClick={() => getHTML()}>
					Convert
				</Button>
			</div>

			{html && 
				<div className="copy-buttons">
					<Button 
						className="copy"
						onClick={() => copyToClipboard(html)}
						content="Copy HTML"
					/>
					<Button 
						className="copy"
						onClick={() => copyToClipboard(createUrl(url))}
						content="Copy url"
					/>
					<Button 
						className="delete"
						onClick={() => {
							setHTML("")
							setUrl("")
						}}
						content="Delete"
					/>
				</div>
			}

			{url && <div className="textLine"><br/><br/><br/>{createUrl(url)}<br/><br/></div>}

			<div className="htmltext">
				<List>
					{html.split("\n").map(elem => 
						<List.Item><pre className="textLine">{elem}</pre></List.Item>
					)}
				</List>
			</div>
		</div>
	)
}

export default HtmlParser;
