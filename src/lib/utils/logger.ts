const timestamp = () => new Date().toISOString();

export const logger = {
	debug: (message: string, data?: unknown) => {
		console.debug(`[${timestamp()}] ${message}`, data);
	},

	info: (message: string, data?: unknown) => {
		console.info(`[${timestamp()}] ${message}`, data);
	},

	warn: (message: string, data?: unknown) => {
		console.warn(`[${timestamp()}] ${message}`, data);
	},

	error: (message: string, error?: unknown) => {
		console.error(`[${timestamp()}] ${message}`, error);
	}
};
