/// <reference types="vite/client" />

interface ImportMetaEnv {
	readonly VITE_CONVEX_URL: string;
	readonly ANTHROPIC_API_KEY: string;
	readonly AWS_ACCESS_KEY_ID: string;
	readonly AWS_SECRET_ACCESS_KEY: string;
	readonly AWS_REGION: string;
	readonly OPENAI_API_KEY: string;
	// more env variables...
}

interface ImportMeta {
	readonly env: ImportMetaEnv;
}
