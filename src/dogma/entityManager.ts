import EngineDebugger from "../utils/debbuger";
import DogmaComponent from "./component";
import Dogma, { DOGMA_SYSTEM_LIST } from "./dogma";
import DogmaEntity from "./entity";
import DogmaWorld from "./world";
//TODO: zarządzaj entity np by sie dalo usunac mu jakis tag konkretny i wszystkie jego komponenty musza to zaktualizwac
type ManipulatedOnFrame = { added: Set<string>; removed: Set<string> };
export default class EntityManager {
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
  public static tick(worldName?: string) {
    const world = worldName ? Dogma.getWorld(worldName) : Dogma.getActiveWorld;
    EngineDebugger.AssertValue(
      world,
      `Dogma Error: \nTrying to "dispatch tick" non-existent world.\nWorld Name: "${worldName}"`
    );
    //TODO: generuj raport co nie usunelo sie bo nie bylo, co sie nie moglo dodac itp
    this.clearManipulatedList();
    this.onTick(world);
    //TODO: potencjalnie tutaj po prostu onUpdate i tick robi wszystko?
    //Czy tick w takim razie nie powienien byc czescia glownej dogmy a nie managera?
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
  }
  private static clearManipulatedList() {
    this.EntitiesManipulatedOnFrame.added.clear();
    this.EntitiesManipulatedOnFrame.removed.clear();
    this.systemsManipulatedOnFrame.added.clear();
    this.systemsManipulatedOnFrame.removed.clear();
  }
  private static addSystemsOnTick(world: DogmaWorld) {
    world.getSystemsToDispatch.forEach((systemName) => {
      const key: keyof typeof DOGMA_SYSTEM_LIST =
        systemName ?? "AbstractSystem";
      const system = new DOGMA_SYSTEM_LIST[key]();
      world.getSystems.set(systemName, system);
      system.onStart();
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
    });
    dispatchList.clear();
  }
  private static removeEntitiesOnTick(world: DogmaWorld) {
    const removalList = world.getComponentToRemove;
    const components = world.getAllComponentsList;
    removalList.forEach((entityID) => {
      components.forEach((componentList) => componentList.delete(entityID));
      this.EntitiesManipulatedOnFrame.removed.add(entityID);
    });
    removalList.clear();
  }
  public static addEntity(entity: DogmaEntity) {
    const list = Dogma.getActiveWorld.getComponentToDispatch;
    entity.getComponents.forEach((component) => {
      list.add(component);
    });
  }
  public static removeEntity(entityID: DogmaEntity["id"]) {
    Dogma.getActiveWorld.getComponentToRemove.add(entityID);
  }
  public static addEntityToWorld(entity: DogmaEntity, worldName: string) {
    const world = Dogma.getWorld(worldName);
    EngineDebugger.AssertValue(
      world,
      `Dogma Error: \nTrying to add entity "${entity.constructor.name} to non-existent world: "${worldName}".`
    );
    const list = world.getComponentToDispatch;
    entity.getComponents.forEach((component) => {
      list.add(component);
    });
  }
  public static removeEntityInWorld(
    entityID: DogmaEntity["id"],
    worldName: string
  ) {
    const world = Dogma.getWorld(worldName);
    EngineDebugger.AssertValue(
      world,
      `Dogma Error: \nTrying to remove entity with ID "${entityID} to non-existent world: "${worldName}".`
    );
    world.getComponentToRemove.add(entityID);
  }
  public static moveEntityById(
    id: DogmaEntity["id"],
    fromWorld: string,
    toWorld: string
  ) {
    const entityStruct = new Set<DogmaComponent>();
    const worldAComponents = Dogma.getWorld(fromWorld)?.getAllComponentsList;
    const worldBComponents = Dogma.getWorld(toWorld)?.getAllComponentsList;
    if (worldAComponents === undefined || worldBComponents === undefined) {
      const nonExist = worldAComponents === undefined ? fromWorld : toWorld;
      EngineDebugger.showWarn(
        `Dogma Warn: \nTrying to move entity with id "${id}", from world: "${fromWorld}" to world: "${toWorld}".\nCannot find world with name: "${nonExist}"`
      );
      return;
    }
    worldAComponents.forEach((list) => {
      const component = list.get(id);
      if (!component) return;
      entityStruct.add(component);
      list.delete(id);
    });
    if (entityStruct.size === 0) {
      EngineDebugger.showWarn(
        `Dogma Warn: \nTrying to move entity with id "${id}", from world: "${fromWorld}" to world: "${toWorld}".\nCannot find entity with given ID in world: "${fromWorld}"`
      );
      return;
    }
    entityStruct.forEach((component) => {
      worldBComponents.get(component.constructor.name)?.set(id, component);
    });
  }
  public static moveEntityToWorldByMarker() {}
  public static moveEntitiesGroupToWorldByTag() {}
}
