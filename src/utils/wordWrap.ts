export function wordWrap(text: string): string {
  const words = text.split(' ');
  let letters = 0;
  let wordWrappedText = '';

  for (let word of words) {
    letters += word.length + 1;
    if (letters > 22) {
      letters = 0;
      wordWrappedText += `\n${word}`;
    } else {
      wordWrappedText += ` ${word}`;
    }
  }

  return wordWrappedText;
}
