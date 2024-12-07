import { Button } from "@/components/ui/button";

export function Hero() {
	return (
		<section className="bg-[#2A303C] dark:bg-gray-900 text-white px-8 py-16 rounded-b-3xl relative">
			<div className="max-w-6xl mx-auto flex items-center justify-between">
				<div className="max-w-xl">
					<h1 className="text-5xl font-bold mb-4">
						Discover Simple, Delicious, And{" "}
						<span className="text-[#FF6B6B]">Fast Recipes!!</span>
					</h1>
					<p className="text-gray-300 mb-8">
						Start your cooking journey with the finest recipes curated just for
						you.
					</p>
					<Button variant="default">
						Start Here
						<svg
							className="w-4 h-4"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
							role="img"
						>
							<title>Navigate to recipes</title>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth="2"
								d="M9 5l7 7-7 7"
							/>
						</svg>
					</Button>
				</div>
				<div className="hidden lg:block">
					<img
						src="/images/chef.png"
						alt="Professional chef holding a plate"
						className="w-96"
					/>
				</div>
			</div>
		</section>
	);
}
