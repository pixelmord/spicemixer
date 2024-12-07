import { Button } from "@/components/ui/button";

export function Blog() {
	return (
		<section className="py-12 px-8">
			<div className="max-w-6xl mx-auto">
				<h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">
					Our Blog
				</h2>
				<div className="grid grid-cols-1 md:grid-cols-2 gap-8">
					{[
						{
							title: "Inspiration for unique Soup",
							description:
								"We present a variety of unique soup from many countries.",
							image: "/images/soup-blog.jpg",
						},
						{
							title: "This salad is food for family",
							description:
								"Eating with your family is a tradition worth going for.",
							image: "/images/salad-blog.jpg",
						},
					].map((post) => (
						<div
							key={post.title}
							className="rounded-xl overflow-hidden shadow-lg bg-white dark:bg-gray-800"
						>
							<img
								src={post.image}
								alt={post.title}
								className="w-full h-64 object-cover"
							/>
							<div className="p-6">
								<h3 className="font-semibold text-xl mb-2 text-gray-900 dark:text-white">
									{post.title}
								</h3>
								<p className="text-gray-600 dark:text-gray-400 mb-4">
									{post.description}
								</p>
								<Button variant="link" className="dark:text-white">
									Read More
								</Button>
							</div>
						</div>
					))}
				</div>
			</div>
		</section>
	);
}
