import slugify from 'slugify';

export type Token = {
  name: string;
  value: number | string | string[];
  lineHeight?: number;
};

/**
 * Converts human-readable tokens into Tailwind config friendly ones.
 *
 * @param tokens Array of tokens {name, value, lineHeight?}
 * @returns Object with slugified keys and their values.
 */
const tokensToTailwind = (tokens: Token[]): { [key: string]: any } => {
  const nameSlug = (text: string) => slugify(text, { lower: true });
  let response: { [key: string]: any } = {};
  tokens.forEach(({ name, value, lineHeight }: Token) => {
    if (lineHeight === undefined) {
      response[nameSlug(name)] = value;
    } else {
      const values = `${value} , ${lineHeight}`;
      response[nameSlug(name)] = values.split(' , ');
    }
  });
  return response;
};

export default tokensToTailwind;
