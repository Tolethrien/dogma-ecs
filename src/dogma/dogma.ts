import EngineDebugger from "../utils/debbuger";
import DogmaWorld from "./world";
import DOGMA_CONFIG from "../sandbox/dogma-config";

type ManipulatedOnFrame = { added: Set<string>; removed: Set<string> };

export default class Dogma {
  private static worlds: Map<string, DogmaWorld> = new Map();
  private static activeWorld: DogmaWorld;
  private static EntitiesManipulatedOnFrame: ManipulatedOnFrame = {
    added: new Set(),
    removed: new Set(),
  };
  private static systemsManipulatedOnFrame = {
    added: new Set(),
    removed: new Set(),
  };
  public static get getComponentsManipulatedOnFrame() {
    return this.EntitiesManipulatedOnFrame;
  }
  public static get getSystemsManipulatedOnFrame() {
    return this.systemsManipulatedOnFrame;
  }
  public static get getManipulatedDataFromLastFrame() {
    return {
      entities: this.EntitiesManipulatedOnFrame,
      systems: this.systemsManipulatedOnFrame,
    };
  }
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

  public static systemOnUpdate(worldName?: string) {
    const world = worldName ? this.worlds.get(worldName) : this.activeWorld;
    EngineDebugger.AssertValue(
      world,
      `Dogma Error: \nTrying to perform "SystemOnUpdate" on non-existent world.\nWorld Name: "${worldName}"`
    );
    world.getSystems.forEach(
      (system) => system.getIsActive && system.onUpdate()
    );
  }
  public static tick(worldName?: string) {
    const world = worldName ? Dogma.getWorld(worldName) : Dogma.getActiveWorld;
    EngineDebugger.AssertValue(
      world,
      `Dogma Error: \nTrying to "dispatch tick" non-existent world.\nWorld Name: "${worldName}"`
    );
    //TODO: generuj raport co nie usunelo sie bo nie bylo, co sie nie moglo dodac itp
    this.clearManipulatedList();
    this.onTick(world);
  }

  public static tickAll() {
    this.clearManipulatedList();
    Dogma.getAllWorlds.forEach((world) => {
      this.onTick(world);
    });
  }
  private static onTick(world: DogmaWorld) {
    this.removeEntitiesOnTick(world);
    this.addEntitiesOnTick(world);
    this.removeSystemsOnTick(world);
    this.addSystemsOnTick(world);
    this.systemOnUpdate();
  }
  private static clearManipulatedList() {
    this.EntitiesManipulatedOnFrame.added.clear();
    this.EntitiesManipulatedOnFrame.removed.clear();
    this.systemsManipulatedOnFrame.added.clear();
    this.systemsManipulatedOnFrame.removed.clear();
  }
  private static addSystemsOnTick(world: DogmaWorld) {
    world.getSystemsToDispatch.forEach((systemName) => {
      const key: keyof typeof DOGMA_CONFIG.DOGMA_SYSTEM_LIST =
        systemName ?? "AbstractSystem";
      const system = new DOGMA_CONFIG.DOGMA_SYSTEM_LIST[key]();
      system.atCreateAttachWorld = world;
      system.onStart();
      world.getSystems.set(systemName, system);
      this.systemsManipulatedOnFrame.added.add(systemName);
    });
    world.getSystemsToDispatch.clear();
  }
  private static removeSystemsOnTick(world: DogmaWorld) {
    const systemsList = world.getSystems;
    world.getSystemsToRemove.forEach((systemName) => {
      const system = systemsList.get(systemName);
      if (system) {
        system.onDestroy();
        systemsList.delete(systemName);
        this.systemsManipulatedOnFrame.removed.add(systemName);
      } else {
        EngineDebugger.showWarn(
          `Dogma Warn\nTrying to remove system "${systemName}" from world "${world.getName}" but there is no such system`
        );
      }
    });
    world.getSystemsToRemove.clear();
  }

  private static addEntitiesOnTick(world: DogmaWorld) {
    const dispatchList = world.getComponentToDispatch;
    const components = world.getAllComponentsList;
    dispatchList.forEach((component) => {
      const componentList = components.get(component.constructor.name)!;
      componentList.set(component.entityID, component);
      this.EntitiesManipulatedOnFrame.added.add(component.entityID);
      world.getEntitiesInWorld.add(component.entityID);
    });
    dispatchList.clear();
  }
  private static removeEntitiesOnTick(world: DogmaWorld) {
    const removalList = world.getComponentToRemove;
    const components = world.getAllComponentsList;
    removalList.forEach((entityID) => {
      components.forEach((componentList) => componentList.delete(entityID));
      this.EntitiesManipulatedOnFrame.removed.add(entityID);
      world.getEntitiesInWorld.delete(entityID);
    });
    removalList.clear();
  }

  private static errorMsg = (
    action: "setActive" | "remove" | "get",
    worldName: string
  ) =>
    `Dogma Error: \nTrying to ${action} world: "${worldName}" but there is no such world \nlist of worlds: \n ${[
      ...this.worlds.keys(),
    ].join("\n ")}`;
}
