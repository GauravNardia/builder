import { client } from "@/lib/server/model";
import { BASE_PROMPT } from "@/lib/server/prompt";
import {basePrompt as reactBasePrompt} from "@/lib/server/react"
import {basePrompt as nodeBasePrompt} from "@/lib/server/node"


export async function GET(){
    return  Response.json({ message: "hello Template" })
 }


 export async function POST(req: Request) {
    const { prompt } = await req.json();
    
    const stream = await client.responses.create({
        model: "gpt-4o",
        max_output_tokens: 200,
        input: [
            {
                role: "user",
                content: prompt,
            },
            {
                role: "assistant",
                content: "Return either node or react based on what do you think this project should be. Only return a single word either 'node' or 'react'. Do not return anything extra",
            },
        ],
    });

    const answer = stream.output_text;
    let response;

    if (answer === "react") {
        response = new Response(JSON.stringify({ 
            prompts: [
                BASE_PROMPT, 
                `Here is an artifact that contains all files of the project visible to you.\nConsider the contents of ALL files in the project.\n\n${reactBasePrompt}\n\nHere is a list of files that exist on the file system but are not being shown to you:\n\n  - .gitignore\n  - package-lock.json\n`
            ],
            uiPrompts: [reactBasePrompt]
        }));
    } else if (answer === "node") {
        response = new Response(JSON.stringify({ 
            prompts: [
                `Here is an artifact that contains all files of the project visible to you.\nConsider the contents of ALL files in the project.\n\n${nodeBasePrompt}\n\nHere is a list of files that exist on the file system but are not being shown to you:\n\n  - .gitignore\n  - package-lock.json\n`
            ],
            uiPrompts: [nodeBasePrompt]
        }));
    } else {
        response = new Response(JSON.stringify({
            message: "You can access this",
            status: 403
        }));
    }

     const clonedResponse = response.clone();
 
    return response;
}
