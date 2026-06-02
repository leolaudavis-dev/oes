// Compute the pixel coordinates of the caret inside a <textarea> or <input>.
// Based on the well-known "textarea-caret-position" mirror-div technique.

const MIRRORED_PROPS = [
  "boxSizing",
  "width",
  "height",
  "overflowX",
  "overflowY",
  "borderTopWidth",
  "borderRightWidth",
  "borderBottomWidth",
  "borderLeftWidth",
  "borderStyle",
  "paddingTop",
  "paddingRight",
  "paddingBottom",
  "paddingLeft",
  "fontStyle",
  "fontVariant",
  "fontWeight",
  "fontStretch",
  "fontSize",
  "fontSizeAdjust",
  "lineHeight",
  "fontFamily",
  "textAlign",
  "textTransform",
  "textIndent",
  "textDecoration",
  "letterSpacing",
  "wordSpacing",
  "tabSize",
  "whiteSpace",
  "wordWrap",
] as const;

export type CaretCoords = { top: number; left: number; height: number };

export function getCaretCoordinates(
  element: HTMLTextAreaElement | HTMLInputElement,
  position: number
): CaretCoords {
  const isInput = element.nodeName.toLowerCase() === "input";

  const div = document.createElement("div");
  document.body.appendChild(div);

  const style = div.style;
  const computed = window.getComputedStyle(element);

  style.whiteSpace = "pre-wrap";
  if (!isInput) style.wordWrap = "break-word";

  style.position = "absolute";
  style.visibility = "hidden";

  const styleRecord = style as unknown as Record<string, string>;
  const computedRecord = computed as unknown as Record<string, string>;
  MIRRORED_PROPS.forEach((prop) => {
    if (isInput && prop === "lineHeight") {
      // Inputs are single-line; force lineHeight to match height.
      style.lineHeight = computed.height;
    } else {
      styleRecord[prop] = computedRecord[prop];
    }
  });

  if (isInput) {
    style.overflow = "hidden";
  }

  div.textContent = element.value.substring(0, position);
  if (isInput) {
    div.textContent = div.textContent.replace(/\s/g, " ");
  }

  const span = document.createElement("span");
  // Use the remaining text (or a placeholder) so the span has dimensions.
  span.textContent = element.value.substring(position) || ".";
  div.appendChild(span);

  const coords: CaretCoords = {
    top: span.offsetTop + parseInt(computed.borderTopWidth, 10),
    left: span.offsetLeft + parseInt(computed.borderLeftWidth, 10),
    height: parseInt(computed.lineHeight, 10) || parseInt(computed.fontSize, 10),
  };

  document.body.removeChild(div);
  return coords;
}
