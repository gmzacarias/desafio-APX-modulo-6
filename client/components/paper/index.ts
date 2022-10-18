const imagePaper = require("url:../../assets/paper-hand.svg");

customElements.define("paper-component",
  class Paper extends HTMLElement {
    shadow: ShadowRoot;
    constructor() {
      super();
      this.shadow = this.attachShadow({ mode: "open" });
      this.render();
    }
    render() {
      const style = document.createElement("style");
      this.shadow.innerHTML = `
        <img src="${imagePaper}" class="paper-hand" >
        `;

      style.innerHTML = `
            .paper-hand {
              width: 122px;
              height: 236px;
            }
            `;
      this.shadow.appendChild(style);
    }
  }
);
