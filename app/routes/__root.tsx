import { DefaultCatchBoundary } from "@/components/DefaultCatchBoundary";
import { NotFound } from "@/components/NotFound";
import { StickyNavbar } from "@/components/StickyNavbar";
import type { QueryClient } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools/production";
import {
	Outlet,
	ScrollRestoration,
	createRootRouteWithContext,
} from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/router-devtools";
import { Meta, Scripts } from "@tanstack/start";
import type * as React from "react";
import { Toaster } from "react-hot-toast";

import { Footer } from "@/components/pages/home/Footer";
import appCss from "@/styles/app.css?url";
import { seo } from "@/utils/seo";
import { convexQuery } from "@convex-dev/react-query";
import { api } from "convex/_generated/api";
import type { DataModel } from "convex/_generated/dataModel";

import { ThemeProvider } from "@/components/ThemeProvider";

export type AuthContext = {
	isAuthenticated: boolean;
	user?: DataModel["users"]["document"] | null;
};

export const Route = createRootRouteWithContext<{
	queryClient: QueryClient;
	auth: AuthContext;
}>()({
	head: () => ({
		meta: [
			{
				charSet: "utf-8",
			},
			{
				name: "viewport",
				content: "width=device-width, initial-scale=1",
			},
			...seo({
				title: "Spicemixer | For cooks that love to spice things",
				description:
					"Collect your spice mixes, recipes and explore what you can cook with a beautiful mix of spices and ingredients.",
			}),
		],
		links: [
			{ rel: "stylesheet", href: appCss },
			{
				rel: "apple-touch-icon",
				sizes: "180x180",
				href: "/apple-touch-icon.png",
			},
			{
				rel: "icon",
				type: "image/png",
				sizes: "32x32",
				href: "/favicon-32x32.png",
			},
			{
				rel: "icon",
				type: "image/png",
				sizes: "16x16",
				href: "/favicon-16x16.png",
			},
			{ rel: "manifest", href: "/site.webmanifest", color: "#fffff" },
			{ rel: "icon", href: "/favicon.ico" },
		],
	}),
	beforeLoad: async (ctx) => {
		const user = await ctx.context.queryClient.ensureQueryData(
			convexQuery(api.users.viewer, {}),
		);
		return {
			auth: {
				user,
				isAuthenticated: !!user,
			},
		};
	},
	errorComponent: (props) => {
		return (
			<RootDocument>
				<DefaultCatchBoundary {...props} />
			</RootDocument>
		);
	},
	notFoundComponent: () => <NotFound />,
	component: RootComponent,
});

function RootComponent() {
	return (
		<RootDocument>
			<Outlet />
		</RootDocument>
	);
}

function RootDocument({ children }: { children: React.ReactNode }) {
	return (
		<html lang="en">
			<head>
				<script>
					{`
						if (
							localStorage['vite-ui-theme'] === 'dark' ||
							(!('vite-ui-theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)
						) {
							document.documentElement.classList.add('dark');
						} else {
							document.documentElement.classList.remove('dark');
						}
					`}
				</script>
				<Meta />
			</head>
			<body className="min-h-screen bg-background font-sans antialiased">
				<div className="relative flex min-h-screen flex-col">
					<ThemeProvider>
						<StickyNavbar />
						<main className="flex-1">
							{children}
							<Toaster />
						</main>
						<Footer />
					</ThemeProvider>
				</div>
				<ScrollRestoration />
				<ReactQueryDevtools />
				<TanStackRouterDevtools position="bottom-right" />
				<Scripts />
			</body>
		</html>
	);
}
