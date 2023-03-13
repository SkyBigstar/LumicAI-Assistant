
const express = require('express');
const openai = require('../middlewares/openai');
const fileUpload = require("express-fileupload");


let app = express.Router()
app.use(fileUpload());
const { Configuration, OpenAIApi } = require("openai");
const configuration = new Configuration({
		apiKey: process.env.OPENAI_API_KEY,
		});
const openapi = new OpenAIApi(configuration);




app.post('/personal/semantic', async (req, res, next) => {
	try {
		let query  = req.body.query
		let context = req.body.context
	let prompt = `You're an assistant helping students solve academic level exam questions.\n`+
	`You will be provided with a multiple choice question and additional context to help you solve the answer.\n`+
	`In your answer go over all the possible options and explain why they are incorrect, and lastly find the correct answer and explain why it's correct.\n`+
	`If the answer is not contained in the context, answer with ` + `"` + `the answer was not found in the document.`+`"\n`+
	`Here is the multiple choice question: `

	let inputRaw =`[`+`${query}`+`]\n`  // here is where people enter stuff
    prompt += inputRaw
	prompt += `Here is the additional context: `
	let Raw =`[`+`${context}`+`]`
	prompt += Raw
	console.log(prompt)
	const gptResponse = await openai.complete({
		engine: 'text-davinci-003',
		prompt,
		maxTokens: 1000,
		temperature: 0.5,
		topP: 1,
		frequencyPenalty: 1,
		presencePenalty: 0, 
		bestOf: 1,
		n: 1,
		user: req.user._id,
		stream: false,
		stop: ["###", "<|endoftext|>", ],
	});

	let output = `${gptResponse.data.choices[0].text}`
	// console.log(output)
	// remove the first character from output
	output = output.substring(1, output.length)

	// If the output string ends with one or more hashtags, remove all of them
	if (output.endsWith('"')) {
		output = output.substring(0, output.length - 1)
	}

	// If the output string ends with one or more hashtags, remove all of them
	if (output.endsWith('"')) {
		output = output.substring(0, output.length - 1)
	}

	// remove a single new line at the end of output if there is one
	if (output.endsWith('\n')) {
		output = output.substring(0, output.length - 1)
	}

	req.locals.input = prompt
	req.locals.inputRaw = inputRaw
	req.locals.output = output

	next()

	} catch (err){
		console.log(err.response)
		console.log(err.data)
		console.log(err.message)
	}
	
  })

//   app.post('/personal/semantic-pdf', async (req, res, next) => {
// 	try {
// 	if (!req.files && !req.files.pdfFile) {
// 		res.status(400);
// 		res.end();
// 	}
// 	let paragraphs;
// 	if (req.files.pdfFile.mimetype == 'application/pdf') {
// 		await pdfParse(req.files.pdfFile).then(result => {
// 			paragraphs = result.text.trim().split('.');								
// 		});
// 		const response1 = await openapi.createEmbedding({
// 			model: "text-embedding-ada-002",
// 			input: req.body.answer,
// 			});
// 		console.log(paragraphs.length);	
// 		var matchscore = new Array(11).fill(0);
// 		var number = new Array(11).fill(0);
// 		var s=0;
// 		for (var i=0; i<10; i++) {
// 			console.log(i);
// 			const response = await openapi.createEmbedding({
// 				model: "text-embedding-ada-002",
// 				input: paragraphs[i],
// 				});
// 			console.log(response.data.data[0].embedding)
// 			await new Promise(resolve => setTimeout(resolve, 1100)).then(() => {
// 				s = similarity(response.data.data[0].embedding, response1.data.data[0].embedding)
// 				console.log(s);							
// 			});	
// 			for(var j=9; j>=0;j--) {
// 				if(s>matchscore[j]) {										
// 					matchscore[j+1] = matchscore[j];
// 					number[j+1] = number[j]; 	
// 					if(j==0) {matchscore[j]=s; number[j]=i;}									
// 				}
// 				else {
// 					matchscore[j+1] = s;
// 					number[j+1] =  i;
// 					break;
// 				}								
// 			}
// 		}
// 		var result=req.body.answer+"\n\n"+"Context Items Applied"+"\n";	
// 		for (var i=0;i<=4;i++) {
// 			result+="matchscore: "+matchscore[i].toFixed(2).toString()+"\n";
// 			result+=paragraphs[number[i]].trim()+"\n\n";
// 			//res.append("matchscore", matchscore[i]);
// 			//res.append("paragaph",paragraphs[number[i]]);			
// 		}
// 		console.log(result);
// 		req.locals.output = result;					
// 	}
// 	else {
		
// 	}

// 	next();
// 	}
// 	catch (err) {
// 		console.log(err.response)
// 		console.log(err.data)
// 		console.log(err.message)
// 	}
//   })

  app.post('/personal/semantic-site', async (req, res, next) => {

  })
module.exports = app