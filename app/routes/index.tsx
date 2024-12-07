import { createFileRoute } from "@tanstack/react-router";
import { AppDownload } from "@/components/pages/home/AppDownload";
import { Blog } from "@/components/pages/home/Blog";
import { Hero } from "@/components/pages/home/Hero";
import { RecipeCategories } from "@/components/pages/home/RecipeCategories";
import { Testimonial } from "@/components/pages/home/Testimonial";
import { TrendingRecipes } from "@/components/pages/home/TrendingRecipes";

export const Route = createFileRoute("/")({
	component: Home,
});

function Home() {
	return (
		<div className="min-h-screen bg-white dark:bg-gray-900">
			<Hero />
			<RecipeCategories />
			<TrendingRecipes />
			<Testimonial />
			<Blog />
			<AppDownload />
		</div>
	);
}
