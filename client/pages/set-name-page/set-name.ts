// import { state } from "../../state";
// import { Router } from "@vaadin/router";

// const imgHomePage = require("url:../../assets/home-page.svg")
// class SetName extends HTMLElement {
//     shadow: ShadowRoot;
//     constructor() {
//         super();
//         this.shadow = this.attachShadow({ mode: "open" });
//     }

//     addListeners() {
//         const submitEl = this.shadow.querySelector(".submit-name");
//         submitEl?.addEventListener("click", (e) => {
//             // e.preventDefault();
//             // const inputName = this.shadow.querySelector(".form-input").shadowRoot.querySelector("input").value;
//             //     state.setName(inputName);
//             //     Router.go("/home");

//                   const inputId = this.shadow.querySelector(".form-input").shadowRoot.querySelector("input").value;

//       if (inputId === "") {
//         alert("Debes ingresar un nombre.");
//       } else {
//         state.setName(inputId);
//         Router.go("/home");
//       }

//         });
//     };

//     connectedCallback() {
//         this.render();
//     }


//     render() {
//         const div: HTMLElement = document.createElement("div");
//         div.classList.add("div-container");
//         div.innerHTML = `
//         <img src="${imgHomePage}" class="img-home-page">
//         <form class="form">
//         <h1 class="form-title">Tu nombre</h1>
//         <input class="form-input" type="text" placeholder="ingresa tu nombre" required></input>
//         <button-component class="button-component submit-name">Empezar</button-component>
//         </form>
//         `;

//         const style: HTMLElement = document.createElement("style");
//         style.innerHTML = `
//         .div-container{
//             width: 100%;
//             height: 100%;

//             display: flex;
//             flex-direction: column;
//             justify-content:center;
//             align-items:center;
//             gap:30px;
//             }

//             .img-welcome{
//                 width:284px;
//                 height:211px
//             }

//             .form{
//             display:flex;
//             flex-direction:column;
//             justify-content:space-between;
//             gap:20px;
//             }

//             .form-title{
//             margin:0px;
//             font-family: var(--font-button);
//             font-size: 45px;
//             color: #000;
//             }

//             .form-input{
//             border: 10px solid #001997;
//             border-radius: 10px;
//             width: 322px;
//             height: 87px;
//             text-align: center;
//             font-family: var(--font-button);
//             font-size: 45px;
//             color: #000000;
//             box-sizing: border-box;
//             }
//             `;
//         this.shadow.appendChild(div);
//         this.shadow.appendChild(style)
//         this.addListeners();
//     }
// }

// customElements.define("set-name-page", SetName);

import { Router } from "@vaadin/router";
import { state } from "../../state";

const imgHomePage = require("url:../../assets/home-page.svg");

class SetName extends HTMLElement {
  shadow: ShadowRoot;
  constructor() {
    super();
    this.shadow = this.attachShadow({ mode: "open" });
  }
  addListeners() {
    const nameError = this.shadow.querySelector(".text-error-off");
    const submitEl = this.shadow.querySelector(".submit-name");
    submitEl.addEventListener("click", e => {
      const inputName = this.shadow.querySelector(".form-input").shadowRoot.querySelector("input").value;

      if (inputName === "") {
        nameError.classList.remove("text-error-off");
        nameError.classList.add("text-error");
        nameError.textContent = "!!Ingrese un nombre";
      } else {
        state.setName(inputName);
        Router.go("/home");
      }
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
    <form class="form">
    <h1 class="form-title">Tu nombre</h1>
    <input-component class="form-input"></input-component>
    <button-component class="button-component submit-name">Empezar</button-component>
    </form>
    <h2 class="text-error-off"></h2>
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
      gap:30px;
      }
    
      .img-welcome{
       width:284px;
       height:211px
      }
      
      .form{
      margin:0px;
      display:flex;
      flex-direction:column;
      justify-content:space-between;
      gap:20px;
      }

      .form-title{
      margin:0px;
      font-family: var(--font-button);
      font-size: 45px;
      color: #000;
      }

      .text-error-off{
      display=none;
      }

      .text-error{
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
customElements.define("set-name-page", SetName);
