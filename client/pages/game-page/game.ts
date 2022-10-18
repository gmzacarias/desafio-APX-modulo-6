import { Router } from "@vaadin/router";
import { state } from "../../state";

class GamePage extends HTMLElement {
  shadow: ShadowRoot;
  counter: number = 5;

  constructor() {
    super();
    this.shadow = this.attachShadow({ mode: "open" });

  }
  addListeners() {
    const countdown = setInterval(() => {
      this.counter--;
      const counterEl = this.shadow.querySelector(".counter-el");
      counterEl.textContent = String(this.counter);

      if (this.counter <= 0) {
        clearInterval(countdown);
      }
    }, 1000);

    const countdownEl = this.shadow.querySelector(".counter-el");
    const handsPlayerDiv = this.shadow.querySelector(".player-one-hands");
    const handsPlayerCont = this.shadow.querySelector(".player-one-hands").children;
    const handStonePlayer = this.shadow.querySelector(".stone-hand");
    const handPaperPlayer = this.shadow.querySelector(".paper-hand");
    const handScissorPlayer = this.shadow.querySelector(".scissor-hand");
    const handsPlayerGuest = this.shadow.querySelector(".player-guest-hands");
    const handStoneGuest = this.shadow.querySelector(".stone-hand-guest");
    const handPaperGuest = this.shadow.querySelector(".paper-hand-guest");
    const handScissorGuest = this.shadow.querySelector(".scissor-hand-guest");


    for (const hand of handsPlayerCont) {
      hand.addEventListener("click", () => {
        const type = hand.getAttribute("class");

        if (type === "stone-hand") {
          state.changePlay("stone");
          activeHands("stone");
        } else if (type === "paper-hand") {
          state.changePlay("paper");
          activeHands("paper");
        } else if (type === "scissor-hand") {
          state.changePlay("scissors");
          activeHands("scissors");
        }
        setTimeout(() => {
          clearInterval(countdown);
        }, 5000);
      });

      function activeHands(params) {
        if (params === "stone") {
          handStonePlayer.classList.remove("disabled");
          handStonePlayer.classList.add("actived");
          handScissorPlayer.classList.add("hand-display-disabled");
          handPaperPlayer.classList.add("hand-display-disabled");
        } else if (params === "paper") {
          handPaperPlayer.classList.remove("disabled");
          handPaperPlayer.classList.add("actived");
          handScissorPlayer.classList.add("hand-display-disabled");
          handStonePlayer.classList.add("hand-display-disabled");
        } else if (params === "scissors") {
          handScissorPlayer.classList.remove("disabled");
          handScissorPlayer.classList.add("actived");
          handStonePlayer.classList.add("hand-display-disabled");
          handPaperPlayer.classList.add("hand-display-disabled");
        }

        setTimeout(() => {
          countdownEl.remove();
        }, 4500);
      }
      setTimeout(() => {
        const currentState = state.getState();
        const actualName = currentState.name;
        const namePlayerOne = currentState.rtdbData.playerOne.userName;
        const namePlayerGuest = currentState.rtdbData.playerGuest.userName;
        let movePlayerOne = currentState.rtdbData.playerOne.moveChoise;
        let movePlayerGuest = currentState.rtdbData.playerGuest.moveChoise;

        let rivalPlayer;
        if (actualName === namePlayerOne) rivalPlayer = movePlayerGuest;
        if (actualName === namePlayerGuest) rivalPlayer = movePlayerOne;
        handsPlayerDiv.classList.add("active-hands");
        handsPlayerGuest.classList.add("actived-hands-guest");

        if (rivalPlayer == "stone") {
          handStoneGuest.classList.add("enabled-hand-guest");
        }
        if (rivalPlayer == "paper") {
          handPaperGuest.classList.add("enabled-hand-guest");
        }
        if (rivalPlayer == "scissors") {
          handScissorGuest.classList.add("enabled-hand-guest");
        }
      }, 6000);

      setTimeout(() => {
        const currentState = state.getState();
        const movePlayerOne = currentState.rtdbData.playerOne.moveChoise;
        const movePlayerGuest = currentState.rtdbData.playerGuest.moveChoise;

        if (movePlayerOne == "none" || movePlayerGuest == "none") {
          state.start(false);
          state.changePlay("none");
          Router.go("/instructions");
        } else {
          state.whoWins(() => {
            Router.go("/results");
          });
        }
      }, 7500);


    }
  }

  connectedCallback() {
    this.render();
  }
  render() {
    const div = document.createElement("div");
    div.className = "div-container";
    div.innerHTML = `
    <div class="counter-el">${this.counter}</div>
    <div class="player-guest-hands">
    <stone-component class="stone-hand-guest hand-display-disabled"></stone-component>
    <paper-component class="paper-hand-guest hand-display-disabled"></paper-component>
    <scissor-component class="scissor-hand-guest hand-display-disabled"></scissor-component>
    </div>
    <div class="player-one-hands">
    <stone-component class="stone-hand"></stone-component>
    <paper-component class="paper-hand"></paper-component>
    <scissor-component class="scissor-hand"></scissor-component>
    </div>
    `;
    const style = document.createElement("style");
    style.innerHTML = `
    .div-container {
      width: 100%;
      height: 100vh;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      align-items: center;
      }

      .player-one-hands {
      width: 100%;
      display: flex;
      justify-content: space-evenly;
      }
        
      .active-hands{
      height: 157px;
      }
        
      .counter-el {
      margin-top:150px;
      text-align:center;
      font-weight: bold;
      font-size: 200px;
      font-family: var(--font-button);
      }

      .actived {
      display: inherit;
      transform: translateY(-30px);
      transition: all 0.5s;
      }

      .disabled {
      opacity: 80%;
      }
        
      //css Player guest

      .player-guest-hands {
      display: flex;
      align-items: center;
      position: relative;
      top: -35px;
      transform: rotate(180deg);
      }
        
      .hand-display-disabled{
      display: none;   
      }

      .actived-hands-guest {
      width: 100%;
      height: 157px;
      display: flex;
      justify-content: center;
      transform: rotate(180deg);     
      }

      .enabled-hand-guest {
      display: flex;
      transform: translateY(-30px);
      transition: all 0.5s;
    }`;

    this.shadow.appendChild(div);
    this.shadow.appendChild(style);
    this.addListeners();
  }
}
customElements.define("game-page", GamePage);
