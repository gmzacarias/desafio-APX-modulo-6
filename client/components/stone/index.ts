const imageStone = require("url:../../assets/stone-hand.svg");

customElements.define("stone-component",
  class Stone extends HTMLElement {
    shadow: ShadowRoot;
    constructor() {
      super();
      this.shadow = this.attachShadow({ mode: "open" });
      this.render();
    }
    render() {
      const style = document.createElement("style");
      this.shadow.innerHTML = `
        <img src="${imageStone}" class="stone-hand" >
        `;

      style.innerHTML = `
            .stone-hand {
              width: 103px;
              height: 236px;
            }
            `;
      this.shadow.appendChild(style);
    }
  }
);
