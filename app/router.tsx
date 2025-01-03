import { ConvexAuthProvider, useAuthToken } from "@convex-dev/auth/react";
import { convexQuery, ConvexQueryClient } from "@convex-dev/react-query";
import {
	MutationCache,
	QueryClient,
	notifyManager,
	useQuery,
} from "@tanstack/react-query";
import {
	createRouter as createTanStackRouter,
	RouterProvider,
} from "@tanstack/react-router";
import { routerWithQueryClient } from "@tanstack/react-router-with-query";
import {
	Authenticated,
	ConvexProvider,
	ConvexReactClient,
	Unauthenticated,
} from "convex/react";
import toast from "react-hot-toast";
import { DefaultCatchBoundary } from "./components/DefaultCatchBoundary";
import { NotFound } from "./components/NotFound";
import { routeTree } from "./routeTree.gen";
import { api } from "convex/_generated/api";
import { PropsWithChildren } from "react";
function App({ children }: PropsWithChildren) {
	const token = useAuthToken();
	const isAuthenticated = !!token;
	const { isLoading } = useQuery(convexQuery(api.users.viewer, {}));
	if (isLoading) {
		return (
			<div className="relative flex h-[500px] w-full flex-col items-center justify-center overflow-hidden rounded-lg border bg-background md:shadow-xl">
				<p className="z-10 whitespace-pre-wrap text-center text-5xl font-medium tracking-tighter text-white">
					Loading
				</p>
			</div>
		);
	}
	return children;
}
export function createRouter() {
	if (typeof document !== "undefined") {
		notifyManager.setScheduler(window.requestAnimationFrame);
	}

	const CONVEX_URL = import.meta.env.VITE_CONVEX_URL;
	if (!CONVEX_URL) {
		console.error("missing envar CONVEX_URL");
	}
	const convex = new ConvexReactClient(CONVEX_URL, {
		verbose: true,
	});
	const convexQueryClient = new ConvexQueryClient(convex);

	const queryClient: QueryClient = new QueryClient({
		defaultOptions: {
			queries: {
				queryKeyHashFn: convexQueryClient.hashFn(),
				queryFn: convexQueryClient.queryFn(),
			},
		},
		mutationCache: new MutationCache({
			onError: (error) => {
				toast(error.message, { className: "bg-red-500 text-white" });
			},
		}),
	});
	convexQueryClient.connect(queryClient);

	const router = routerWithQueryClient(
		createTanStackRouter({
			routeTree,
			defaultPreload: "intent",
			defaultErrorComponent: DefaultCatchBoundary,
			defaultNotFoundComponent: () => <NotFound />,
			// biome-ignore lint/style/noNonNullAssertion: <explanation>
			context: { queryClient, auth: undefined! },

			Wrap: ({ children }) => (
				<ConvexAuthProvider client={convex}>{children}</ConvexAuthProvider>
			),
		}),
		queryClient,
	);

	return router;
}

declare module "@tanstack/react-router" {
	interface Register {
		router: ReturnType<typeof createRouter>;
	}
}
