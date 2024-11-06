import EngineDebugger from "../utils/debbuger";
import DogmaComponent from "./component";
import Dogma from "./dogma";
import DogmaEntity from "./entity";
export default class EntityManager {
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
}
