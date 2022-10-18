import { Router } from "@vaadin/router";
import { state } from "../../state";

const imageRules = require("url:../../assets/rules-game.svg")

class Instructions extends HTMLElement {
  shadow: ShadowRoot;
  constructor() {
    super();
    this.shadow = this.attachShadow({ mode: "open" });
  };

  addListeners() {
    const readyBtnEl = this.shadow.querySelector(".ready-game");
    readyBtnEl.addEventListener("click", e => {
      state.start(true);
      Router.go("/waiting");
    });
  }

  connectedCallback() {
    this.render();
  };

  render() {
    const div: HTMLElement = document.createElement("div");
    div.classList.add("div-container");
    div.innerHTML = `
    <img src="${imageRules}" class="img-rules">
    <button-component class="button-component ready-game">¡jugar!</button-component>
    `;

    const style: HTMLElement = document.createElement("style");
    style.innerHTML = `
    .div-container{
      width: 100%;
      height: 100%;
      gap:50px;
      display: flex;
      flex-direction: column;
      justify-content:center;
      align-items:center;
      }
     
    .img-rules {
      width:320px;  
      height: 240px;
    }`;

    this.shadow.appendChild(style);
    this.shadow.appendChild(div);
    this.addListeners();
  }
}
customElements.define("instructions-page", Instructions);
