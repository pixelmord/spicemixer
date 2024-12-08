import { defineSchema, defineTable } from "convex/server";
import { type Infer, v } from "convex/values";
import { authTables } from "@convex-dev/auth/server";

const schema = defineSchema({
	...authTables,
	recipes: defineTable({
		name: v.string(),
		description: v.string(),
		author: v.string(),
		datePublished: v.string(),
		image: v.array(v.string()),
		prepTime: v.string(), // ISO 8601 duration format
		cookTime: v.string(), // ISO 8601 duration format
		totalTime: v.string(), // ISO 8601 duration format
		recipeYield: v.string(),
		recipeCategory: v.array(v.string()),
		recipeCuisine: v.array(v.string()),
		recipeIngredient: v.array(v.string()),
		recipeInstructions: v.array(
			v.object({
				type: v.string(),
				text: v.string(),
				position: v.number(),
			}),
		),
		nutrition: v.object({
			calories: v.optional(v.string()),
			proteinContent: v.optional(v.string()),
			fatContent: v.optional(v.string()),
			carbohydrateContent: v.optional(v.string()),
			servingSize: v.optional(v.string()),
		}),
		keywords: v.array(v.string()),
		suitableForDiet: v.optional(v.array(v.string())),
		difficulty: v.optional(v.string()),
		rating: v.optional(v.number()),
		createdAt: v.string(),
		updatedAt: v.string(),
	})
		.index("by_category", ["recipeCategory"])
		.index("by_cuisine", ["recipeCuisine"])
		.index("by_date", ["datePublished"])
		.index("by_rating", ["rating"]),
});

export default schema;

const recipe = schema.tables.recipes.validator;

export const updateRecipeSchema = v.object({
	id: v.id("recipes"),
	name: v.optional(recipe.fields.name),
	description: v.optional(recipe.fields.description),
	image: v.optional(recipe.fields.image),
	prepTime: v.optional(recipe.fields.prepTime),
	cookTime: v.optional(recipe.fields.cookTime),
	totalTime: v.optional(recipe.fields.totalTime),
	recipeYield: v.optional(recipe.fields.recipeYield),
	recipeCategory: v.optional(recipe.fields.recipeCategory),
	recipeCuisine: v.optional(recipe.fields.recipeCuisine),
	recipeIngredient: v.optional(recipe.fields.recipeIngredient),
	recipeInstructions: v.optional(recipe.fields.recipeInstructions),
	nutrition: v.optional(recipe.fields.nutrition),
	keywords: v.optional(recipe.fields.keywords),
	suitableForDiet: recipe.fields.suitableForDiet,
	difficulty: v.optional(recipe.fields.difficulty),
	rating: v.optional(recipe.fields.rating),
	author: v.optional(recipe.fields.author),
	datePublished: v.optional(recipe.fields.datePublished),
});

export type Recipe = Infer<typeof recipe>;
