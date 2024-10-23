import Dogma from "../dogma/dogma";
import EntityManager from "../dogma/entityManager";
import Player from "./entities/player";
import "../style.css";
const main = Dogma.createWorld("main");
const min = Dogma.createWorld("min");
// console.log(Dogma.getActiveWorld.getComponentToRemove);
// console.log(Dogma.getActiveWorld.getAllComponentsList);
const player = new Player();
const playerTwo = new Player();
min.addSystem("Renderer");
EntityManager.addEntity(playerTwo);
EntityManager.addEntityToWorld(player, "main");
EntityManager.tickAll();
console.log(EntityManager.getManipulatedDataFromLastFrame);

min.removeSystem("Renderer");
EntityManager.removeEntity(playerTwo.getID);
EntityManager.removeEntityInWorld(player.getID, "main");
EntityManager.tickAll();
console.log(EntityManager.getManipulatedDataFromLastFrame);

console.log(Dogma.getAllWorlds);

// console.log(Dogma.getActiveWorld.getComponentToDispatch);
// console.log(Dogma.getActiveWorld.getAllComponentsList);
