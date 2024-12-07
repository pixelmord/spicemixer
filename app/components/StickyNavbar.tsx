import { Link } from "@tanstack/react-router";
import { Button } from "./ui/button";

export function StickyNavbar() {


	return (
		<div className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur-sm supports-backdrop-filter:bg-background/60 dark:border-slate-800">
			<div className="container flex h-16 items-center justify-between px-4">
				<div className="flex items-center gap-6">
					<Link to="/" className="flex items-center space-x-2">
						<span className="font-bold text-xl">SpiceMixer</span>
					</Link>

					<nav className="flex items-center gap-4">
						<Link
							to="/"
							className="text-sm font-medium transition-colors hover:text-primary"
						>
							Home
						</Link>
						<Link
							to="/recipes"
							className="text-sm font-medium transition-colors hover:text-primary"
						>
							Recipes
						</Link>
						<Link
							to="/recipes/$recipeId"
							params={{ recipeId: "jh7fxr092fh26vmas88jwjv481756wpv" }}
							className="text-sm font-medium transition-colors hover:text-primary"
						>
							Recipes 1
						</Link>
					</nav>
				</div>

				{/* <Button
					variant="ghost"
					size="icon"
					onClick={toggleTheme}
					className="h-9 w-9"
				>
					{theme === "dark" ? (
						<svg
							xmlns="http://www.w3.org/2000/svg"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							className="h-5 w-5"
							aria-labelledby="sun-icon-title"
						>
							<title id="sun-icon-title">Switch to light mode</title>
							<circle cx="12" cy="12" r="4" />
							<path d="M12 2v2" />
							<path d="M12 20v2" />
							<path d="m4.93 4.93 1.41 1.41" />
							<path d="m17.66 17.66 1.41 1.41" />
							<path d="M2 12h2" />
							<path d="M20 12h2" />
							<path d="m6.34 17.66-1.41 1.41" />
							<path d="m19.07 4.93-1.41 1.41" />
						</svg>
					) : (
						<svg
							xmlns="http://www.w3.org/2000/svg"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							className="h-5 w-5"
							aria-labelledby="moon-icon-title"
						>
							<title id="moon-icon-title">Switch to dark mode</title>
							<path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
						</svg>
					)}
					<span className="sr-only">Toggle theme</span>
				</Button> */}
			</div>
		</div>
	);
}
