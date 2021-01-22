export function getDOMNode(unknown) {
  if (typeof unknown === "string") {
    return document.querySelector(unknown);
  } else {
    return unknown;
  }
}
