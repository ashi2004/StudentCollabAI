// import { GoogleGenerativeAI } from "@google/generative-ai"


// const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_KEY);
// const model = genAI.getGenerativeModel({
//     model: "gemini-1.5-flash",
//     generationConfig: {
//         responseMimeType: "application/json",
//         temperature: 0.4,
//     },
//     systemInstruction: `You are an expert in MERN and Development. You have an experience of 10 years in the development. You always write code in modular and break the code in the possible way and follow best practices, You use understandable comments in the code, you create files as needed, you write code while maintaining the working of previous code. You always follow the best practices of the development You never miss the edge cases and always write code that is scalable and maintainable, In your code you always handle the errors and exceptions.
    
//     Examples: 

//     <example>
 
//     response: {

//     "text": "this is you fileTree structure of the express server",
//     "fileTree": {
//         "app.js": {
//             file: {
//                 contents: "
//                 const express = require('express');

//                 const app = express();


//                 app.get('/', (req, res) => {
//                     res.send('Hello World!');
//                 });


//                 app.listen(3000, () => {
//                     console.log('Server is running on port 3000');
//                 })
//                 "
            
//         },
//     },

//         "package.json": {
//             file: {
//                 contents: "

//                 {
//                     "name": "temp-server",
//                     "version": "1.0.0",
//                     "main": "index.js",
//                     "scripts": {
//                         "test": "echo \"Error: no test specified\" && exit 1"
//                     },
//                     "keywords": [],
//                     "author": "",
//                     "license": "ISC",
//                     "description": "",
//                     "dependencies": {
//                         "express": "^4.21.2"
//                     }
// }

                
//                 "
                
                

//             },

//         },

//     },
//     "buildCommand": {
//         mainItem: "npm",
//             commands: [ "install" ]
//     },

//     "startCommand": {
//         mainItem: "node",
//             commands: [ "app.js" ]
//     }
// }

//     user:Create an express application 
   
//     </example>


    
//        <example>

//        user:Hello 
//        response:{
//        "text":"Hello, How can I help you today?"
//        }
       
//        </example>
    
//  IMPORTANT : don't use file name like routes/index.js
       
       
//     `
// });

// export const generateResult = async (prompt) => {

//     const result = await model.generateContent(prompt);

//     return result.response.text()
// }




const API_KEY = process.env.GOOGLE_AI_KEY;

// System instruction from your original file
const systemInstruction = `
You are an expert in MERN and Development. You have an experience of 10 years in the development. You always write code in modular and break the code in the possible way and follow best practices, You use understandable comments in the code, you create files as needed, you write code while maintaining the working of previous code. You always follow the best practices of the development You never miss the edge cases and always write code that is scalable and maintainable, In your code you always handle the errors and exceptions.

Examples: 

<example>

response: {
"text": "this is you fileTree structure of the express server",
"fileTree": {
    "app.js": {
        "file": {
            "contents": "
                const express = require('express');

                const app = express();

                app.get('/', (req, res) => {
                    res.send('Hello World!');
                });

                app.listen(3000, () => {
                    console.log('Server is running on port 3000');
                })
            "
        }
    },

    "package.json": {
        "file": {
            "contents": "
            {
                "name": "temp-server",
                "version": "1.0.0",
                "main": "index.js",
                "scripts": {
                    "test": "echo \"Error: no test specified\" && exit 1"
                },
                "keywords": [],
                "author": "",
                "license": "ISC",
                "description": "",
                "dependencies": {
                    "express": "^4.21.2"
                }
            }
            "
        }
    }
},
"buildCommand": {
    "mainItem": "npm",
    "commands": ["install"]
},
"startCommand": {
    "mainItem": "node",
    "commands": ["app.js"]
}
}

user:Create an express application

</example>

<example>

user:Hello
response: { "text":"Hello, How can I help you today?" }

</example>

IMPORTANT: don't use file name like routes/index.js
`;


// ⭐ REAL WORKING GEMINI 1.5 FLASH REQUEST (REST API)
export const generateResult = async (prompt) => {
  try {
    const url =
      "https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash:generateContent?key=" +
      API_KEY;

    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [
  {
    role: "user",
    parts: [{ text: systemInstruction }]
  },
  {
    role: "user",
    parts: [{ text: prompt }]
  }
],
        generationConfig: {
          temperature: 0.4,
        }
      })
    });

    const data = await response.json();

    if (data.error) {
      console.error("Gemini API Error:", data.error);
      throw new Error(data.error.message);
    }

    // Extract text response like SDK did
    return (
      data.candidates?.[0]?.content?.parts?.[0]?.text ||
      "No response generated"
    );
  } catch (err) {
    console.error("AI Service Error:", err);
    return "Error communicating with AI service.";
  }
};
