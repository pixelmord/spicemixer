import * as cheerio from "cheerio";
import { filter } from "convex-helpers/server/filter";
import { v } from "convex/values";
import type { JsonObject } from "type-fest";
import { z } from "zod";
import {
	type RecipeFormData,
	recipeFormSchema,
	type recipeInstructionSchema,
} from "./../app/db/recipeSchema";
import { api } from "./_generated/api";
import { action, internalMutation, mutation, query } from "./_generated/server";
import { updateRecipeSchema } from "./schema";
import { convertMarkdownToRecipe } from "../app/services/recipe-conversion";

const createRecipeArgs = {
	name: v.string(),
	description: v.string(),
	author: v.string(),
	image: v.array(v.string()),
	prepTime: v.string(),
	cookTime: v.string(),
	totalTime: v.string(),
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
};
export const seed = internalMutation(async (ctx) => {
	const allRecipes = await ctx.db.query("recipes").collect();
	if (allRecipes.length > 0) {
		return;
	}

	const recipes = [
		await import("../app/recipes/butterkuchen.json"),
		await import("../app/recipes/mango-chutney.json"),
		await import("../app/recipes/sueddeutsche-gebundene-zwiebelsuppe.json"),
		await import("../app/recipes/tandoori.json"),
		await import("../app/recipes/thaisuppe.json"),
		await import("../app/recipes/ungarische-gulaschsuppe.json"),
	];

	for (const recipe of recipes) {
		const validatedData = parseRecipeJson(recipe.default);
		await ctx.db.insert("recipes", {
			...validatedData,
			datePublished: new Date("2024-01-17T00:00:00Z").toISOString(),
			createdAt: new Date("2024-01-17T00:00:00Z").toISOString(),
			updatedAt: new Date("2024-01-17T00:00:00Z").toISOString(),
		});
	}
});

// Internal mutation for creating a recipe
export const createRecipe = mutation({
	args: createRecipeArgs,
	handler: async (ctx, args) => {
		const id = await ctx.db.insert("recipes", {
			...args,
			datePublished: new Date().toISOString(),
			createdAt: new Date().toISOString(),
			updatedAt: new Date().toISOString(),
		});
		return { id };
	},
});

// Action for creating a recipe
export const createRecipeFromMarkdown = action({
	args: {
		text: v.string(),
	},
	handler: async (ctx, args) => {
		const recipeData = await convertMarkdownToRecipe(args.text);
		await ctx.runMutation(api.recipes.createRecipe, recipeData);
	},
});

// Get a single recipe by ID
export const get = query({
	args: { id: v.id("recipes") },
	handler: async (ctx, args) => {
		return await ctx.db.get(args.id);
	},
});

// List recent recipes with optional category filtering
export const list = query({
	args: {
		category: v.optional(v.string()),
		cuisine: v.optional(v.string()),
		limit: v.optional(v.number()),
		cursor: v.optional(v.id("recipes")),
	},
	handler: (ctx, args) => {
		const limit = args.limit ?? 10;

		if (args.category !== undefined) {
			const category = args.category;
			return filter(ctx.db.query("recipes"), (recipe) =>
				recipe.recipeCategory?.includes(category),
			)
				.order("desc")
				.take(limit);
		}

		if (args.cuisine !== undefined) {
			const cuisine = args.cuisine;
			return filter(ctx.db.query("recipes"), (recipe) =>
				recipe.recipeCuisine?.includes(cuisine),
			)
				.order("desc")
				.take(limit);
		}

		return ctx.db.query("recipes").order("desc").take(limit);
	},
});

// Get top 5 most used recipe categories
export const getCategories = query({
	args: {},
	handler: async (ctx) => {
		const recipes = await ctx.db.query("recipes").collect();
		const categoryCount = new Map<string, number>();
		categoryCount.set("All", recipes.length); // All category counts all recipes

		for (const recipe of recipes) {
			if (recipe.recipeCategory) {
				for (const category of recipe.recipeCategory) {
					categoryCount.set(category, (categoryCount.get(category) ?? 0) + 1);
				}
			}
		}

		// Convert to array, sort by count, and take top 5
		return Array.from(categoryCount.entries())
			.sort((a, b) => b[1] - a[1])
			.slice(0, 5)
			.map(([category]) => category);
	},
});

// Get all unique recipe categories
export const getAllCategories = query({
	args: {},
	handler: async (ctx) => {
		const recipes = await ctx.db.query("recipes").collect();
		const categories = new Set<string>();
		categories.add("All"); // Always include "All" category

		for (const recipe of recipes) {
			if (recipe.recipeCategory) {
				for (const category of recipe.recipeCategory) {
					categories.add(category);
				}
			}
		}

		return Array.from(categories).sort();
	},
});

// Update a recipe
export const updateRecipe = mutation({
	args: updateRecipeSchema,
	handler: async (ctx, args) => {
		const { id, ...updates } = args;
		const existing = await ctx.db.get(id);

		if (!existing) {
			throw new Error("Recipe not found");
		}

		await ctx.db.patch(id, {
			...updates,
			updatedAt: new Date().toISOString(),
		});
	},
});

