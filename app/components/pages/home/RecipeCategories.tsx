import { Button } from "@/components/ui/button";

export function RecipeCategories() {
	return (
		<section className="py-12 px-8">
			<div className="max-w-6xl mx-auto">
				<h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">
					Recipes
				</h2>
				<div className="flex gap-4 mb-8">
					<Button variant="destructive">All</Button>
					<Button variant="secondary">Dessert</Button>
					<Button variant="secondary">Salad</Button>
					<Button variant="secondary">Main</Button>
				</div>

				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
					{[
						{
							name: "Avocado Salad",
							rating: 4.5,
							time: "15-20 min",
							image: "/images/avocado-salad.jpg",
						},
						{
							name: "Nourish Bowl",
							rating: 4.8,
							time: "15-20 min",
							image: "/images/nourish-bowl.jpg",
						},
					].map((recipe) => (
						<div
							key={recipe.name}
							className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden"
						>
							<img
								src={recipe.image}
								alt={recipe.name}
								className="w-full h-48 object-cover"
							/>
							<div className="p-4">
								<h3 className="font-semibold text-lg text-gray-900 dark:text-white">
									{recipe.name}
								</h3>
								<div className="flex items-center gap-2 mt-2">
									<div className="flex items-center text-yellow-500">
										{"★".repeat(Math.floor(recipe.rating))}
										{recipe.rating % 1 !== 0 && "½"}
									</div>
									<span className="text-gray-500 dark:text-gray-400">
										• {recipe.time}
									</span>
								</div>
							</div>
						</div>
					))}
				</div>
			</div>
		</section>
	);
}
