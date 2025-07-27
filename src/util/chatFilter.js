import { env } from "../config.js"
import logger from "./logger.js";

// Chatgpt suggests using llama-3.3-70b-instruct-fp8 (which Vultr has available.)
const model = 'llama-3.3-70b-instruct-fp8'

const systemPrompt = `
You are a content moderation assistant for a live chat application. Your job is to evaluate messages for violations of community standards. You must prioritize user freedom and natural conversation, while still filtering clearly harmful or disruptive content.

Respond ONLY with a valid JSON object in this format:

{
  "allowed": boolean,
  "reason": string (if not allowed),
  "category": string (if not allowed — one of: "toxicity", "spam", "harassment", "profanity", "off-topic", "personal info", "other")
}

Moderation rules:

1. DO NOT ALLOW:
   - Hate speech, serious threats, or repeated personal attacks
   - Profanity when used aggressively or abusively
   - Obvious spam or advertising

2. ALLOW:
   - Casual or ambiguous phrases unless they are clearly offensive
   - Flirting, jokes, or playful comments unless they cross into harassment
   - Mild profanity when not targeted or aggressive
   - Requests, compliments, or curiosity (e.g. "I want your avatar") unless repeated to annoy

You must avoid false positives. Do not flag borderline or subjective content unless it is clearly inappropriate.

Here is the user message:

`

function stripCodeBlock(text) {
    // Remove triple backticks and optional "json" label, plus surrounding whitespace
    return text.replace(/^```json?\n/, '').replace(/\n```$/, '').trim();
}


export async function moderate(message) {
    const payload = {
        model,
        stream: false,
        messages: [
            {
                role: 'system',
                content: systemPrompt
            },
            {
                role: 'user',
                content: message
            }
        ]
    };

    try {
        const res = await fetch(`https://api.vultrinference.com/v1/chat/completions`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${env.INFERENCE_API_KEY}`,
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload),
        });

        if (!res.ok) {
            const errorText = await res.text();
            throw new Error(`Moderation request failed: ${res.status} ${res.statusText} — ${errorText}`);
        }

        const json = await res.json();

        const content = json.choices?.[0]?.message?.content;
        if (!content) {
            throw new Error('Missing message content in LLM response');
        }


        // Strip markdown code block before parsing JSON
        const stripped = stripCodeBlock(content);


        // Attempt to parse the LLM's response as JSON
        try {
            const parsed = JSON.parse(stripped);
            return parsed;
        } catch (parseError) {
            throw new Error('Failed to parse JSON from LLM response:\n' + content);
        }

    } catch (error) {
        logger.error('[Moderation Error]', error);
        return null;
    }
}




