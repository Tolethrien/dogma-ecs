import EngineDebugger from "../utils/debbuger";
import DogmaComponent from "./component";
import Dogma from "./dogma";
import DogmaEntity from "./entity";
import { DogmaComponentsKeys, DogmaComponentsKeysInternal } from "./types";
interface EntityWrapStruct {
  id: string;
  tags: Set<string>;
  marker: string[];
  getComponents: Map<DogmaComponentsKeysInternal, DogmaComponent>;
}
export default class EntityManager {
  public static addEntity(entity: DogmaEntity | EntityWrapStruct) {
    const list = Dogma.getActiveWorld.getComponentToDispatch;
    entity.getComponents.forEach((component) => {
      list.add(component);
    });
  }
  public static removeEntity(entityID: DogmaEntity["id"]) {
    Dogma.getActiveWorld.getComponentToRemove.add(entityID);
  }
  public static addEntityToWorld(
    entity: DogmaEntity | EntityWrapStruct,
    worldName: string
  ) {
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
  //TODO
  public static addEnityTag(entityID: DogmaEntity["id"], tag: string) {
    const worldName = this.getWorldName(entityID);
    const entityData = this.getEntityData(entityID, worldName);
    if (!entityData) {
      EngineDebugger.showWarn(
        `Dogma Warn: \nTrying to add tag: "${tag}" to entity with id "${entityID}" in world "${worldName}". There is no such entity!`
      );
      return;
    }
    entityData.entityTags.add(tag);
  }
  public static removeEnityTag(entityID: DogmaEntity["id"], tag: string) {
    const worldName = this.getWorldName(entityID);
    const entityData = this.getEntityData(entityID, worldName);

    if (!entityData) {
      EngineDebugger.showWarn(
        `Dogma Warn: \nTrying to remove tag: "${tag}" from entity with id "${entityID}" in world "${worldName}". There is no such entity!`
      );
      return;
    }
    entityData.entityTags.delete(tag);
  }

  public static setEnityMarker(entityID: DogmaEntity["id"], marker: string) {
    const worldName = this.getWorldName(entityID);
    const entityData = this.getEntityData(entityID, worldName);

    if (!entityData) {
      EngineDebugger.showWarn(
        `Dogma Warn: \nTrying to set marker: "${marker}" in entity with id "${entityID}" in world "${worldName}". There is no such entity!`
      );
      return;
    }
    entityData.entityMarker[0] = marker;
  }
  public static removeEnityMarker(entityID: DogmaEntity["id"]) {
    const worldName = this.getWorldName(entityID);
    const entityData = this.getEntityData(entityID, worldName);

    if (!entityData) {
      EngineDebugger.showWarn(
        `Dogma Warn: \nTrying to remove marker from entity with id "${entityID}" in world "${worldName}". There is no such entity!`
      );
      return;
    }
    entityData.entityMarker[0] = "";
  }

  private static getEntityData(
    entityID: DogmaEntity["id"],
    worldName: string | undefined
  ) {
    if (!worldName) return;
    let entityData: DogmaComponent | undefined = undefined;

    const componentsTypesList = Dogma.getWorld(worldName)!.getAllComponentsList;
    for (const components of componentsTypesList.values()) {
      const find = components.get(entityID);
      if (find) {
        entityData = find;
        return entityData;
      }
    }
  }
  /**
   * This WILL remove entity from world!
   */
  public static wrapEntity(entityID: DogmaEntity["id"]) {
    const entity: EntityWrapStruct = {
      getComponents: new Map(),
      id: entityID,
      marker: [""],
      tags: new Set(),
    };
    const worldName = this.getWorldName(entityID);
    if (!worldName) {
      EngineDebugger.showWarn(`Dogma Warn: \nTrying Wrap Entity.`);
      return;
    }
    const components = Dogma.getWorld(worldName)!.getAllComponentsList;
    components.forEach((list) => {
      const component = list.get(entityID);
      if (component)
        entity.getComponents.set(
          component.constructor.name as DogmaComponentsKeys,
          component
        );
    });
    for (const component of entity.getComponents.values()) {
      entity.marker = component.entityMarker;
      entity.tags = component.entityTags;
      break;
    }
    this.removeEntityInWorld(entityID, worldName);
    return entity;
  }

  private static getWorldName(entityID: DogmaEntity["id"]) {
    for (const world of Dogma.getAllWorlds.values()) {
      if (world.getEntitiesInWorld.has(entityID)) {
        return world.getName;
      }
    }
    EngineDebugger.showWarn(
      `Dogma Warn: \nEntity with ID ${entityID} does not exist in any of the worlds.`
    );
  }
}
