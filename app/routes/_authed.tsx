import { Button } from "@/components/ui/button";
import { createFileRoute, Outlet } from "@tanstack/react-router";
import { Authenticated, AuthLoading, Unauthenticated } from "convex/react";
import { useAuthActions } from "@convex-dev/auth/react";

const fallback = "/" as const;

export const Route = createFileRoute("/_authed")({
	component: () => {
		const { signIn } = useAuthActions();

		return (
			<>
				<AuthLoading>{"loading..."}</AuthLoading>
				<Unauthenticated>
					<Button onClick={() => void signIn("github")}>
						Sign in with GitHub
					</Button>
				</Unauthenticated>
				<Authenticated>
					<Outlet />
				</Authenticated>
			</>
		);
	},
});
