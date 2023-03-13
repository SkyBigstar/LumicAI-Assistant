import {
	ViewListIcon,
} from '@heroicons/react/solid'


const obj = {

	title: "Semantic Search",
	desc: "Find the most appropriate paragraph in the pdf, word and website",
	category: "Personal",
	Icon: ViewListIcon,
	// tags: [],
	permissions: ['user'],
	
	fromColor: "green-500",
	toColor: "blue-500",

	to: "/ai/personal/semantic",
	api: "/ai/personal/semantic",

	output: {
		title: "Semantic Search",
		desc: "The following text detected",
		Icon: false,
		color: "blue",
	},

	prompts: [{
		title:"Input query",
		desc: "",
		// n: 1,
		prompts: [
			{ 
				title: "Query", 
				attr: "query",  
				value: "", 
				placeholder: "Input the query...", 
				label: "",
				type: "textarea",
				maxLength: 600,
				// max: 100,
				min: 3,
				required: true,
				error: "",
				example: "Explain what traditions are...",
			}			
		],
		example: {
			// output: "",
			output: [				
				"GPT Response:"+"\n"+ "Traditions are customs, beliefs, or practices that have been passed down from generation to generation. They can be related to holidays, religious ceremonies, family gatherings, or any other type of social activity. Traditions often reflect the values and beliefs of a particular culture and help to shape its identity."			
				],
			// Icon: RefreshIcon,
			color: "blue",
		}
	}]
		
}

export default obj

