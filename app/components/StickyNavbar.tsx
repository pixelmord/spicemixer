import { Link } from "@tanstack/react-router";
import { Button } from "./ui/button";
import { Unauthenticated, Authenticated } from "convex/react";
import { useAuthActions } from "@convex-dev/auth/react";
import { ModeToggle } from "./ModeToggle";

export function StickyNavbar() {
	const { signIn } = useAuthActions();
	return (
		<div className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur-sm supports-backdrop-filter:bg-background/60 dark:border-slate-800">
			<div className="container flex h-16 items-center justify-between mx-auto">
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
				<div className="flex items-center gap-4">
					<Unauthenticated>
						<Button onClick={() => void signIn("github")}>
							Sign in with GitHub
						</Button>
					</Unauthenticated>
					<Authenticated>Logged in</Authenticated>
					<ModeToggle />
				</div>
			</div>
		</div>
	);
}