// Delete a recipe
export const remove = mutation({
	args: { id: v.id("recipes") },
	handler: async (ctx, args) => {
		const existing = await ctx.db.get(args.id);

		if (!existing) {
			throw new Error("Recipe not found");
		}

		await ctx.db.delete(args.id);
	},
});

// Search recipes by keywords
export const search = query({
	args: {
		keyword: v.string(),
		limit: v.optional(v.number()),
	},
	handler: async (ctx, args) => {
		const limit = args.limit ?? 10;
		return await ctx.db
			.query("recipes")
			.withIndex("by_category")
			.filter((q) => q.eq(q.field("keywords"), [args.keyword]))
			.order("desc")
			.take(limit);
	},
});

// Get top rated recipes
export const getTopRated = query({
	args: {
		limit: v.optional(v.number()),
	},
	handler: async (ctx, args) => {
		const limit = args.limit ?? 10;
		return await ctx.db
			.query("recipes")
			.withIndex("by_rating")
			.order("desc")
			.take(limit);
	},
});

export function parseRecipeJson(jsonContent: JsonObject): RecipeFormData {
	// Handle both single objects and arrays of objects
	const items =
		"@graph" in jsonContent && Array.isArray(jsonContent["@graph"])
			? jsonContent["@graph"]
			: Array.isArray(jsonContent)
				? jsonContent
				: [jsonContent];

	for (const item of items) {
		if (item["@type"] === "Recipe") {
			// Transform the LD+JSON recipe data to match RecipeFormData structure
			const recipeData: RecipeFormData = {
				name: item.name || "",
				description: item.description || "",
				author: item.author?.name || "Unknown",
				image: Array.isArray(item.image) ? item.image : [item.image || ""],
				prepTime: item.prepTime || "PT0M",
				cookTime: item.cookTime || "PT0M",
				totalTime: item.totalTime || "PT0M",
				recipeYield: item.recipeYield?.toString() || "1 serving",
				recipeCategory: Array.isArray(item.recipeCategory)
					? item.recipeCategory
					: [item.recipeCategory || "Other"],
				recipeCuisine: Array.isArray(item.recipeCuisine)
					? item.recipeCuisine
					: [item.recipeCuisine || "Other"],
				recipeIngredient: Array.isArray(item.recipeIngredient)
					? item.recipeIngredient
					: [item.recipeIngredient || ""],
				recipeInstructions: Array.isArray(item.recipeInstructions)
					? item.recipeInstructions.map(
							(
								instruction: z.infer<typeof recipeInstructionSchema> | string,
								index: number,
							) => ({
								type: "HowToStep",
								text:
									typeof instruction === "string"
										? instruction
										: instruction.text || "",
								position: index + 1,
							}),
						)
					: [
							{
								type: "HowToStep",
								text: item.recipeInstructions?.toString() || "",
								position: 1,
							},
						],
				nutrition: {
					calories: item.nutrition?.calories || undefined,
					proteinContent: item.nutrition?.proteinContent || undefined,
					fatContent: item.nutrition?.fatContent || undefined,
					carbohydrateContent: item.nutrition?.carbohydrateContent || undefined,
					servingSize: item.nutrition?.servingSize || undefined,
				},
				keywords: Array.isArray(item.keywords)
					? item.keywords
					: item.keywords?.split(",").map((k: string) => k.trim()) || [],
				suitableForDiet: Array.isArray(item.suitableForDiet)
					? item.suitableForDiet
					: item.suitableForDiet
						? [item.suitableForDiet]
						: [],
				difficulty: "medium", // Default value
				rating: undefined,
			};
			return recipeFormSchema.parse(recipeData);
		}
	}
	throw new Error("No valid Recipe data found in JSON content");
}

export const createRecipefromUrl = action({
	args: { url: v.string() },
	handler: async (ctx, args) => {
		console.log(args.url);
		try {
			const response = await fetch(args.url);
			console.log(response);
			if (!response.ok) {
				throw new Error(
					`Failed to fetch URL: ${response.status} ${response.statusText}`,
				);
			}

			const html = await response.text();
			const $ = cheerio.load(html);

			// Find all script tags with type application/ld+json
			const jsonLdScripts = $('script[type="application/ld+json"]');
			console.log(jsonLdScripts);
			// Look through all ld+json scripts for Recipe schema
			let validatedData: Partial<RecipeFormData> | null = null;

			jsonLdScripts.each((_, element) => {
				try {
					const content = $(element).html();
					if (!content) return;

					const jsonContent = JSON.parse(content);

					validatedData = parseRecipeJson(jsonContent);
				} catch (e) {
					console.error("Error parsing JSON-LD script:", e);
				}
			});

			if (!validatedData) {
				throw new Error("No Recipe schema found in the page");
			}

			await ctx.runMutation(api.recipes.createRecipe, validatedData);
		} catch (error) {
			if (error instanceof z.ZodError) {
				throw new Error(`Invalid recipe data: ${error.message}`);
			}
			throw new Error("Failed to parse recipe");
		}
	},
});
