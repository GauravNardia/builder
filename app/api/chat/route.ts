import { client } from "@/lib/server/model";
import { getSystemPrompt } from "@/lib/server/prompt";

export async function GET(){
    return  Response.json({ message: "hello openAI" })
}

export async function POST(req: Request){
    const { messages } = await req.json();

    const stream = await client.responses.create({
        model: "gpt-4o",
        instructions: getSystemPrompt(),
        input: messages,
        max_output_tokens: 8000,
    });


    return new Response(JSON.stringify(stream.output_text), {
        headers: { 'Content-Type': 'application/json' },
        status: 200,
    });
}

