// src/lib/api.ts
import { treaty } from '@elysiajs/eden';
import type { App } from '@to-do-api';

const resolveApiBaseUrl = () => {
	const configuredUrl = import.meta.env.VITE_API_URL;
	const origin = window.location.origin;

	if (configuredUrl) {
		if (configuredUrl.startsWith('/')) {
			return new URL(configuredUrl, origin).toString();
		}

		try {
			const url = new URL(configuredUrl, origin);

			if (window.location.protocol === 'https:' && url.protocol === 'http:') {
				url.protocol = 'https:';
			}

			return url.toString();
		} catch {
			// Fall through to a derived URL when the configured value is invalid.
		}
	}

	if (import.meta.env.DEV) {
		return new URL('/api', origin).toString();
	}

	const url = new URL(origin);

	if (url.hostname.endsWith('.app.github.dev')) {
		url.hostname = url.hostname.replace(/-\d+\.app\.github\.dev$/, '-3000.app.github.dev');
		url.port = '';
	} else {
		url.port = '3000';
	}

	url.pathname = '/';
	url.search = '';
	url.hash = '';

	return url.toString();
};

export const api = treaty<App>(resolveApiBaseUrl());
