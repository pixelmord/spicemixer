import { convexQuery } from '@convex-dev/react-query'
import { createFileRoute } from '@tanstack/react-router'

import { Loader } from '@/components/Loader'
import { api } from 'convex/_generated/api'
import type { Id } from 'convex/_generated/dataModel'
import { Recipe } from '@/components/Recipe'

export const Route = createFileRoute('/recipes/$recipeId/')({
  component: RecipePage,
  pendingComponent: () => <Loader />,
  loader: async ({ params, context: { queryClient } }) => {
    await queryClient.ensureQueryData(
      convexQuery(api.recipes.get, { id: params.recipeId as Id<'recipes'> }),
    )
  },
})
function RecipePage() {
  const { recipeId } = Route.useParams()
  return <Recipe recipeId={recipeId} />
}
