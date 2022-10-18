customElements.define("input-code-component",
  class InputCode extends HTMLElement {
    shadow: ShadowRoot;
    constructor() {
      super();
      this.shadow = this.attachShadow({ mode: "open" });
      this.render();
    }
    render() {
      const input = document.createElement("input");
      const style = document.createElement("style");
      input.className = "input-code-component";
      input.type="text";
      input.placeholder="****";
      input.maxLength=4;
      input.required=true;
      style.innerHTML = `
                  .input-code-component {
                    border: 10px solid #4fa864;
                    border-radius: 10px;
                    width: 150px;
                    height: 87px;
                    text-align: center;
                    font-family: var(--font-button);
                    font-size: 45px;
                    color: #000000;
                    box-sizing: border-box;
                  }
                  `;

      input.textContent = this.textContent;
     
      this.shadow.appendChild(input);
      this.shadow.appendChild(style);
    }
  }
);
