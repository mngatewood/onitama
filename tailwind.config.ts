import type { Config } from "tailwindcss";
import flattenColorPalette from "tailwindcss/lib/util/flattenColorPalette";
import { CSSRuleObject } from "tailwindcss/types/config";
import type { PluginCreator } from "tailwindcss/types/config";

const addVariablesForColors: PluginCreator = ({ addBase, theme }) => {
	const allColors = flattenColorPalette(theme("colors"));
	const newVars = Object.fromEntries(
		Object.entries(allColors).map(([key, val]) => [`--${key}`, val])
	);

	addBase({
		":root": newVars,
	} as CSSRuleObject);
}

export default {
	content: [
		"./pages/**/*.{js,ts,jsx,tsx,mdx}",
		"./components/**/*.{js,ts,jsx,tsx,mdx}",
		"./app/**/*.{js,ts,jsx,tsx,mdx}",
	],
	darkMode: "class",
	theme: {
		extend: {
			screens: {
				short: { raw: '(min-height: 640px)' },
				tall: { raw: '(min-height: 740px)' },
				tablet: { raw: '(min-height: 10240px)' },
				desktop: { raw: '(min-height: 1280px)' },
			},
			colors: {
				background: "var(--background)",
				foreground: "var(--foreground)",
				yellow: {
					1: "#fce67d",
				},
				blue: {
					1: "#01092b",
				},
			},
			fontFamily: {
				sans: ["var(--font-geist-sans)", "sans-serif"],
				mono: ["var(--font-geist-mono)", "monospace"],
				reggae: ["var(--font-reggae-one)", "cursive"],
			},
			fontSize: {
				"2xs": ".625rem",
			},
			boxShadow: {
				input: `0px 2px 3px -1px rgba(0,0,0,0.1), 0px 1px 0px 0px rgba(25,28,33,0.02), 0px 0px 0px 1px rgba(25,28,33,0.08)`,
			},

		},
	},
	plugins: [addVariablesForColors],
} satisfies Config;
