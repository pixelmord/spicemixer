import { cn } from "@/lib/utils";
import * as Tabs from "@radix-ui/react-tabs";
import { Link } from "@tanstack/react-router";
import { api } from "convex/_generated/api";
import { useQuery } from "convex/react";
import { useState } from "react";

export function RecipeCategories() {
	const [selectedCategory, setSelectedCategory] = useState("All");
	const recipes = useQuery(api.recipes.list, {
		category: selectedCategory === "All" ? undefined : selectedCategory,
		limit: 6,
	});
	const categories = useQuery(api.recipes.getCategories, {}) ?? ["All"];

	return (
		<section className="py-12 px-8">
			<div className="max-w-6xl mx-auto">
				<h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">
					Recipes
				</h2>

				<Tabs.Root
					defaultValue={categories[0]}
					className="w-full"
					onValueChange={setSelectedCategory}
				>
					<Tabs.List className="flex gap-4 mb-8">
						{categories.map((category) => (
							<Tabs.Trigger
								key={category}
								value={category}
								className={cn(
									"px-4 py-2 rounded-md font-medium transition-colors",
									"data-[state=active]:bg-destructive data-[state=active]:text-destructive-foreground",
									"data-[state=inactive]:bg-secondary data-[state=inactive]:text-secondary-foreground",
								)}
							>
								{category}
							</Tabs.Trigger>
						))}
					</Tabs.List>

					{categories.map((category) => (
						<Tabs.Content key={category} value={category}>
							<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
								{recipes
									?.filter((recipe) =>
										category === "All"
											? true
											: recipe.recipeCategory?.includes(category),
									)
									.map((recipe) => (
										<div
											key={recipe._id}
											className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden"
										>
											<img
												src={recipe.image?.[0] || "/placeholder-recipe.jpg"}
												alt={recipe.name}
												className="w-full h-48 object-cover"
											/>
											<div className="p-4">
												<h3 className="font-semibold text-lg text-gray-900 dark:text-white">
													<Link to={`/recipes/${recipe._id}`}>
														{recipe.name}
													</Link>
												</h3>
												<div className="flex items-center gap-2 mt-2">
													<div className="flex items-center text-yellow-500">
														{"★".repeat(4)}½
													</div>
													<span className="text-gray-500 dark:text-gray-400">
														•{" "}
														{recipe.totalTime
															? recipe.totalTime.replace("PT", "").toLowerCase()
															: "N/A"}
													</span>
												</div>
											</div>
										</div>
									))}
							</div>
						</Tabs.Content>
					))}
				</Tabs.Root>
			</div>
		</section>
	);
}
