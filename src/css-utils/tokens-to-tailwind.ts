import slugify from 'slugify';

export type Token = {
  name: string;
  value: number | string | string[];
  lineHeight?: number;
};

/**
 * Converts human-readable tokens into Tailwind config–friendly ones.
 *
 * For font tokens (arrays), the values are joined into a comma-separated string.
 * If a lineHeight is provided, the output is an array with the value and the lineHeight.
 *
 * @param tokens Array of tokens { name, value, lineHeight? }
 * @returns Object with slugified keys and their values.
 */
const tokensToTailwind = (tokens: Token[]): { [key: string]: any } => {
  const nameSlug = (text: string) => slugify(text, { lower: true });
  let response: { [key: string]: any } = {};

  tokens.forEach(({ name, value, lineHeight }: Token) => {
    let finalValue: string;
    if (Array.isArray(value)) {
      finalValue = value.join(', ');
    } else {
      finalValue = String(value);
    }
    if (lineHeight !== undefined) {
      response[nameSlug(name)] = [finalValue, String(lineHeight)];
    } else {
      response[nameSlug(name)] = finalValue;
    }
  });

  return response;
};

export default tokensToTailwind;
