import type { TextBlock } from "@anthropic-ai/sdk/resources/index.mjs";
import type { JsonObject } from "type-fest";

export function parseJsonFromTextBlock(block: TextBlock): JsonObject {
	if (block.type !== "text") {
		throw new Error('Input block must be of type "text"');
	}

	// Extract JSON content from markdown code block if present
	const jsonMatch = block.text.match(/```json\n([\s\S]*?)\n```/);
	if (!jsonMatch) {
		throw new Error("No JSON code block found in text");
	}

	try {
		return JSON.parse(jsonMatch[1]);
	} catch (error) {
		throw new Error(`Failed to parse JSON: ${(error as Error).message}`);
	}
}
