/** @type {import('tailwindcss').Config} */
export default {
	content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
	theme: {
		extend: {
			fontFamily: {
				sans: ['"IBM Plex Sans"', 'sans-serif'], // Adding IBM Plex Sans
			},
		},
	},
	plugins: [],
};
