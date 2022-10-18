import { Router } from "@vaadin/router";
import { state } from "../../state";

class Waiting extends HTMLElement {
  shadow: ShadowRoot;
  constructor() {
    super();
    this.shadow = this.attachShadow({ mode: "open" });
  };

  addListeners() {
    state.suscribe(() => {
      const currentState = state.getState();
      const statusPlayerOne = currentState.rtdbData.playerOne;
      const statusPlayerGuest = currentState.rtdbData.playerGuest;
      const startPlayerOne = statusPlayerOne.start;
      const startPlayerGuest = statusPlayerGuest.start;

      if (startPlayerOne && startPlayerGuest)
        Router.go("/game");
    });
  }

  connectedCallback() {
    this.render();
  };

  render() {
    const div: HTMLElement = document.createElement("div");
    div.classList.add("div-container");
    div.innerHTML = `
    <div class="text-container">
    <h2 class="waiting-text">Esperando a que<br>tu rival presione ¡Jugar!...</h2>
    `;

    const style = document.createElement("style");
    style.innerHTML = `
    .div-container{
      width: 100%;
      height: 100%;
      display: flex;
      flex-direction: column;
      justify-content:center;
      align-items:center;
      gap:50px;
      }

      .text-container{
      margin:0px;
      font-family: var(--font-button);
      font-size: 55px;
      color: #000;
      text-align:center;
      }

      .waiting-text{
      margin:0px;
      font-family: var(--font-button);
      font-size: 45px;
      color: #000;
      text-align:center;
      }

    `;
    this.shadow.appendChild(style);
    this.shadow.appendChild(div);
    this.addListeners();
  }
}
customElements.define("waiting-page", Waiting);
