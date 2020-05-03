export function shareLink(text: string, url: string) {
  if ('share' in navigator) {
    (navigator as any)
      .share({ title: 'Uno', text, url })
      .then(() => console.log('Successful share'))
      .catch((error) => console.log('Error sharing:', error));
  }
}
