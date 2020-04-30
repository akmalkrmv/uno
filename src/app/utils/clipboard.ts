export function copyToClipboard(text: string): boolean {
  let successful = false;
  let textArea = document.createElement('textarea');
  textArea.value = text;

  // Avoid scrolling to bottom
  textArea.style.top = '0';
  textArea.style.left = '0';
  textArea.style.position = 'fixed';

  document.body.appendChild(textArea);
  textArea.focus();
  textArea.select();

  try {
    successful = document.execCommand('copy');
  } catch (error) {
    console.error('Unable to copy', error);
  }

  document.body.removeChild(textArea);

  return successful;
}
