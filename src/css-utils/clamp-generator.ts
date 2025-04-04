import { min as _min, max as _max } from '../design-tokens/viewports.json';
import type { Token } from './tokens-to-tailwind';

type Props = {
  name: string;
  min: number;
  max: number;
  lineHeight?: number;
};

/**
 * Takes an array of tokens and sends back an array of name
 * and clamp pairs for CSS fluid values.
 *
 * @param tokens Array of { name, min, max, lineHeight? }
 * @returns Array of { name, value, lineHeight? }
 */
const clampGenerator = (tokens: Props[]): Token[] => {
  const rootSize = 16;
  return tokens.map(({ name, min, max, lineHeight }: Props) => {
    if (min === max) {
      return { name, value: `${min / rootSize}rem`, lineHeight };
    }
    const minSize = min / rootSize;
    const maxSize = max / rootSize;
    const minViewport = _min / rootSize;
    const maxViewport = _max / rootSize;
    const slope = (maxSize - minSize) / (maxViewport - minViewport);
    const intersection = -minViewport * slope + minSize;
    return {
      name,
      value: `clamp(${minSize}rem, ${intersection.toFixed(
        2
      )}rem + ${(slope * 100).toFixed(2)}vw, ${maxSize}rem)`,
      lineHeight
    };
  });
};

export default clampGenerator;
