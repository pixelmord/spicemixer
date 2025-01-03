import { recipeFormSchema } from "@/db/recipeSchema";
import { createAIService } from "@/factories/aiService";
import type { IAIService } from "@/types";
import type { z } from "zod";
import { LLMService } from "./llm";

// Use the factory function to create the aiService instance
const aiService: IAIService = createAIService();
const llmService = new LLMService(aiService);

export async function convertMarkdownToRecipe(markdown: string) {
	const output = await llmService.processText<z.infer<typeof recipeFormSchema>>(
		markdown,
		"Convert this markdown cooking recipe to a structured recipe format in ld+json Recipe schema",
		recipeFormSchema,
	);
	console.group("Output Details");
	console.log("Result:", output?.result);
	console.log("Message ID:", output?.id);
	console.log("Message Role:", output?.role);
	console.log("Message Usage:", output?.usage);
	console.groupEnd();
	return output?.result;
}
