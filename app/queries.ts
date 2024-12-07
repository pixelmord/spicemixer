import { convexQuery, useConvexMutation } from "@convex-dev/react-query";
import { useMutation } from "@tanstack/react-query";
import { api } from "../convex/_generated/api";

// recipes

export function useUpdateRecipeMutation() {
	const mutationFn = useConvexMutation(api.recipes.updateRecipe);
	return useMutation({ mutationFn });
}
