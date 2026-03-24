/**
 * Converts dynamic table/header IDs into CSS custom-property-safe tokens.
 *
 * We build column width variables from TanStack IDs (for example `user.name`),
 * then read those variables from directives. Raw IDs can include characters
 * like `.`, spaces, or other punctuation that make custom-property names
 * invalid or inconsistent across writer/reader paths.
 *
 * Normalizing IDs to `[a-zA-Z0-9_-]` prevents broken width lookups and keeps
 * column resizing stable for all column definitions.
 */
export function toCssVarToken(value: string): string {
  return value.replace(/[^a-zA-Z0-9_-]/g, '_');
}
