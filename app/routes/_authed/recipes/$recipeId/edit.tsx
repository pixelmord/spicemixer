import { zodResolver } from "@hookform/resolvers/zod";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { api } from "convex/_generated/api";
import type { Id } from "convex/_generated/dataModel";
import { useForm } from "react-hook-form";
import type { ControllerRenderProps, FieldValues } from "react-hook-form";

import { Loader } from "@/components/Loader";
import { Button } from "@/components/ui/button";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { convexQuery } from "@convex-dev/react-query";

import { ArrayField } from "@/components/ArrayField";
import { InstructionsField } from "@/components/InstructionsField";
import { type RecipeFormData, recipeFormSchema } from "@/db/recipeSchema";
import { useUpdateRecipeMutation } from "@/queries";

export const Route = createFileRoute("/_authed/recipes/$recipeId/edit")({
	component: EditRecipePage,
	pendingComponent: () => <Loader />,
	loader: async ({ params, context: { queryClient } }) => {
		const recipe = await queryClient.ensureQueryData(
			convexQuery(api.recipes.get, { id: params.recipeId as Id<"recipes"> }),
		);
		return recipe;
	},
});

function EditRecipePage() {
	const { recipeId } = Route.useParams();
	const navigate = useNavigate();
	const recipe = Route.useLoaderData();
	const updateRecipeMutation = useUpdateRecipeMutation();

	const form = useForm<RecipeFormData>({
		resolver: zodResolver(recipeFormSchema),
		defaultValues: recipe || {},
	});

	const onSubmit = async (data: RecipeFormData) => {
		try {
			await updateRecipeMutation.mutate({
				id: recipeId as Id<"recipes">,
				...data,
			});
			navigate({ to: "/recipes/$recipeId", params: { recipeId } });
		} catch (error) {
			console.error("Failed to update recipe:", error);
		}
	};

	return (
		<div className="container mx-auto py-10">
			<h1 className="text-3xl font-bold mb-8">Edit Recipe</h1>
			<Form {...form}>
				<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
					<FormField
						control={form.control}
						name="name"
						render={({
							field,
						}: {
							field: ControllerRenderProps<RecipeFormData, "name">;
						}) => (
							<FormItem>
								<FormLabel>Recipe Name</FormLabel>
								<FormControl>
									<Input {...field} />
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>

					<FormField
						control={form.control}
						name="description"
						render={({
							field,
						}: {
							field: ControllerRenderProps<RecipeFormData, "description">;
						}) => (
							<FormItem>
								<FormLabel>Description</FormLabel>
								<FormControl>
									<Textarea {...field} />
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>

					<FormField
						control={form.control}
						name="author"
						render={({
							field,
						}: {
							field: ControllerRenderProps<RecipeFormData, "author">;
						}) => (
							<FormItem>
								<FormLabel>Author</FormLabel>
								<FormControl>
									<Input {...field} />
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>

					<ArrayField
						name="image"
						control={form.control}
						label="Images"
						placeholder="Enter image URL"
					/>

					<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
						<FormField
							control={form.control}
							name="prepTime"
							render={({
								field,
							}: {
								field: ControllerRenderProps<RecipeFormData, "prepTime">;
							}) => (
								<FormItem>
									<FormLabel>Prep Time</FormLabel>
									<FormControl>
										<Input {...field} placeholder="PT30M" />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						<FormField
							control={form.control}
							name="cookTime"
							render={({
								field,
							}: {
								field: ControllerRenderProps<RecipeFormData, "cookTime">;
							}) => (
								<FormItem>
									<FormLabel>Cook Time</FormLabel>
									<FormControl>
										<Input {...field} placeholder="PT1H" />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						<FormField
							control={form.control}
							name="totalTime"
							render={({
								field,
							}: {
								field: ControllerRenderProps<RecipeFormData, "totalTime">;
							}) => (
								<FormItem>
									<FormLabel>Total Time</FormLabel>
									<FormControl>
										<Input {...field} placeholder="PT1H30M" />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
					</div>

					<FormField
						control={form.control}
						name="recipeYield"
						render={({
							field,
						}: {
							field: ControllerRenderProps<RecipeFormData, "recipeYield">;
						}) => (
							<FormItem>
								<FormLabel>Recipe Yield</FormLabel>
								<FormControl>
									<Input {...field} placeholder="4 servings" />
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>

					<FormField
						control={form.control}
						name="difficulty"
						render={({
							field,
						}: {
							field: ControllerRenderProps<RecipeFormData, "difficulty">;
						}) => (
							<FormItem>
								<FormLabel>Difficulty</FormLabel>
								<Select
									onValueChange={field.onChange}
									defaultValue={field.value}
								>
									<FormControl>
										<SelectTrigger>
											<SelectValue placeholder="Select difficulty" />
										</SelectTrigger>
									</FormControl>
									<SelectContent>
										<SelectItem value="easy">Easy</SelectItem>
										<SelectItem value="medium">Medium</SelectItem>
										<SelectItem value="hard">Hard</SelectItem>
									</SelectContent>
								</Select>
								<FormMessage />
							</FormItem>
						)}
					/>

					<FormField
						control={form.control}
						name="rating"
						render={({
							field,
						}: {
							field: ControllerRenderProps<RecipeFormData, "rating">;
						}) => (
							<FormItem>
								<FormLabel>Rating</FormLabel>
								<FormControl>
									<Input
										type="number"
										min="0"
										max="5"
										step="0.1"
										{...field}
										onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
											field.onChange(Number.parseFloat(e.target.value))
										}
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>

					<ArrayField
						name="recipeIngredient"
						control={form.control}
						label="Ingredients"
						placeholder="Enter an ingredient"
					/>

					<ArrayField
						name="recipeCategory"
						control={form.control}
						label="Categories"
						placeholder="Enter a category"
					/>

					<ArrayField
						name="recipeCuisine"
						control={form.control}
						label="Cuisines"
						placeholder="Enter a cuisine type"
					/>

					<InstructionsField control={form.control} />

					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
						<FormField
							control={form.control}
							name="nutrition.calories"
							render={({
								field,
							}: {
								field: ControllerRenderProps<
									RecipeFormData,
									`nutrition.calories`
								>;
							}) => (
								<FormItem>
									<FormLabel>Calories</FormLabel>
									<FormControl>
										<Input {...field} placeholder="e.g., 500 kcal" />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						<FormField
							control={form.control}
							name="nutrition.proteinContent"
							render={({
								field,
							}: {
								field: ControllerRenderProps<
									RecipeFormData,
									`nutrition.proteinContent`
								>;
							}) => (
								<FormItem>
									<FormLabel>Protein Content</FormLabel>
									<FormControl>
										<Input {...field} placeholder="e.g., 20g" />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						<FormField
							control={form.control}
							name="nutrition.fatContent"
							render={({
								field,
							}: {
								field: ControllerRenderProps<
									RecipeFormData,
									`nutrition.fatContent`
								>;
							}) => (
								<FormItem>
									<FormLabel>Fat Content</FormLabel>
									<FormControl>
										<Input {...field} placeholder="e.g., 15g" />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						<FormField
							control={form.control}
							name="nutrition.carbohydrateContent"
							render={({
								field,
							}: {
								field: ControllerRenderProps<
									RecipeFormData,
									`nutrition.carbohydrateContent`
								>;
							}) => (
								<FormItem>
									<FormLabel>Carbohydrate Content</FormLabel>
									<FormControl>
										<Input {...field} placeholder="e.g., 45g" />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						<FormField
							control={form.control}
							name="nutrition.servingSize"
							render={({
								field,
							}: {
								field: ControllerRenderProps<
									RecipeFormData,
									`nutrition.servingSize`
								>;
							}) => (
								<FormItem>
									<FormLabel>Serving Size</FormLabel>
									<FormControl>
										<Input {...field} placeholder="e.g., 100g" />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
					</div>

					<ArrayField
						name="keywords"
						control={form.control}
						label="Keywords"
						placeholder="Enter a keyword"
					/>

					<ArrayField
						name="suitableForDiet"
						control={form.control}
						label="Suitable for Diet"
						placeholder="Enter a diet type"
					/>

					<div className="flex justify-end gap-4">
						<Button
							type="button"
							variant="outline"
							onClick={() =>
								navigate({ to: "/recipes/$recipeId", params: { recipeId } })
							}
						>
							Cancel
						</Button>
						<Button type="submit">Save Changes</Button>
					</div>
				</form>
			</Form>
		</div>
	);
}
