import { rtdb } from "./rtdb";

const API_BASE_URL = "https://app-apx-stone-paper-scissor.herokuapp.com";
// const API_BASE_URL = "http://localhost:3000";

const state = {
  data: {
    name: null,
    userId: null,
    roomId: null,
    rtdbRoomId: null,
    rtdbData: {},
    choisePlayerOne: false,
    choisePlayerGuest: false,
    history: {
      playerOne: 0,
      playerGuest: 0,
    },
    whoWins: null,
  },
  listeners: [],

  getState() {
    return this.data;
  },

  setState(newState) {
    this.data = newState;
    for (const cb of this.listeners) {
      cb();
    }
  },

  //guardar el nombre del usuario
  setName(userName) {
    const currentState = this.getState();
    currentState.name = userName;
    this.setState(currentState);
  },

  //guardar el id del usuario
  setUserId(userId) {
    const currentState = this.getState();
    currentState.userId = userId;
    this.setState(currentState);
  },

  //guardar el id corto de la room
  setRoomId(roomId) {
    const currentState = this.getState();
    if (roomId !== undefined) {
      currentState.roomId = roomId;
      this.setState(currentState);
    }
  },

  // guardar el id largo
  setRtdbId(longId) {
    const currentState = this.getState();
    currentState.rtdbRoomId = longId;
    this.setState(currentState);
  },

  //chequeo del estado de los jugadores en la rtdb.
  checkPlayer() {
    const currentState = this.getState();
    const checkplayerOne = currentState.rtdbData.playerOne.userName;
    const checkplayerGuest = currentState.rtdbData.playerGuest.userName;
    let player: string;

    if (currentState.name == checkplayerOne) {
      player = "playerOne";
    }
    if (currentState.name == checkplayerGuest) {
      player = "playerGuest";
    }
    return player;
  },

  //chequeo del estado de los jugadores.
  checkPlayerFront() {
    const cs = this.getState();
    const namePlayerOne = cs.rtdbData.playerOne.userName;
    const namePlayerGuest = cs.rtdbData.playerGuest.userName;
    let player: string;

    if (cs.name == namePlayerOne) {
      player = namePlayerOne;
    }
    if (cs.name == namePlayerGuest) {
      player = namePlayerGuest;
    }
    return player;
  },

  //crer el usuario.
  createUser(callback?, idRoomInput?) {
    const cs = this.getState();
    const name = cs.name;
    if (cs.name) {
      fetch(`${API_BASE_URL}/signup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name: name }),
      })
        .then(data => {
          return data.json();
        })
        .then(res => {
          cs.userId = res.id.toString();
          this.setState(cs);

          if (idRoomInput) {
            this.authRoomId(idRoomInput, callback);
          } else {
            this.createRoom(callback);
          }
        });
    } else {
      console.log(name)
    }
  },

  //crear la room.
  createRoom(callback?) {
    const currentState = this.getState();
    const userId = currentState.userId;
    const name = currentState.name;
    if (currentState.userId) {
      fetch(`${API_BASE_URL}/rooms`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId: userId, userName: name }),
      })
        .then(data => {
          return data.json();
        })
        .then(res => {
          currentState.roomId = res.id.toString();
          this.setState(currentState);
          this.connectToRoom(callback);
        });
    }
  },

  //autorizar el ingreso a la room.
  authRoomId(roomIdInput, callback?) {
    const currentState = this.getState();

    fetch(`${API_BASE_URL}/auth/rooms`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id: roomIdInput }),
    })
      .then(data => {
        return data.json();
      })
      .then(res => {
        if (res.id) {
          currentState.roomId = res.id;
          this.setState(currentState);
          this.connectToRoom(callback);
        } else {
          alert(res.message);
        }
      });
  },

  //agregar el jugador invitado a la sala.
  addPlayerGuest() {
    const currentState = this.getState();
    const roomIdInput = currentState.roomId;
    fetch(`${API_BASE_URL}/rooms/playerGuest`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id: roomIdInput, playerGuest: currentState.name }),
    })
      .then(data => {
        return data.json();
      })
      .then(res => {
        if (res.id) {
          return res.message;
        } else {
          alert(res.message);
        }
      });
  },


  //conectarse a la room.
  connectToRoom(callback?) {
    const currentState = this.getState();
    if (currentState.roomId && currentState.userId) {
      fetch(`${API_BASE_URL}/rooms/${currentState.roomId}?userId=${currentState.userId}`)
        .then(data => {
          return data.json();
        })
        .then(res => {
          currentState.rtdbRoomId = res.rtdbId;
          this.setState(currentState);
          this.checkStatusOnline(callback);
        });
    }
  },

  //status de la rooms,si hay mas de dos jugadores
  checkStatusOnline(callback?) {
    const currentState = this.getState();
    fetch(`${API_BASE_URL}/rooms/status/${currentState.rtdbRoomId}`)
      .then(data => {
        return data.json();
      })
      .then(res => {
        const onlinePlayerOne = res.playerOne.online;
        const namePlayerOne = res.playerOne.userName;
        const onlinePlayerGuest = res.playerGuest.online;

        if (onlinePlayerOne && onlinePlayerGuest) {
          alert(
            "Ya hay dos jugadores conectados a la sala que deseas ingresar."
          );
        } else if (
          onlinePlayerOne == true &&
          onlinePlayerGuest == false &&
          namePlayerOne == currentState.name
        ) {
          this.listenRoom(callback);
        } else if (onlinePlayerOne == true && onlinePlayerGuest == false) {
          this.changeNamePlayerGuest();
          this.addPlayerGuest();
          this.listenRoom(callback);
        }
      });
  },

  //escuchar la room.
  listenRoom(callback?) {
    const currentState = this.getState();
    const chatRoomRef = rtdb.ref(`/rooms/${currentState.rtdbRoomId}`);
    chatRoomRef.on("value", snapshot => {
      const currentState = this.getState();
      const value = snapshot.val();
      currentState.rtdbData = value;
      this.setState(currentState);
    });
    if (callback) callback();
  },


  changeNamePlayerGuest(callback?) {
    const currentState = this.getState();
    const name = currentState.name;
    if (name) {
      fetch(`${API_BASE_URL}/rooms/user/${currentState.rtdbRoomId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name }),
      })
        .then(data => {
          return data.json();
        })
        .then(res => {
          if (callback) callback();
          return res;
        });
    }
  },

  //cambiar el status de los jugadores de la sala.
  changeOnlineStatus(status: boolean, callback?) {
    const currentState = this.getState();
    const player = this.checkPlayer();
    if (currentState.name) {
      fetch(`${API_BASE_URL}/rooms/user/status/${currentState.rtdbRoomId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ player, onlineStatus: status }),
      })
        .then(data => {
          return data.json();
        })
        .then(res => {
          if (callback) callback();
          return res;
        });
    }
  },

  // iniciar juego,jugadas,establecer ganadores segun la jugada.

  start(status) {
    const currentState = this.getState();
    const player = this.checkPlayer();

    fetch(`${API_BASE_URL}/rooms/${currentState.rtdbRoomId}/player/start`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ start: status, player }),
    })
      .then(data => {
        return data.json();
      })
      .then(res => res);
  },

  changePlay(movePlayer) {
    const currentState = this.getState();
    const player = this.checkPlayer();

    fetch(`${API_BASE_URL}/rooms/${currentState.rtdbRoomId}/player/movement`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ moveChoise: movePlayer, player }),
    })
      .then(data => {
        return data.json();
      })
      .then(res => {
        return res;
      });
  },



  whoWins(callback) {
    const currentState = this.getState();
    const movePlayerOne = currentState.rtdbData.playerOne.moveChoise;
    const movePlayerGuest = currentState.rtdbData.playerGuest.moveChoise;
    let scorePlayerOne = currentState.history.playerOne;
    let scorePlayerGuest = currentState.history.playerGuest;

    // gana el playerOne si:
    const playerOneWins = [
      movePlayerOne === "stone" && movePlayerGuest === "scissors",
      movePlayerOne === "paper" && movePlayerGuest === "stone",
      movePlayerOne === "scissors" && movePlayerGuest === "paper",
    ].includes(true);

    // gana el playerGuest si:
    const playerGuestWins = [
      movePlayerGuest === "stone" && movePlayerOne === "scissors",
      movePlayerGuest === "paper" && movePlayerOne === "stone",
      movePlayerGuest === "scissors" && movePlayerOne === "paper",
    ].includes(true);

    // suma de puntos al jugador que gana:
    if (playerOneWins) {
      scorePlayerOne++;
      currentState.whoWins = "playerOne";
      this.updateScore(callback, scorePlayerOne++, scorePlayerGuest);
    } else if (playerGuestWins) {
      scorePlayerGuest++;
      currentState.whoWins = "playerGuest";
      this.updateScore(callback, scorePlayerOne, scorePlayerGuest++);
    } else {
      currentState.whoWins = "tie";
      this.updateScore(callback, scorePlayerOne, scorePlayerGuest);
    }
    this.setState(currentState);
  },

  //puntos,actualizacion de puntos,resultados

  getScore(callback) {
    const currentState = this.getState();
    const history = currentState.history;
    if (currentState.roomId && currentState.userId) {
      fetch(`${API_BASE_URL}/rooms/${currentState.roomId}?userId=${currentState.userId}`)
        .then(data => {
          return data.json();
        })
        .then(res => {
          history.playerOne = res.scorePlayerOne;
          history.playerGuest = res.scorePlayerGuest;
          this.setState(currentState);
          callback();
        });
    }
  },

  updateScore(callback, scorePlayerOne, scorePlayerGuest) {
    const currentState = this.getState();
    const roomId = currentState.roomId;

    fetch(`${API_BASE_URL}/rooms/score`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id: roomId, playerOne: scorePlayerOne, playerGuest: scorePlayerGuest }),
    })
      .then(data => {
        return data.json();
      })
      .then(res => {
        this.getScore(callback);
        return res;
      });
  },

  //avisa cuando un componente,cambia de estado
  suscribe(callback: (any) => any) {
    this.listeners.push(callback);
  },

};

export { state };
