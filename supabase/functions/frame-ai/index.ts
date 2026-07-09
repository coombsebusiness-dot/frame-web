import OpenAI from "npm:openai@4";
import { createClient } from "npm:@supabase/supabase-js@2";

import { buildFrameContext } from "./context.ts";
import { buildCreatorContext } from "./creatorContext.ts";

const supabase = createClient(
  Deno.env.get("FRAME_SUPABASE_URL")!,
  Deno.env.get("FRAME_SERVICE_ROLE_KEY")!
);

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    let prompt = "Say hello to Leigh from Frame AI.";

    try {
      const body = await req.json();
      prompt = body?.prompt || prompt;
    } catch {}

    const apiKey = Deno.env.get("OPENAI_API_KEY");

   if (!apiKey) {
  throw new Error("Missing OPENAI_API_KEY secret");
}

const platformContext = await buildFrameContext(supabase);
const creatorContext = await buildCreatorContext(supabase);

const context = {
  platform: platformContext,
  creators: creatorContext,
};

console.log("CREATOR CONTEXT:");
console.log(JSON.stringify(creatorContext, null, 2));


const client = new OpenAI({ apiKey });

    const response = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content:
            "You are Frame AI, the operations assistant for Frame HQ. Be concise, helpful and focused on managing a creative community.",
        },
        {
  role: "user",
  content: `
FRAME HQ LIVE DATA

${JSON.stringify(context, null, 2)}

Administrator Question:

${prompt}

Use ONLY the supplied Frame HQ live data.
This includes platform statistics, creator lists, active posters and Golden Creator applications.
Never invent names, numbers or activity.
If a specific creator recommendation is not possible from the data, say what data is missing.
`,
},
      ],
    });

    return new Response(
      JSON.stringify({
        reply: response.choices[0]?.message?.content || "No reply returned.",
      }),
      {
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({
        error: String(error),
      }),
      {
        status: 500,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      }
    );
  }
});