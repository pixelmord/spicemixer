export function Testimonial() {
	return (
		<section className="py-12 px-8">
			<div className="max-w-6xl mx-auto">
				<h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">
					What They Say
				</h2>
				<div className="bg-pink-50 dark:bg-gray-800 rounded-2xl p-8">
					<div className="flex gap-8 items-center">
						<img
							src="/images/chef-testimonial.jpg"
							alt="Professional chef giving testimonial"
							className="w-64 h-64 rounded-xl object-cover"
						/>
						<div>
							<blockquote className="text-xl italic mb-4 text-gray-900 dark:text-white">
								"Becoming a cook is my dream since I was little, and here I have
								found a way to make it happen."
							</blockquote>
							<cite className="font-semibold text-gray-900 dark:text-white">
								Brian Vermont
							</cite>
							<p className="text-gray-600 dark:text-gray-400">
								Professional Chef
							</p>
						</div>
					</div>
				</div>
			</div>
		</section>
	);
}
