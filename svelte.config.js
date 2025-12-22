import adapter from '@sveltejs/adapter-static';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	preprocess: vitePreprocess(),
	ssr: false,
	kit: {
		adapter: adapter(),
		paths: {
			assets: 'https://nktauserum.github.io',
			base: ''
		}
	}
};

export default config;
