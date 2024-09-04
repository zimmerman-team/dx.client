export async function copyToClipboard(elementId: string) {
  const element = document.getElementById(elementId);

  if (!element) {
    console.error(`Element with ID "${elementId}" not found.`);
    return;
  }

  const textToCopy =
    element.innerText || element.innerHTML || element.textContent;

  // Use the Clipboard API to copy the text
  navigator.clipboard
    .writeText(textToCopy!)
    .then(() => {
      console.log("Copied to clipboard:", textToCopy);
    })
    .catch((err) => {
      console.error("Failed to copy text:", err);
    });
}
