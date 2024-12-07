import { Button } from "@/components/ui/button";

export function AppDownload() {
	return (
		<section className="py-12 px-8 bg-pink-50 dark:bg-gray-800">
			<div className="max-w-6xl mx-auto flex items-center justify-between">
				<div className="max-w-xl">
					<h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">
						Download Our App
					</h2>
					<p className="text-gray-600 dark:text-gray-400 mb-8">
						Get the best recipes right on your phone and discover great cooking
						experiences.
					</p>
					<div className="flex gap-4">
						<Button
							variant="default"
							className="bg-black hover:bg-black/90 gap-2 dark:bg-gray-900 dark:hover:bg-gray-900/90"
						>
							<img
								src="/images/google-play.svg"
								alt="Google Play Store icon"
								className="w-6 h-6"
							/>
							Google Play
						</Button>
						<Button
							variant="default"
							className="bg-black hover:bg-black/90 gap-2 dark:bg-gray-900 dark:hover:bg-gray-900/90"
						>
							<img
								src="/images/app-store.svg"
								alt="Apple App Store icon"
								className="w-6 h-6"
							/>
							App Store
						</Button>
					</div>
				</div>
				<div className="hidden lg:block">
					<img
						src="/images/app-mockup.png"
						alt="Mobile app interface mockup"
						className="w-96"
					/>
				</div>
			</div>
		</section>
	);
}
