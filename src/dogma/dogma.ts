import EngineDebugger from "../utils/debbuger";
import { AbstractComponent } from "./component";
import { avalibleComponents, avalibleSystems } from "../sandbox/dogma.list";
import { AbstractSystem } from "./system";
import DogmaWorld from "./world";
//TODO: cos z tym zrobic
export const DOGMA_COMPONENTS_LIST = {
  AbstractComponent,
  ...avalibleComponents,
};
export const DOGMA_SYSTEM_LIST = {
  AbstractSystem,
  ...avalibleSystems,
};
export default class Dogma {
  private static worlds: Map<string, DogmaWorld> = new Map();
  private static activeWorld: DogmaWorld;
  public static get getActiveWorld() {
    return this.activeWorld;
  }

  public static get getActiveWorldName() {
    return this.activeWorld.getName;
  }

  public static get getAllWorlds() {
    return this.worlds;
  }
  public static getWorld(worldName: string) {
    const world = this.worlds.get(worldName);
    if (!world) EngineDebugger.showWarn(this.errorMsg("get", worldName));
    return world;
  }
  public static setActiveWorld(worldName: string) {
    const world = this.worlds.get(worldName);
    EngineDebugger.AssertValue(world, this.errorMsg("setActive", worldName));
    Dogma.activeWorld = world;
  }

  public static createWorld(worldName: string, startingWorld = true) {
    const world = new DogmaWorld({ worldName });
    this.worlds.set(worldName, world);
    if (startingWorld) this.activeWorld = world;
    return world;
  }

  public static removeWorld(worldName: string) {
    if (!this.worlds.has(worldName)) {
      EngineDebugger.showError(this.errorMsg("remove", worldName));
      return;
    }
    this.worlds.delete(worldName);
  }
  // Potencjalnie juz nie potrzebne bo onStart sie robi na ticku?
  // public static systemOnStart(worldName?: string) {
  //   const world = worldName ? this.worlds.get(worldName) : this.activeWorld;
  //   EngineDebugger.AssertValue(
  //     world,
  //     `Dogma Error: \nTrying to perform "SystemOnStart" on non-existent world.\nWorld Name: "${worldName}"`
  //   );
  //   world.getSystems.forEach((system) => system.onStart());
  // }
  public static systemOnUpdate(worldName?: string) {
    const world = worldName ? this.worlds.get(worldName) : this.activeWorld;
    EngineDebugger.AssertValue(
      world,
      `Dogma Error: \nTrying to perform "SystemOnUpdate" on non-existent world.\nWorld Name: "${worldName}"`
    );
    world.getSystems.forEach((system) => system.onUpdate());
  }

  private static errorMsg = (
    action: "setActive" | "remove" | "get",
    worldName: string
  ) =>
    `Dogma Error: \nTrying to ${action} world: "${worldName}" but there is no such world \nlist of worlds: \n ${[
      ...this.worlds.keys(),
    ].join("\n ")}`;
}
