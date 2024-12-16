import { Loader } from "@/components/Loader";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

import {
	convexQuery,
	useConvexAction,
	useConvexMutation,
} from "@convex-dev/react-query";
import { useMutation, useSuspenseQuery } from "@tanstack/react-query";
import { Link, createFileRoute } from "@tanstack/react-router";
import { api } from "convex/_generated/api";
import { useState } from "react";

export const Route = createFileRoute("/recipes/")({
	component: Recipes,
	pendingComponent: () => <Loader />,
});

function ImportRecipeDialog() {
	const [url, setUrl] = useState("");
	const { toast } = useToast();
	const [isOpen, setIsOpen] = useState(false);
	const importRecipe = useConvexAction(api.recipes.createRecipefromUrl);

	const handleImport = async () => {
		try {
			await importRecipe({ url });
			toast({
				title: "Recipe imported",
				description: "The recipe has been successfully imported.",
			});
			setUrl("");
			setIsOpen(false);
		} catch (error) {
			toast({
				title: "Error importing recipe",
				description:
					error instanceof Error ? error.message : "An error occurred",
				variant: "destructive",
			});
		}
	};

	return (
		<Dialog open={isOpen} onOpenChange={setIsOpen}>
			<DialogTrigger asChild>
				<Button variant="outline">Import Recipe from URL</Button>
			</DialogTrigger>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Import Recipe</DialogTitle>
					<DialogDescription>
						Enter the URL of a recipe to import it into your collection.
					</DialogDescription>
				</DialogHeader>
				<div className="grid gap-4 py-4">
					<div className="grid gap-2">
						<Label htmlFor="url">Recipe URL</Label>
						<Input
							id="url"
							value={url}
							onChange={(e) => setUrl(e.target.value)}
							placeholder="https://example.com/recipe"
						/>
					</div>
				</div>
				<div className="flex justify-end gap-2">
					<Button variant="outline" onClick={() => setIsOpen(false)}>
						Cancel
					</Button>
					<Button
						onClick={handleImport}
						disabled={!url || importRecipe.isPending}
					>
						{importRecipe.isPending ? "Importing..." : "Import"}
					</Button>
				</div>
			</DialogContent>
		</Dialog>
	);
}

function Recipes() {
	const { data: recipes } = useSuspenseQuery(convexQuery(api.recipes.list, {}));

	return (
		<div className="container mx-auto py-8">
			<div className="flex justify-between items-center mb-8">
				<h1 className="text-4xl font-bold">Recipes</h1>
				<ImportRecipeDialog />
			</div>
			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
				{recipes.map((recipe) => (
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
								{recipe.recipeCategory.map((category) => (
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
				))}
			</div>
		</div>
	);
}
