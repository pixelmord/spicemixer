import { v } from "convex/values";
import { Doc, Id } from "./_generated/dataModel";
import { internalMutation, mutation, query } from "./_generated/server";
import { updateRecipeSchema } from "./schema";

export const seed = internalMutation(async (ctx) => {
	const allRecipes = await ctx.db.query("recipes").collect();
	if (allRecipes.length > 0) {
		return;
	}
	await ctx.db.insert("recipes", {
		name: "Butterkuchen mit Mandeln",
		description:
			"Dieser köstliche Butterkuchen ist ein beliebter Blechkuchen-Klassiker ohne großen Aufwand. Durch den Sahneguss wird er besonders saftig.",
		author: "Kathrin",
		datePublished: "2023-02-12T07:54:00+00:00",
		image: [
			"https://www.backenmachtgluecklich.de/media/2018/03/Saftiger-Butterkuchen-wie-vom-Baecker-scaled.jpg",
			"https://www.backenmachtgluecklich.de/media/2018/03/Saftiger-Butterkuchen-wie-vom-Baecker-500x500.jpg",
			"https://www.backenmachtgluecklich.de/media/2018/03/Saftiger-Butterkuchen-wie-vom-Baecker-500x375.jpg",
			"https://www.backenmachtgluecklich.de/media/2018/03/Saftiger-Butterkuchen-wie-vom-Baecker-480x270.jpg",
		],
		prepTime: "PT15M",
		cookTime: "PT20M",
		totalTime: "PT35M",
		recipeYield: "1 Blech",
		recipeCategory: ["Dessert", "Baking"],
		recipeCuisine: ["German"],
		recipeIngredient: [
			"200 Milliliter Milch (lauwarm)",
			"1 Würfel frische Hefe",
			"70 Gramm Zucker",
			"500 Gramm Weizenmehl (am besten Type 550 bzw. Wiener Griessler)",
			"1 mittelgroßes Ei",
			"100 Gramm Butter (weich)",
			"1 Prise Salz",
			"150 Gramm Butter",
			"120 Gramm Zucker",
			"100 Gramm Mandelblättchen",
			"120 Milliliter Sahne",
		],
		recipeInstructions: [
			{
				type: "HowToStep",
				text: "Die Hefe in einen Becher mit lauwarmer Milch bröckeln. Einen Teelöffel vom Zucker hinzugeben und rühren, bis sich Zucker und Hefe aufgelöst haben. Das Mehl in eine Schüssel geben und in der Mitte eine Mulde eindrücken. Die Hefe-Milch-Mischung hineingießen. Den restlichen Zucker dazugeben und mit etwas Mehl in der Mulde verrühren. Schüssel mit einem Tuch bedecken und an einem warmen Ort für ca. 10 Minuten stehen lassen.",
				position: 1,
			},
			{
				type: "HowToStep",
				text: "Ei, weiche Butter und Salz hinzugeben. Den Teig mit der Küchenmaschine ca. 5 Minuten kneten, bis er glatt ist. Mit einem Tuch bedeckt an einem warmen Ort ca. 30 Minuten gehen lassen. Noch einmal kurz durchkneten und auf einem mit Backpapier belegten tiefen Blech ausrollen. Erneut 20 Minuten gehen lassen.",
				position: 2,
			},
			{
				type: "HowToStep",
				text: "Backofen auf 190 Grad Ober- und Unterhitze vorheizen. Mit einem Kochlöffelstiel kleine Vertiefungen bzw. Mulden in den gegangenen Teig drücken. Butter in Flöckchen auf dem Teig verteilen. Gleichmäßig mit Zucker und Mandeln bestreuen.",
				position: 3,
			},
			{
				type: "HowToStep",
				text: "Butterkuchen ca. 20 bis 25 Minuten goldgelb backen. Noch heiß mit flüssiger Sahne begießen. Am besten frisch gebacken servieren; der Kuchen lässt sich auch gut einfrieren.",
				position: 4,
			},
		],
		nutrition: {
			calories: "",
			proteinContent: "",
			fatContent: "",
			carbohydrateContent: "",
			servingSize: "",
		},
		keywords: ["Butterkuchen", "German Cake", "Almond Cake"],
		rating: 4.78,
		createdAt: "2024-01-17T00:00:00Z",
		updatedAt: "2024-01-17T00:00:00Z",
	});
});

// Create a new recipe
export const create = mutation({
	args: {
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
	},
	handler: async (ctx, args) => {
		const recipeId = await ctx.db.insert("recipes", {
			...args,
			datePublished: new Date().toISOString(),
			createdAt: new Date().toISOString(),
			updatedAt: new Date().toISOString(),
		});
		return recipeId;
	},
});

// Get a single recipe by ID
export const get = query({
	args: { id: v.id("recipes") },
	handler: async (ctx, args) => {
		return await ctx.db.get(args.id);
	},
});

// List all recipes with optional filtering and pagination
export const list = query({
	args: {
		category: v.optional(v.string()),
		cuisine: v.optional(v.string()),
		limit: v.optional(v.number()),
		cursor: v.optional(v.id("recipes")),
	},
	handler: async (ctx, args) => {
		const limit = args.limit ?? 10;

		if (args.category !== undefined) {
			const category = args.category;
			return await ctx.db
				.query("recipes")
				.withIndex("by_category")
				.filter((q) => q.eq(q.field("recipeCategory"), [category]))
				.order("desc")
				.take(limit);
		}

		if (args.cuisine !== undefined) {
			const cuisine = args.cuisine;
			return await ctx.db
				.query("recipes")
				.withIndex("by_cuisine")
				.filter((q) => q.eq(q.field("recipeCuisine"), [cuisine]))
				.order("desc")
				.take(limit);
		}

		return await ctx.db.query("recipes").order("desc").take(limit);
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
