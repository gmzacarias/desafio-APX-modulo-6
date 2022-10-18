customElements.define("button-component",
  class Button extends HTMLElement {
    shadow: ShadowRoot;
    constructor() {
      super();
      this.shadow = this.attachShadow({ mode: "open" });
      this.render();
    }
    render() {
      const button = document.createElement("button");
      const style = document.createElement("style");
      button.className = "button-component";

      style.innerHTML = `
                  .button-component {
                    background: #006CFC;
                    border: 10px solid #001997;
                    border-radius: 10px;
                    width: 322px;
                    height: 87px;
                    text-align: center;
                    font-family: var(--font-button);
                    font-size: 45px;
                    color: #ffffff;
                    box-sizing: border-box;
                  }
                  `;

      button.textContent = this.textContent;
      this.shadow.appendChild(button);
      this.shadow.appendChild(style);
    }
  }
);
