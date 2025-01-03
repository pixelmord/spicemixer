import { Loader } from "@/components/Loader";

import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";

import { convexQuery } from "@convex-dev/react-query";
import { useSuspenseQuery } from "@tanstack/react-query";
import { Link, createFileRoute } from "@tanstack/react-router";
import { api } from "convex/_generated/api";

export const Route = createFileRoute("/recipes/")({
	component: Recipes,
	pendingComponent: () => <Loader />,
});

function Recipes() {
	const { data: recipes } = useSuspenseQuery(convexQuery(api.recipes.list, {}));

	return (
		<div className="container mx-auto py-8">
			<div className="flex justify-between items-center mb-8">
				<h1 className="text-4xl font-bold">Recipes</h1>
			</div>
			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
				{recipes.map(
					(recipe: {
						_id: string;
						name: string;
						description: string;
						image: string[];
						prepTime: string;
						cookTime: string;
						totalTime: string;
						recipeCategory: string[];
					}) => (
						<Card key={recipe._id}>
							{recipe.image && recipe.image.length > 0 && (
								<img
									src={recipe.image[0]}
									alt={recipe.name}
									className="w-full h-48 object-cover rounded-t-lg"
								/>
							)}
							<CardHeader>
								<CardTitle>{recipe.name}</CardTitle>
								<CardDescription>{recipe.description}</CardDescription>
							</CardHeader>
							<CardContent>
								<div className="flex gap-2 flex-wrap">
									{recipe.recipeCategory.map((category: string) => (
										<span
											key={category}
											className="bg-primary/10 text-primary px-2 py-1 rounded-full text-sm"
										>
											{category}
										</span>
									))}
								</div>
								<div className="mt-4 text-sm text-muted-foreground">
									<p>Prep time: {recipe.prepTime}</p>
									<p>Cook time: {recipe.cookTime}</p>
									<p>Total time: {recipe.totalTime}</p>
								</div>
							</CardContent>
							<CardFooter>
								<Link
									to="/recipes/$recipeId"
									params={{ recipeId: recipe._id }}
									className="text-primary hover:underline"
								>
									View Recipe →
								</Link>
							</CardFooter>
						</Card>
					),
				)}
			</div>
		</div>
	);
}
