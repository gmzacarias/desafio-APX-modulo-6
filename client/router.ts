import { Router } from "@vaadin/router";

const router = new Router(document.querySelector(".root"));
router.setRoutes([
  { path: "/", component: "set-name-page" },
  { path: "/home", component: "home-page" },
  { path: "/info-room", component: "info-room-page" },
  { path: "/join-room", component: "join-room-page" },
  { path: "/instructions", component: "instructions-page" },
  { path: "/waiting", component: "waiting-page" },
  { path: "/game", component: "game-page" },
  { path: "/results", component: "results-page" },
]);
