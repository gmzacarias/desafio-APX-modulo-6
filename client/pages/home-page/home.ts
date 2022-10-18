import { Router } from "@vaadin/router";
import { state } from "../../state";

const imgHomePage = require("url:../../assets/home-page.svg");

class HomePage extends HTMLElement {
  shadow: ShadowRoot;
  constructor() {
    super();
    this.shadow = this.attachShadow({ mode: "open" });
  }
  addListeners() {
    const newGameEl = this.shadow.querySelector(".new-game");
    newGameEl.addEventListener("click", e => {
      state.createUser(() => {
        Router.go("/info-room");
      });
    });

    const joinRoomEl = this.shadow.querySelector(".join-room");
    joinRoomEl.addEventListener("click", e => {
      Router.go("/join-room");
    });
  }

  connectedCallback() {
    this.render();

  }
  render() {
    const div: HTMLElement = document.createElement("div");
    div.classList.add("div-container");
    div.innerHTML = `
    <img src="${imgHomePage}" class="img-home-page">
    <div class="container-btn">
    <button-component class="button-component new-game">Nuevo Juego</button-component>
    <button-component class="button-component join-room">Ingresar a una Sala</button-component>
    </div>
    `;

    const style: HTMLElement = document.createElement("style");
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

     .img-welcome{
     width:284px;
     height:211px
     }  

     .container-btn{
     display:flex;
     flex-direction:column;
     gap:30px;
     }
    `;
    this.shadow.appendChild(style);
    this.shadow.appendChild(div);
    this.addListeners();
  }
}
customElements.define("home-page", HomePage);
