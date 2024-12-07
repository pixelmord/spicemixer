export function TrendingRecipes() {
	return (
		<section className="py-12 px-8 bg-gray-50 dark:bg-gray-800">
			<div className="max-w-6xl mx-auto">
				<h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">
					Trending Recipes
				</h2>
				<div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
					{[
						"Dinner Prep",
						"Angel Food Cake",
						"Chinese Noodles",
						"Tomato Cucumber Salad",
						"Handmade Rice",
					].map((recipe) => (
						<div
							key={recipe}
							className="relative rounded-xl overflow-hidden group"
						>
							<img
								src={`/images/${recipe.toLowerCase().replace(/\s+/g, "-")}.jpg`}
								alt={recipe}
								className="w-full h-64 object-cover"
							/>
							<div className="absolute inset-0 bg-black bg-opacity-40 flex items-end p-4">
								<h3 className="text-white font-semibold">{recipe}</h3>
							</div>
						</div>
					))}
				</div>
			</div>
		</section>
	);
}
