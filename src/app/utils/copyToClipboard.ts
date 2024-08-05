export async function copyToClipboard(elementId: string) {
  // Get the element by its ID
  const element = document.getElementById(elementId);

  if (!element) {
    console.error(`Element with ID "${elementId}" not found.`);
    return;
  }

  // Create a temporary textarea element
  const textarea = document.createElement("textarea");

  // Set the textarea's value to the text content of the element
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
