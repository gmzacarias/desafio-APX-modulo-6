import { firestore, rtdb } from "./db";
import { nanoid } from "nanoid";
import * as express from "express";
import * as path from "path";
import * as cors from "cors";


const app = express();
const port = process.env.PORT || 3000;
app.use(express.json());
app.use(cors());

app.get("/env", (req, res) => {
  res.json({
    environment: process.env.NODE_ENV,
  });
});


const userCollection = firestore.collection("users");
const roomsCollection = firestore.collection("rooms");

// crear usuario
app.post("/signup", (req, res) => {
  const { name } = req.body;

  userCollection
    .where("name", "==", name)
    .get()
    .then(snap => {
      if (snap.empty) {
        userCollection
          .add({
            name: name,
          })
          .then(newUserDoc => {
            res.status(201).json({
              id: newUserDoc.id,
              new: true,
            });
          });
      } else {
        res.status(200).json({
          id: snap.docs[0].id,
          message: "Nombre existente",
        });
      }
    });
});

//autorizar a jugadores a ingresar a la sala.
app.post("/auth/rooms", (req, res) => {
  const { id } = req.body;

  roomsCollection
    .doc(id.toString())
    .get()
    .then(doc => {
      if (doc.exists) {
        res.status(200).json({
          id: doc.id,
          message: `Estas autorizado a ingresar a la sala ${id}.`,
        });
      } else {
        res.status(400).json({
          message: `La sala ${id} no existe, por favor, ingrese un ID válido.`,
        });
      }
    });
});

//guardar el nombre del jugador invitado a la sala.
app.put("/rooms/playerGuest", (req, res) => {
  const { id, playerGuest } = req.body;

  roomsCollection
    .doc(id.toString())
    .update("playerGuest", playerGuest)
    .then(doc => {
      if (doc.writeTime) {
        res.status(200).json({
          id: id,
          message: `El nombre ${playerGuest} se ha escrito correctamente`,
        });
      } else {
        return `Hubo un error al guardar el nombre del jugador invitado.`;
      }
    });
});

//crear la sala en la RTDB.
app.post("/rooms", (req, res) => {
  const { userId, userName } = req.body;

  userCollection
    .doc(userId.toString())
    .get()
    .then(doc => {
      const roomRef = rtdb.ref("/rooms/" + nanoid());
      roomRef
        .set({
          playerOne: {
            userName: userName,
            moveChoise: "none",
            start: false,
            online: true,
          },
          playerGuest: {
            userName: false,
            moveChoise: "none",
            start: false,
            online: false,
          },
        })
        .then(() => {
          const roomLongId = roomRef.key;
          const roomId = 1000 + Math.floor(Math.random() * 999);
          roomsCollection
            .doc(roomId.toString())
            .set({
              rtdbId: roomLongId,
              playerOne: userName,
              scorePlayerOne: 0,
              scorePlayerGuest: 0,
            })
            .then(() => {
              res.status(200).json({
                id: roomId,
              });
            });
        });
    });
});

//actualizar score de los jugadores que hay en la sala.
app.put("/rooms/score", (req, res) => {
  const { id, playerOne, playerGuest } = req.body;

  roomsCollection
    .doc(id.toString())
    .update({
      scorePlayerOne: playerOne,
      scorePlayerGuest: playerGuest,
    })
    .then(doc => {
      if (doc.writeTime) {
        res.status(200).json({
          id: id,
          message: `La puntuacion se actualizo correctamente.`,
        });
      } else {
        return `Hubo un problema en actualizar la puntuacion.`;
      }
    });
});


//obtener el room
app.get("/rooms/:roomId", (req, res) => {
  const { roomId } = req.params;
  const { userId } = req.query;

  userCollection
    .doc(userId.toString())
    .get()
    .then(doc => {
      if (doc.exists) {
        roomsCollection
          .doc(roomId)
          .get()
          .then(snap => {
            const data = snap.data();
            res.status(200).json(data);
          });
      } else {
        res.status(401).json({
          message: "El usuario no existe.",
        });
      }
    });
});

// escuchar la room.
app.get("/rooms/data/:id", (req, res) => {
  const chatRoomRef = rtdb.ref(`/rooms/${req.params.id}`);
  chatRoomRef.on("value", snap => {
    res.status(200).json(snap.val());
  });
});
app.get("/rooms/status/:id", (req, res) => {
  const chatRoomRef = rtdb.ref(`/rooms/${req.params.id}`);
  chatRoomRef.once("value", snap => {
    res.status(200).json(snap.val());
  });
});

//actualizar el nombre del jugador invitado y el status.
app.put("/rooms/user/:id", (req, res) => {
  const { name } = req.body;
  const chatRoomRef = rtdb.ref(`/rooms/${req.params.id}/playerGuest`);
  chatRoomRef.update(
    {
      userName: name,
      online: true,
    },
    () => {
      res.status(200).json({
        message: `PlayerGuest has changed the userName.${name}`,
      });
    }
  );
});

//actualizar el status de los jugadores de la sala
app.put("/rooms/user/status/:id", (req, res) => {
  const { player, onlineStatus } = req.body;
  const chatRoomRef = rtdb.ref(`/rooms/${req.params.id}/${player}`);
  chatRoomRef.update(
    {
      online: onlineStatus,
    },
    () => {
      res.status(200).json({
        message: `${player} has changed the onlineStatus:${onlineStatus}`,
      });
    }
  );
});

//actualizar el estado de los jugadores e iniciar el juego.
app.put("/rooms/:id/player/start", (req, res) => {
  const { player, start } = req.body;
  const chatRoomRef = rtdb.ref(`/rooms/${req.params.id}/${player}`);
  chatRoomRef.update(
    {
      start,
    },
    () => {
      res.status(200).json({
        message: `${player} is start.`,
      });
    }
  );
});

//actualizar movimientos de los jugadores
app.put("/rooms/:id/player/movement", (req, res) => {
  const { player, moveChoise } = req.body;
  const chatRoomRef = rtdb.ref(`/rooms/${req.params.id}/${player}`);
  chatRoomRef.update(
    {
      moveChoise,
    },
    () => {
      res.status(200).json({
        message: `${player} moveChoise: ${moveChoise}.`,
      });
    }
  );
});



const relativeRoute = path.resolve(__dirname, "../dist");

app.use(express.static(relativeRoute));
app.get("*", (req, res) => {
  res.sendFile(relativeRoute, +"/index.html");
});

app.listen(port, () => {
  console.log(`listen the port: ${port}`);
});
