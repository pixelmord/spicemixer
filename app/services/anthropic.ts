import Anthropic from "@anthropic-ai/sdk";
import type { LLMResponse, IAIService, ImageMediaType } from "../types";
import type { z } from "zod";
import type { TextBlock } from "@anthropic-ai/sdk/resources/index.mjs";
import { parseJsonFromTextBlock } from "@/utils/json-parser";
import { JsonObject } from "type-fest";

const MAX_TOKENS = 2048;
const DEFAULT_TEMPERATURE = 0;
const DEFAULT_ANTHROPIC_MODEL_NAME = "claude-3-sonnet-20240229";

export class AnthropicService implements IAIService {
	private aiService: Anthropic;
	private modelName: string;

	constructor(modelName?: string, anthropic?: Anthropic) {
		if (!process.env.ANTHROPIC_API_KEY && !import.meta.env.ANTHROPIC_API_KEY) {
			throw new Error("No valid API key found for Anthropic.");
		}
		this.aiService =
			anthropic ??
			new Anthropic({
				apiKey:
					process.env.ANTHROPIC_API_KEY || import.meta.env.ANTHROPIC_API_KEY,
			});
		this.modelName = modelName ?? DEFAULT_ANTHROPIC_MODEL_NAME;
	}

	/**
	 *
	 * @param imageBase64
	 * @param prompt
	 * @param schema
	 * @param imageMediaType
	 * @returns
	 */
	async imageToJSON<T>(
		imageBase64: string,
		prompt: string,
		schema: z.ZodType<T>,
		imageMediaType: ImageMediaType,
	): Promise<LLMResponse<T>> {
		const msg = await this.aiService.messages.create({
			model: this.modelName,
			max_tokens: MAX_TOKENS,
			temperature: DEFAULT_TEMPERATURE,
			messages: [
				{
					role: "user",
					content: [
						{
							type: "image",
							source: {
								type: "base64",
								media_type: imageMediaType,
								data: imageBase64,
							},
						},
						{
							type: "text",
							text: prompt,
						},
					],
				},
			],
		});

		// Assuming a similar formatResponse method exists or is adapted for this class
		return this.formatResponse<T>(msg, schema);
	}

	/**
	 *
	 * @param msg
	 * @param schema
	 * @returns
	 */
	async processText<T>(
		text: string,
		prompt: string,
		schema: z.ZodType<T>,
	): Promise<LLMResponse<T>> {
		const msg = await this.aiService.messages.create({
			model: this.modelName,
			max_tokens: MAX_TOKENS,
			temperature: DEFAULT_TEMPERATURE,
			messages: [
				{
					role: "user",
					content: [
						{
							type: "text",
							text: `${prompt}\n\n${text}`,
						},
					],
				},

				// {
				// 	role: "assistant",
				// 	content: "Here is the JSON requested:\n{",
				// },
			],
		});
		console.log(msg);
		return this.formatResponse<T>(msg, schema);
	}

	private formatResponse<T>(
		msg: Anthropic.Messages.Message,
		schema: z.ZodType<T>,
	): LLMResponse<T> {
		const json = parseJsonFromTextBlock(msg.content[0] as TextBlock);
		console.log(json);
		// Implementation similar to the one in LLMService
		const result = schema.parse(json);
		return {
			result,
			id: msg.id,
			role: msg.role,
			usage: {
				input_tokens: msg.usage?.input_tokens,
				output_tokens: msg.usage?.output_tokens,
			},
		};
	}
}
