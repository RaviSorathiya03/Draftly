import express from 'express';
const app = express();
import Anthropic from "@anthropic-ai/sdk";
import { BASE_PROMPT, getSystemPrompt } from './prompts.js';
import { basePrompt as ReactBasePrompt } from './default/react.js';
import { basePrompt as nodeBasePrompt } from './default/node.js';
import cors from "cors";
import 'dotenv/config';
console.log(process.env.ANTHROPIC_API_KEY);
const anthropic = new Anthropic({
    apiKey: process.env.ANTHROPIC_API_KEY
});
app.use(cors());
app.use(express.json());
app.post("/template", async (req, res) => {
    try {
        const body = await req.body;
        const prompt = body.prompt;
        const response = await anthropic.messages.create({
            messages: [{
                    role: 'user', content: prompt
                }],
            model: "claude-3-5-haiku-20241022",
            max_tokens: 100,
            system: "Return either node or react based on what do you think this project should be. Only return a single word either 'node' or 'react'. Do not return anything extra"
        });
        const answer = response.content[0].text;
        console.log(answer);
        if (answer == "react") {
            res.status(200).json({
                prompts: [BASE_PROMPT, `Here is an artifact that contains all files of the project visible to you.\nConsider the contents of ALL files in the project.\n\n${ReactBasePrompt}\n\nHere is a list of files that exist on the file system but are not being shown to you:\n\n  - .gitignore\n  - package-lock.json\n`],
                uiPrompt: [ReactBasePrompt]
            });
            return;
        }
        if (answer == "node") {
            res.status(200).json({
                prompts: [`Here is an artifact that contains all files of the project visible to you.\nConsider the contents of ALL files in the project.\n\n${ReactBasePrompt}\n\nHere is a list of files that exist on the file system but are not being shown to you:\n\n  - .gitignore\n  - package-lock.json\n`],
                uiPrompt: [nodeBasePrompt]
            });
            return;
        }
        res.status(403).json({
            message: "you can only create the node js and react application using this application"
        });
    }
    catch (error) {
        console.log(error);
        res.json({
            messsage: "Something went wrong",
            status: 500
        });
    }
});
app.post("/chat", async (req, res) => {
    try {
        const messages = req.body.messages;
        const response = anthropic.messages.stream({
            messages: messages,
            model: "claude-3-5-sonnet-20241022",
            max_tokens: 8000,
            system: getSystemPrompt()
        });
        console.log(response);
    }
    catch (error) {
        console.log(error);
        res.status(500).json({
            messge: "something went wrong"
        });
    }
});
app.listen(3000, () => {
    console.log("server is running on the port 8080");
});
// const msg = async()=>{
//    anthropic.messages.stream({
//     messages: [{role: "user", content: "hello"}],
//     model: 'claude-3-5-sonnet-20241022',
//     max_tokens: 1024
//    }).on('text', (text)=>{
//     console.log(text);
//    });
// }
// msg();
//# sourceMappingURL=index.js.map