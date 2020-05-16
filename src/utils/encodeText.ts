export function encodeText(text: string): string {
  return text.replace("'", "\\\\\\'");
}
