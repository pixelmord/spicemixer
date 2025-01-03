import { AnthropicService } from "../services/anthropic";
import { OpenAIService } from "../services/openai";
import type { IAIService } from "../types";

export function createAIService(): IAIService {
	if (process.env.ANTHROPIC_API_KEY || import.meta.env.ANTHROPIC_API_KEY) {
		return new AnthropicService();
	}
	if (process.env.OPENAI_API_KEY || import.meta.env.OPENAI_API_KEY) {
		return new OpenAIService();
	}
	throw new Error("No valid API key found for Anthropic or OpenAI.");
}
