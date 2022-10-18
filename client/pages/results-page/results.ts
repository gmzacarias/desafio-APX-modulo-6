import { Router } from "@vaadin/router";
import { state } from "../../state";
const resultsImages = {
  defeatedGame: require("url:../../assets/defeat-game.svg"),
  tieGame: require("url:../../assets/tie-game.svg"),
  victoryGame: require("url:../../assets/victory-game.svg"),
};

class Results extends HTMLElement {
  shadow: ShadowRoot;
  scorePlayerOne;
  scorePlayerGuest;
  constructor() {
    super();
    this.shadow = this.attachShadow({ mode: "open" });
  }

  addListeners() {
    const replayBtn = this.shadow.querySelector(".btn-replay-game");
    replayBtn.addEventListener("click", e => {
      state.start(false);
      state.changePlay("none");
      Router.go("/instructions");
    });

  }

  connectedCallback() {
    const currentState = state.getState();
    currentState.choisePlayerOne = false;
    currentState.choisePlayerGuest = false;
    this.render();
  }
  render() {
    const currentState = state.getState();
    const actualName = currentState.name;
    const playerOne = currentState.rtdbData.playerOne.userName;
    const playerGuest = currentState.rtdbData.playerGuest.userName;
    const styleBackground: HTMLElement = document.createElement("style");
    let winningPlayer = currentState.whoWins;

    let imgOfResults;
    //victoria del player One
    if (winningPlayer == "playerOne") {
      if (actualName == playerOne) {
        imgOfResults = resultsImages.victoryGame;
        styleBackground.innerHTML = `
        .div-container {
        background:var(--background-victory);  
        }`;
      }
      if (actualName == playerGuest) {
        imgOfResults = resultsImages.defeatedGame;
        styleBackground.innerHTML = `
        .div-container {
          background:var(--background-defeated);  
        }`;
      }
    }

    //victoria del player invitado
    if (winningPlayer == "playerGuest") {
      if (actualName == playerGuest) {
        imgOfResults = resultsImages.victoryGame;
        styleBackground.innerHTML = `
        .div-container {
        background:var(--background-victory);  
        }`;
      }
      if (actualName == playerOne) {
        imgOfResults = resultsImages.defeatedGame;
        styleBackground.innerHTML = `
        .div-container {
        background:var(--background-defeated);  
        }`;
      }
    }

    //empate entre los jugadores
    if (winningPlayer == "tie") {
      imgOfResults = resultsImages.tieGame;
      styleBackground.innerHTML = `
      .div-container {
        background:var(--background-tie);   
      }`;

    };

    const div: HTMLElement = document.createElement("div");
    div.classList.add("div-container");
    div.innerHTML = `
    <img src="${imgOfResults}" class="result-game-img" >
    <div class="container-results">
    <h2>Score</h2>
    <p>${playerOne}: ${currentState.history.playerOne}</p>
    <p>${playerGuest}: ${currentState.history.playerGuest}</p>
    </div>
    <button-component class="btn-replay-game">Volver a jugar</button-component>
    `;
    const style: HTMLElement = document.createElement("style");
    style.innerHTML = `
    .div-container {
      width: 100%;
      height: 100%;
      display: flex;
      flex-direction: column;
      justify-content: space-around;
      align-items: center;
      gap:20px;
      }

      .result-game-img {
      width: 250px;
      height:220px;
      }

      .container-results {
      background: #ffffff;
      width: 259px;
      border: 10px solid #000000;
      border-radius: 10px;
      display: flex;
      flex-direction: column;
      font-family: var(--font-button);
      }

      .container-results > h2 {
      margin: 0 auto;
      font-size: 55px;
      }

      .container-results > p {
      margin: 5px 10px;
      font-size: 45px;
      text-align: center;
      font-family: var(--font-button);
      font-size: 45px;
      color: #000;
      }
    `;

    this.shadow.appendChild(styleBackground);
    this.shadow.appendChild(style);
    this.shadow.appendChild(div);
    this.addListeners();
  }
}
customElements.define("results-page", Results);
