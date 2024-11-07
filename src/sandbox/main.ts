import Dogma from "../dogma/dogma";
import EntityManager from "../dogma/entityManager";
import Player from "./entities/player";
import "../style.css";
import PlayerTwo from "./entities/playerTwo";
// const main = Dogma.createWorld("main");
const min = Dogma.createWorld("min");
// console.log(Dogma.getActiveWorld.getComponentToRemove);
// console.log(Dogma.getActiveWorld.getAllComponentsList);
const player = new PlayerTwo();
const playerTwo = new Player();
min.addSystem("Renderer");
EntityManager.addEntity(playerTwo);
EntityManager.addEntity(player);
// EntityManager.addEntityToWorld(player, "main");
Dogma.tickAll();
// Dogma.tickAll();
// console.log(EntityManager.getManipulatedDataFromLastFrame);

min.removeSystem("Renderer");
// Dogma.tickAll();

// EntityManager.removeEntity(playerTwo.getID);
// EntityManager.removeEntityInWorld(player.getID, "main");
// EntityManager.tickAll();
// console.log(EntityManager.getManipulatedDataFromLastFrame);
// EntityManager.moveEntityById(playerTwo.getID, "min", "main");
console.log(Dogma.getAllWorlds);

// console.log(Dogma.getActiveWorld.getComponentToDispatch);
// console.log(Dogma.getActiveWorld.getAllComponentsList);
