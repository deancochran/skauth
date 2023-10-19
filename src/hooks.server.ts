// src/hooks.server.ts
import { auth } from '$lib/server/lucia';
import type { Handle, HandleServerError } from '@sveltejs/kit';

export const handle: Handle = async ({ event, resolve }) => {
	event.locals.auth = auth.handleRequest(event);
	let user_email;
	if (event.locals?.auth) {
		const session = await event.locals.auth.validate();
		if (session) {
			user_email = session.user.email;
		} else {
			user_email = 'unknown_user';
		}
	}

	const start = performance.now();
	const response = await resolve(event);
	const end = performance.now();

	const responseTime = end - start;

	const route = event.url;
	if (responseTime > 2000) {
		console.log(`${user_email} at ${route} took 🐢 ${responseTime.toFixed(2)} ms`);
	}

	if (responseTime < 1000) {
		console.log(`${user_email} at ${route} took 🚀 ${responseTime.toFixed(2)} ms`);
	}

	return response;
};

// Make sure that handleError never throws an error
export const handleError: HandleServerError = ({ error }) => {
	// example integration with https://sentry.io/
	// Sentry.captureException(error, { extra: { event } });

	return {
		message: 'Whoops!',
		// eslint-disable-next-line @typescript-eslint/ban-ts-comment
		//@ts-ignore
		code: error?.code ?? 'UNKNOWN'
	};
};