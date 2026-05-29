function copyWithTextarea(text: string) {
  if (typeof document === "undefined") {
    return false;
  }

  try {
    const textarea = document.createElement("textarea");
    textarea.value = text;
    textarea.setAttribute("readonly", "");
    textarea.style.position = "fixed";
    textarea.style.left = "-9999px";
    textarea.style.top = "0";
    document.body.appendChild(textarea);
    textarea.focus();
    textarea.select();
    const copied = document.execCommand("copy");
    textarea.remove();
    return copied;
  } catch {
    return false;
  }
}

export async function copyTextToClipboard(text: string) {
  if (copyWithTextarea(text)) {
    return true;
  }

  if (typeof navigator === "undefined") {
    return false;
  }

  if (typeof window !== "undefined" && window.parent !== window) {
    try {
      await window.parent.navigator.clipboard.writeText(text);
      return true;
    } catch {
      // Fall back to the frame's own clipboard API if the parent cannot write.
    }
  }

  if (navigator.clipboard?.writeText) {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch {
      // Fall back for embedded app frames where clipboard permissions can be limited.
    }
  }

  return false;
}
