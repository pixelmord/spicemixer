export function Footer() {
	return (
		<footer className="bg-[#2A303C] dark:bg-gray-900 text-white py-12 px-8">
			<div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
				<div>
					<img src="/images/logo.svg" alt="Website logo" className="h-8 mb-4" />
					<p className="text-gray-400">
						Your trusted source of unique recipe from around the world.
					</p>
				</div>
				<div>
					<h3 className="font-semibold mb-4">Companies</h3>
					<ul className="space-y-2 text-gray-400">
						<li>How We Work</li>
						<li>Terms of Service</li>
						<li>Pricing</li>
						<li>FAQ</li>
					</ul>
				</div>
				<div>
					<h3 className="font-semibold mb-4">Quick Links</h3>
					<ul className="space-y-2 text-gray-400">
						<li>About Us</li>
						<li>Blog Post</li>
						<li>Privacy Policy</li>
					</ul>
				</div>
				<div>
					<h3 className="font-semibold mb-4">Get in Touch</h3>
					<p className="text-gray-400">support@gmail.com</p>
				</div>
			</div>
		</footer>
	);
}
