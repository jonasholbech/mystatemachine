export default class FLIP {
  constructor(el, scale = true) {
    this.el = el;
    this.first = null;
    this.last = null;
    this.scale = scale;
  }
  logFirstPosition() {
    this.first = this.el.getBoundingClientRect();
    return this;
  }
  logFirstToDOM() {
    this.el.dataset.first = JSON.stringify(this.first);
    return this;
  }
  readFirstFromDOM() {
    this.first = JSON.parse(this.el.dataset.first);
    return this;
  }
  logFinalPosition() {
    this.last = this.el.getBoundingClientRect();
    return this;
  }
  logLastToDOM() {
    this.el.dataset.last = JSON.stringify(this.last);
    return this;
  }
  readLastFromDOM() {
    this.last = JSON.parse(this.el.dataset.last);
    return this;
  }
  clearDOM() {
    this.el.removeAttribute("data-first");
    this.el.removeAttribute("data-last");
    return this;
  }
  animate(duration = 600, callback = null) {
    const deltaX = this.first.left - this.last.left;
    const deltaY = this.first.top - this.last.top;
    const deltaW = this.first.width / this.last.width;
    const deltaH = this.first.height / this.last.height;
    let transform = `translate(${deltaX}px, ${deltaY}px) scale(${deltaW}, ${deltaH})`;
    if (!this.scale) {
      transform = `translate(${deltaX}px, ${deltaY}px)`;
    }
    const x = this.el.animate(
      [
        {
          transformOrigin: "top left",
          transform
        },
        {
          transformOrigin: "top left",
          transform: "none"
        }
      ],
      {
        duration: duration,
        easing: "ease-in-out",
        fill: "both"
      }
    );
    x.onfinish = callback;
    return this;
  }
}
