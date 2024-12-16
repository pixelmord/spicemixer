import { Button } from "@/components/ui/button";
import { createFileRoute, redirect } from "@tanstack/react-router";
import { useAuthActions } from "@convex-dev/auth/react";
import { z } from "zod";

const fallback = "/" as const;

export const Route = createFileRoute("/_authed")({
	validateSearch: z.object({
		redirect: z.string().optional().catch(""),
	}),
	beforeLoad: ({ context, search }) => {
		if (context.auth.isAuthenticated) {
			throw redirect({ to: search.redirect || fallback });
		}
		if (!context.auth.isAuthenticated) {
			throw new Error("Not authenticated");
		}
	},
	errorComponent: ({ error }) => {
		const { signIn } = useAuthActions();
		if (error.message === "Not authenticated") {
			return (
				<Button onClick={() => void signIn("github")}>
					Sign in with GitHub
				</Button>
			);
		}

		throw error;
	},
});
