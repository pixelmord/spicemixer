"use node";
import { LLMService } from "./llm";
import { RekognitionService } from "./rekognition";
import { ImageUtil } from "../utils/image";
import { createAIService } from "../factories/aiService";
import type { z } from "zod";
import type { IAIService } from "../types";
import { recipeFormSchema } from "../db/recipeSchema";

const rekognitionService = new RekognitionService();

// Use the factory function to create the aiService instance
const aiService: IAIService = createAIService();
const llmService = new LLMService(aiService);

/**
 *
 * @param imageData
 * @param prompt
 * @param schema
 * @returns
 */
async function detectAndProcessImage<T>(
	imageData: Buffer,
	prompt: string,
	schema: z.ZodType<T>,
) {
	try {
		const areaOfInterest =
			await rekognitionService.findTextAreaOfInterest(imageData);
		const processedImage = await ImageUtil.extractAndProcessImage(
			areaOfInterest,
			imageData,
		);
		return llmService.imageToJSON<T>(processedImage, prompt, schema);
	} catch (error) {
		console.error("Error detecting labels:", error);
	}
}

export async function extractRecipeFromImage(file: ArrayBuffer) {
	// Example usage
	//create a base64 buffer from file
	const fileBuffer = Buffer.from(file);

	// example cooking recipe prompt
	const prompt =
		"Please analyze this scanned image of a cooking recipe and return a JSON object " +
		"matching the schema of a ld+json Recipe schema.";

	// pass example image data, prompt, and schema to the detectAndProcessImage function
	const output = await detectAndProcessImage<z.infer<typeof recipeFormSchema>>(
		fileBuffer,
		prompt,
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
