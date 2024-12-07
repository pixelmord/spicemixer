import { convexQuery } from "@convex-dev/react-query";
import { useSuspenseQuery } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import { api } from "convex/_generated/api";
import type { Id } from "convex/_generated/dataModel";
import { ArrowLeft, Loader, Pencil } from "lucide-react";
import { Button } from "./ui/button";

export function Recipe({ recipeId }: { recipeId: string }) {
	const { data: recipe } = useSuspenseQuery(
		convexQuery(api.recipes.get, { id: recipeId as Id<"recipes"> }),
	);

	if (!recipe) {
		return <Loader />;
	}

	return (
		<div className="container mx-auto py-8">
			<div className="flex justify-between">
				<Button variant="ghost" asChild className="mb-8">
					<Link to="/recipes">
						<ArrowLeft className="mr-2 h-4 w-4" />
						Back to Recipes
					</Link>
				</Button>
				<Button variant="ghost" asChild className="mb-8">
					<Link to="/recipes/$recipeId/edit" params={{ recipeId }}>
						<Pencil className="mr-2 h-4 w-4" />
						Edit recipe
					</Link>
				</Button>
			</div>
			<div className="grid grid-cols-1 md:grid-cols-2 gap-8">
				<div>
					{recipe.image && recipe.image.length > 0 && (
						<img
							src={recipe.image[0]}
							alt={recipe.name}
							className="w-full rounded-lg object-cover"
						/>
					)}
				</div>

				<div>
					<h1 className="text-4xl font-bold mb-4">{recipe.name}</h1>
					<p className="text-muted-foreground mb-6">{recipe.description}</p>

					<div className="grid grid-cols-2 gap-4 mb-6">
						<div>
							<h3 className="font-semibold">Prep Time</h3>
							<p>{recipe.prepTime}</p>
						</div>
						<div>
							<h3 className="font-semibold">Cook Time</h3>
							<p>{recipe.cookTime}</p>
						</div>
						<div>
							<h3 className="font-semibold">Total Time</h3>
							<p>{recipe.totalTime}</p>
						</div>
						<div>
							<h3 className="font-semibold">Yield</h3>
							<p>{recipe.recipeYield}</p>
						</div>
					</div>

					<div className="mb-6">
						<h2 className="text-2xl font-bold mb-4">Ingredients</h2>
						<ul className="list-disc pl-6">
							{recipe.recipeIngredient.map((ingredient) => (
								<li key={`ingredient-${ingredient}`}>{ingredient}</li>
							))}
						</ul>
					</div>

					<div>
						<h2 className="text-2xl font-bold mb-4">Instructions</h2>
						<ol className="list-decimal pl-6">
							{recipe.recipeInstructions
								.sort((a, b) => a.position - b.position)
								.map((instruction) => (
									<li
										key={`instruction-${instruction.position}`}
										className="mb-2"
									>
										{instruction.text}
									</li>
								))}
						</ol>
					</div>

					{recipe.nutrition && (
						<div className="mt-8">
							<h2 className="text-2xl font-bold mb-4">Nutrition</h2>
							<div className="grid grid-cols-2 gap-4">
								{recipe.nutrition.calories && (
									<div>
										<h3 className="font-semibold">Calories</h3>
										<p>{recipe.nutrition.calories}</p>
									</div>
								)}
								{recipe.nutrition.proteinContent && (
									<div>
										<h3 className="font-semibold">Protein</h3>
										<p>{recipe.nutrition.proteinContent}</p>
									</div>
								)}
								{recipe.nutrition.fatContent && (
									<div>
										<h3 className="font-semibold">Fat</h3>
										<p>{recipe.nutrition.fatContent}</p>
									</div>
								)}
								{recipe.nutrition.carbohydrateContent && (
									<div>
										<h3 className="font-semibold">Carbohydrates</h3>
										<p>{recipe.nutrition.carbohydrateContent}</p>
									</div>
								)}
							</div>
						</div>
					)}
				</div>
			</div>
		</div>
	);
}
