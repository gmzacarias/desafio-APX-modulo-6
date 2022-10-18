const imageScissor = require("url:../../assets/scissor-hand.svg");

customElements.define("scissor-component",
  class Scissor extends HTMLElement {
    shadow: ShadowRoot;
    constructor() {
      super();
      this.shadow = this.attachShadow({ mode: "open" });
      this.render();
    }
    render() {
      const style = document.createElement("style");
      this.shadow.innerHTML = `
        <img src="${imageScissor}" class="scissor-hand" >
        `;

      style.innerHTML = `
            .scissor-hand {
              width: 103px;
              height: 236px;
              
            }
            `;
      this.shadow.appendChild(style);
    }
  }
);