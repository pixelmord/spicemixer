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

export const Route = createRootRouteWithContext<{
	queryClient: QueryClient;
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
		<html lang="en" className="dark">
			<head>
				<Meta />
			</head>
			<body className="min-h-screen bg-background font-sans antialiased">
				<div className="relative flex min-h-screen flex-col">
					<StickyNavbar />
					<main className="flex-1">
						{children}
						<Toaster />
					</main>
					<Footer />
				</div>
				<ScrollRestoration />
				<ReactQueryDevtools />
				<TanStackRouterDevtools position="bottom-right" />
				<Scripts />
			</body>
		</html>
	);
}
