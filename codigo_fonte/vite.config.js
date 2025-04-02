import path from 'node:path';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

const addTransformIndexHtml = {
	name: 'add-transform-index-html',
	transformIndexHtml(html) {
		return {
			html,
			tags: [
				{
					tag: 'script',
					attrs: { type: 'module' },
					children: `
						window.onerror = (message, source, lineno, colno, errorObj) => {
							window.parent.postMessage({
								type: 'horizons-runtime-error',
								message,
								source,
								lineno,
								colno,
								error: errorObj && errorObj.stack
							}, '*');
						};
					`,
					injectTo: 'head',
				},
				{
					tag: 'script',
					attrs: { type: 'module' },
					children: `
						const observer = new MutationObserver((mutations) => {
							for (const mutation of mutations) {
								for (const addedNode of mutation.addedNodes) {
									if (
										addedNode.nodeType === Node.ELEMENT_NODE &&
										(
											addedNode.tagName?.toLowerCase() === 'vite-error-overlay' ||
											addedNode.classList?.contains('backdrop')
										)
									) {
										handleViteOverlay(addedNode);
									}
								}
							}
						});

						observer.observe(document.documentElement, {
							childList: true,
							subtree: true
						});

						function handleViteOverlay(node) {
							if (!node.shadowRoot) {
								return;
							}

							const backdrop = node.shadowRoot.querySelector('.backdrop');

							if (backdrop) {
								const overlayHtml = backdrop.outerHTML;
								const parser = new DOMParser();
								const doc = parser.parseFromString(overlayHtml, 'text/html');
								const messageBodyElement = doc.querySelector('.message-body');
								const fileElement = doc.querySelector('.file');
								const messageText = messageBodyElement ? messageBodyElement.textContent.trim() : '';
								const fileText = fileElement ? fileElement.textContent.trim() : '';
								const error = messageText + (fileText ? ' File:' + fileText : '');

								window.parent.postMessage({
									type: 'horizons-vite-error',
									error,
								}, '*');
							}
						}
					`,
					injectTo: 'head',
				},
				{
					tag: 'script',
					attrs: {type: 'module'},
					children: `
						const originalConsoleError = console.error;
						console.error = function(...args) {
							originalConsoleError.apply(console, args);

							const errorString = args.map(arg => typeof arg === 'object' ? JSON.stringify(arg) : String(arg)).join(' ').toLowerCase();
							let errorObj = null;
							for (const arg of args) {
								if (arg instanceof Error) {
									errorObj = {
										message: arg.message,
										stack: arg.stack,
										name: arg.name
									};
									break;
								} else if (arg && typeof arg === 'object' && (arg.message || arg.code || arg.stack || arg.details)) {
									errorObj = arg;
									break;
								}
							}

							// Parse any JSON strings
							if (!errorObj) {
								for (const arg of args) {
									if (typeof arg !== 'string') {
										continue;
									}
									
									try {
										// Try to parse JSON
										const parsed = JSON.parse(arg);
										if (parsed && typeof parsed === 'object' && (parsed.message || parsed.details || parsed.code)) {
											errorObj = parsed;
											break;
										}
									} catch (e) {
										// Continue to next arg
									}
								}
							}

							// Fallback
							if (!errorObj) {
								errorObj = { message: errorString };
							}
							window.parent.postMessage({
								type: 'horizons-console-error',
								message: errorObj.message || errorString,
								error: errorObj
							}, '*');
						};
					`,
					injectTo: 'head',
				},
			],
		};
	},
};

export default defineConfig({
	plugins: [react(), addTransformIndexHtml],
	server: {
		cors: true,
		headers: {
			'Cross-Origin-Embedder-Policy': 'credentialless',
		},
		allowedHosts: true,
	},
	resolve: {
		extensions: ['.jsx', '.js', '.tsx', '.ts', '.json', ],
		alias: {
			'@': path.resolve(__dirname, './src'),
		},
	},
});
