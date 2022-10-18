customElements.define("input-component",
  class InputText extends HTMLElement {
    shadow: ShadowRoot;
    constructor() {
      super();
      this.shadow = this.attachShadow({ mode: "open" });
      this.render();
    }
    render() {
      const input = document.createElement("input");
      const style = document.createElement("style");
      input.className = "input-component";
      input.type="text";
      input.placeholder="ingrese su nombre...";
      input.required=true;
      style.innerHTML = `
                  .input-component {
                    border: 10px solid #001997;
                    border-radius: 10px;
                    width: 322px;
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
