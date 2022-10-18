import { Router } from "@vaadin/router";
import { state } from "../../state";

const imgHomePage = require("url:../../assets/home-page.svg")

class JoinRoom extends HTMLElement {
  shadow: ShadowRoot;
  constructor() {
    super();
    this.shadow = this.attachShadow({ mode: "open" });
  };

  addListeners() {
    const codeError = this.shadow.querySelector(".code-error-off");
    const submitIdEl = this.shadow.querySelector(".submit-name");
    submitIdEl.addEventListener("click", e => {
      const inputId = this.shadow.querySelector(".form-input").shadowRoot.querySelector("input").value;

      if (inputId != "") {
        state.createUser(() => {
          Router.go("/instructions");
        }, inputId);
      } else if (inputId === "") {
        codeError.classList.remove("code-error-off");
        codeError.classList.add("code-error");
        codeError.textContent = "ingrese un id valido";
      } else {
        alert("el id es incorrecto");
      }

    });
  }

  connectedCallback() {
    this.render();
  };

  render() {
    const div: HTMLElement = document.createElement("div");
    div.classList.add("div-container");
    div.innerHTML = `
        <img src="${imgHomePage}" class="img-home-page">
        <form class="form">   
        <input-code-component class="form-input"></input-code-component>
        <h2 class="code-error-off"></h2>
        <button-component class="button-component submit-name">Ingresar a la Sala</button-component>
        </form<
        </div>
        `
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

      .form{
      display:flex;
      flex-direction:column;
      justify-content:center;
      align-items:center;
      gap:30px;
      }
      
      .code-error-off{
      display=none;
      }
  
      .code-error{
      display:block;
      margin:0px;
      font-family: var(--font-button);
      font-size: 45px;
      color:red;
      }

    `;

    this.shadow.appendChild(style);
    this.shadow.appendChild(div);
    this.addListeners();
  }
}
customElements.define("join-room-page", JoinRoom);
