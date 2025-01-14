export async function copyToClipboard(elementId: string) {
  const element = document.getElementById(elementId);

  if (!element) {
    return;
  }

  const textToCopy =
    element.innerText || element.innerHTML || element.textContent;

  // Use the Clipboard API to copy the text
  navigator.clipboard
    .writeText(textToCopy!)
    .then(() => {
      //TODO:handle success
    })
    .catch((err) => {
      //TODO: handle error
    });
}
