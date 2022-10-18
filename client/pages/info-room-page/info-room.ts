import { Router } from "@vaadin/router";
import { state } from "../../state";

class InfoRoom extends HTMLElement {
  shadow: ShadowRoot;
  constructor() {
    super();
    this.shadow = this.attachShadow({ mode: "open" })
  };

  addListeners() {
    const btnEl = this.shadow.querySelector(".button-component");
    btnEl.addEventListener("click", () => {
      Router.go("/instructions");
    });
  }

  connectedCallback() {
    const currentState = state.getState();
    state.suscribe(() => {
      if (currentState.roomId) this.render();
    });

    this.render();
  }
  render() {
    const currentState = state.getState();
    const div: HTMLElement = document.createElement("div");
    div.classList.add("div-container");
    div.innerHTML = `
    <div class="text-container">
    <h2 class="living-room">Sala:${currentState.roomId}</h2>
    <p class="share-code">Comparti el codigo:<br>${currentState.roomId ? currentState.roomId : "generando codigo"}<br>con tu contrincante</p>
    <button-component class="button-component">Listo</button-component>
    </div>
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
       display:flex;
       flex-direction:column;
       justify-content:space-between;
       align-items:center;
       gap:50px;
       }
       
       .living-room{
        margin:0px;
        font-family: var(--font-button);
        font-size: 55px;
        color: #000;
        text-align:center;
       }

       .share-code{
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
customElements.define("info-room-page", InfoRoom);
