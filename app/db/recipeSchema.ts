import { z } from "zod";

export const recipeInstructionSchema = z.object({
	type: z.literal("HowToStep"),
	text: z.string().min(1, "Instruction text is required"),
	position: z.number(),
});

export const nutritionSchema = z.object({
	calories: z.coerce.string().optional(),
	proteinContent: z.string().optional(),
	fatContent: z.string().optional(),
	carbohydrateContent: z.string().optional(),
	servingSize: z.string().optional(),
});

export const recipeFormSchema = z.object({
	name: z.string().min(1, "Recipe name is required"),
	description: z.string().min(1, "Description is required"),
	author: z.string().min(1, "Author is required"),
	image: z.array(z.string()),
	prepTime: z.string().min(1, "Prep time is required"),
	cookTime: z.string().min(1, "Cook time is required"),
	totalTime: z.string().min(1, "Total time is required"),
	recipeYield: z.string().min(1, "Recipe yield is required"),
	recipeCategory: z
		.array(z.string())
		.min(1, "At least one category is required"),
	recipeCuisine: z.array(z.string()).min(1, "At least one cuisine is required"),
	recipeIngredient: z
		.array(z.string())
		.min(1, "At least one ingredient is required"),
	recipeInstructions: z
		.array(recipeInstructionSchema)
		.min(1, "At least one instruction is required"),
	nutrition: nutritionSchema,
	keywords: z.array(z.string()),
	suitableForDiet: z.array(z.string()).optional(),
	difficulty: z.string().optional(),
	rating: z.number().min(0).max(5).optional(),
});

export type RecipeFormData = z.infer<typeof recipeFormSchema>;
