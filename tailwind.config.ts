// tailwind.config.ts
import type { Config } from 'tailwindcss';
import plugin from 'tailwindcss/plugin';
import postcss from 'postcss';
import postcssJs from 'postcss-js';

import clampGenerator from './src/css-utils/clamp-generator';
import type { Token } from './src/css-utils/tokens-to-tailwind';
import tokensToTailwind from './src/css-utils/tokens-to-tailwind';

// Import design token JSON files
import colorTokens from './src/design-tokens/colors.json';
import fontTokens from './src/design-tokens/fonts.json';
import spacingTokens from './src/design-tokens/spacing.json';
import textSizeTokens from './src/design-tokens/text-sizes.json';
import textLeadingTokens from './src/design-tokens/text-leading.json';
import textWeightTokens from './src/design-tokens/text-weights.json';
import viewportTokens from './src/design-tokens/viewports.json';

// Define the plugin API interface with the required properties
interface PluginAPI {
  addBase: (styles: Record<string, any>) => void;
  addComponents: (components: Record<string, any>) => void;
  addUtilities: (utilities: Record<string, any>, options?: object) => void;
  config: () => any;
  e: (className: string) => string;
  prefix: (selector: string) => string;
  theme: (path: string, defaultValue?: any) => any;
  variants: (path: string, defaultValue?: string[]) => string[];
  corePlugins: (path: string) => boolean;
}

// Process design tokens
const colors = tokensToTailwind(colorTokens.items);
const fontFamily = tokensToTailwind(fontTokens.items);
const fontWeight = tokensToTailwind(textWeightTokens.items);
const fontSize = tokensToTailwind(clampGenerator(textSizeTokens.items));
const lineHeight = tokensToTailwind(textLeadingTokens.items);
const spacing = tokensToTailwind(clampGenerator(spacingTokens.items));

const tailwindConfig: Config = {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    screens: {
      sm: `${viewportTokens.min}px`,
      md: `${viewportTokens.mid}px`,
      lg: `${viewportTokens.max}px`
    },
    colors,
    spacing: {
      ...spacing
    },
    fontSize,
    lineHeight,
    fontFamily,
    fontWeight,
    backgroundColor: ({ theme }: { theme: (arg: string) => any }) => theme('colors'),
    textColor: ({ theme }: { theme: (arg: string) => any }) => theme('colors'),
    margin: ({ theme }: { theme: (arg: string) => any }) => ({
      auto: 'auto',
      ...theme('spacing')
    }),
    padding: ({ theme }: { theme: (arg: string) => any }) => theme('spacing')
  },
  blocklist: ['container'],
  plugins: [
    plugin(function(api) {
      const { addBase, config } = api;
      let result = '';
      const currentConfig = config();
      const groups = [
        { key: 'colors', prefix: 'color' },
        { key: 'spacing', prefix: 'space' },
        { key: 'fontSize', prefix: 'size' },
        { key: 'lineHeight', prefix: 'leading' },
        { key: 'fontFamily', prefix: 'font' },
        { key: 'fontWeight', prefix: 'font' }
      ];
      groups.forEach(({ key, prefix }) => {
        const group = currentConfig.theme?.[key] as Record<string, any> | undefined;
        if (!group) return;
        Object.keys(group).forEach((k) => {
          const value = group[k];
          // Only output primitives (number or string)
          if (typeof value === 'object') return;
          result += `--${prefix}-${k}: ${value};`;
        });
      });
      // Use addBase to add global CSS variables on :root without causing an invalid selector error.
      addBase({
        ':root': postcssJs.objectify(postcss.parse(result))
      });
    }),
    // Plugin for adding custom spacing utilities
    plugin(function(api) {
      const { addUtilities, config } = api;
      const currentConfig = config();
      const customUtilities = [
        { key: 'spacing', prefix: 'flow-space', property: '--flow-space' },
        { key: 'spacing', prefix: 'region-space', property: '--region-space' },
        { key: 'spacing', prefix: 'gutter', property: '--gutter' }
      ];
      customUtilities.forEach(({ key, prefix, property }) => {
        const group = currentConfig.theme?.[key] as Record<string, any> | undefined;
        if (!group) return;
        Object.keys(group).forEach((k) => {
          const value = group[k];
          if (typeof value === 'object') return;
          addUtilities({
            [`.${prefix}-${k}`]: postcssJs.objectify(
              postcss.parse(`${property}: ${value}`)
            )
          });
        });
      });
    })
  ]
};

export default tailwindConfig;
