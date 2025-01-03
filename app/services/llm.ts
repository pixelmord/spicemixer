import { ImageMediaType, type IAIService } from "../types";
import type { z } from "zod";

export class LLMService {
	private aiService: IAIService;

	constructor(aiService: IAIService) {
		this.aiService = aiService;
	}

	async imageToJSON<T>(
		imageBase64: string,
		prompt: string,
		schema: z.ZodType<T>,
		imageMediaType: ImageMediaType = ImageMediaType.JPEG,
	) {
		return this.aiService.imageToJSON(
			imageBase64,
			prompt,
			schema,
			imageMediaType,
		);
	}

	async processText<T>(text: string, prompt: string, schema: z.ZodType<T>) {
		return this.aiService.processText(text, prompt, schema);
	}
}
