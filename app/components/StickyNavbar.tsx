import { useAuthActions } from "@convex-dev/auth/react";
import { Link } from "@tanstack/react-router";
import { Authenticated, Unauthenticated } from "convex/react";
import { ModeToggle } from "./ModeToggle";
import { Button } from "./ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "./ui/dialog";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { useToast } from "../hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Textarea } from "./ui/textarea";
import { useConvexAction, useConvexMutation } from "@convex-dev/react-query";
import { api } from "convex/_generated/api";
import { useState } from "react";
import { createServerFn } from "@tanstack/start";
import { extractRecipeFromImage } from "@/services/image-ocr";

export const postImageForOcr = createServerFn({
	method: "POST",
})
	.validator((data: FormData) => {
		if (!(data instanceof FormData)) {
			throw new Error("Invalid form data");
		}
		const image = data.get("image") as File | null;

		if (!image) {
			throw new Error("Name and age are required");
		}

		return {
			image,
		};
	})
	.handler(async ({ data }) => {
		if (!data?.image) {
			throw new Error("No image provided");
		}
		const imageArrayBuffer = await data.image.arrayBuffer();
		return await extractRecipeFromImage(imageArrayBuffer);
	});
function ImportRecipeDialog() {
	const [url, setUrl] = useState("");
	const [markdown, setMarkdown] = useState("");
	const [selectedFile, setSelectedFile] = useState<File | null>(null);
	const { toast } = useToast();
	const [isOpen, setIsOpen] = useState(false);
	const importRecipe = useConvexAction(api.recipes.createRecipefromUrl);

	const createRecipe = useConvexMutation(api.recipes.createRecipe);
	const createRecipeFromMarkdown = useConvexAction(
		api.recipes.createRecipeFromMarkdown,
	);

	const handleUrlImport = async () => {
		try {
			await importRecipe({ url });
			toast({
				title: "Recipe imported",
				description: "The recipe has been successfully imported.",
			});
			setUrl("");
			setIsOpen(false);
		} catch (error) {
			toast({
				title: "Error importing recipe",
				description:
					error instanceof Error ? error.message : "An error occurred",
				variant: "destructive",
			});
		}
	};

	// const handleImageImport = async () => {
	// 	if (!selectedFile) return;
	// 	const fileBuffer = await selectedFile.arrayBuffer();

	// 	try {
	// 		if (fileBuffer) {
	// 			await createRecipeFromImage({ image: fileBuffer });
	// 			toast({
	// 				title: "Recipe imported",
	// 				description: "The recipe has been successfully imported from image.",
	// 			});
	// 			setSelectedFile(null);
	// 			setIsOpen(false);
	// 		}
	// 	} catch (error) {
	// 		toast({
	// 			title: "Error importing recipe",
	// 			description:
	// 				error instanceof Error ? error.message : "An error occurred",
	// 			variant: "destructive",
	// 		});
	// 	}
	// };

	const handleMarkdownImport = async () => {
		if (!markdown) return;

		try {
			await createRecipeFromMarkdown({ text: markdown });
			toast({
				title: "Recipe imported",
				description: "The recipe has been successfully imported from markdown.",
			});
			setMarkdown("");
			setIsOpen(false);
		} catch (error) {
			toast({
				title: "Error importing recipe",
				description:
					error instanceof Error ? error.message : "An error occurred",
				variant: "destructive",
			});
		}
	};

	return (
		<Dialog open={isOpen} onOpenChange={setIsOpen}>
			<DialogTrigger asChild>
				<Button variant="outline">Import Recipe</Button>
			</DialogTrigger>
			<DialogContent className="sm:max-w-[600px]">
				<DialogHeader>
					<DialogTitle>Import Recipe</DialogTitle>
					<DialogDescription>
						Choose a method to import your recipe.
					</DialogDescription>
				</DialogHeader>
				<Tabs defaultValue="url" className="w-full">
					<TabsList className="grid w-full grid-cols-3">
						<TabsTrigger value="url">URL</TabsTrigger>
						<TabsTrigger value="image">Image</TabsTrigger>
						<TabsTrigger value="markdown">Markdown</TabsTrigger>
					</TabsList>
					<TabsContent value="url">
						<div className="grid gap-4 py-4">
							<div className="grid gap-2">
								<Label htmlFor="url">Recipe URL</Label>
								<Input
									id="url"
									value={url}
									onChange={(e) => setUrl(e.target.value)}
									placeholder="https://example.com/recipe"
								/>
							</div>
							<div className="flex justify-end gap-2">
								<Button variant="outline" onClick={() => setIsOpen(false)}>
									Cancel
								</Button>
								<Button onClick={handleUrlImport} disabled={!url}>
									Import
								</Button>
							</div>
						</div>
					</TabsContent>
					<TabsContent value="image">
						<form
							onSubmit={async (event) => {
								event.preventDefault();
								const formData = new FormData(event.currentTarget);
								const response = await postImageForOcr({ data: formData });
								console.log(response);
								if (response) {
									await createRecipe(response);
									toast({
										title: "Recipe imported",
										description:
											"The recipe has been successfully imported from image.",
									});
									setSelectedFile(null);
									setIsOpen(false);
								}
							}}
						>
							<div className="grid gap-4 py-4">
								<div className="grid gap-2">
									<Label htmlFor="image">Recipe Image</Label>
									<Input
										id="image"
										name="image"
										type="file"
										accept="image/*"
										onChange={(e) =>
											setSelectedFile(e.target.files?.[0] || null)
										}
									/>
								</div>
								<div className="flex justify-end gap-2">
									<Button variant="outline" onClick={() => setIsOpen(false)}>
										Cancel
									</Button>
									<Button type="submit" disabled={!selectedFile}>
										Import
									</Button>
								</div>
							</div>
						</form>
					</TabsContent>
					<TabsContent value="markdown">
						<div className="grid gap-4 py-4">
							<div className="grid gap-2">
								<Label htmlFor="markdown">Recipe Markdown</Label>
								<Textarea
									id="markdown"
									value={markdown}
									onChange={(e) => setMarkdown(e.target.value)}
									placeholder="# Recipe Title&#10;&#10;## Ingredients&#10;- Item 1&#10;- Item 2&#10;&#10;## Instructions&#10;1. Step 1&#10;2. Step 2"
									className="min-h-[200px]"
								/>
							</div>
							<div className="flex justify-end gap-2">
								<Button variant="outline" onClick={() => setIsOpen(false)}>
									Cancel
								</Button>
								<Button onClick={handleMarkdownImport} disabled={!markdown}>
									Import
								</Button>
							</div>
						</div>
					</TabsContent>
				</Tabs>
			</DialogContent>
		</Dialog>
	);
}
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
						<ImportRecipeDialog />
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
