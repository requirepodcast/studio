export function wordWrapString(text: string): string {
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

export function wordWrapArray(text: string, len: number) {
  const lines = [''];
  const words = text.split(' ');
  let currentLineLength = 0;

  for (let word of words) {
    currentLineLength += word.length + 1;
    if (currentLineLength > len) {
      lines.unshift(word);
      currentLineLength = word.length + 1;
    } else {
      lines[0] += lines[0] ? ' ' + word : word;
    }
  }

  return lines.reverse();
}
