export function wordWrap(text: string): string {
  const words = text.split(' ');
  let currentLine = 0;
  let wordWrappedText = '';

  for (let word of words) {
    currentLine += word.length + 1;
    if (currentLine > 22) {
      currentLine = word.length + 1;
      wordWrappedText += `\n${word} `;
    } else {
      wordWrappedText += `${word} `;
    }
  }

  return wordWrappedText;
}
