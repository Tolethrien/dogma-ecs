import DogmaComponent from "./component";
import type { DogmaComponentsKeys, DogmaSystemsKeys } from "./types";
import DogmaWorld from "./world";
import DOGMA_CONFIG from "../sandbox/dogma-config";
export type SystemComponent<T extends DogmaComponentsKeys> =
  (typeof DOGMA_CONFIG.DOGMA_COMPONENTS_LIST)[T] extends new (
    ...args: any[]
  ) => infer R
    ? R
    : never;

export type SystemComponentList<T extends DogmaComponentsKeys> = Map<
  string,
  SystemComponent<T>
>;

type ReturnFromAllTags = {
  matchAllTags: string[];
  matchAnyTag?: never;
  components?: DogmaComponentsKeys[];
};

type ReturnFromAnyTag = {
  matchAllTags?: never;
  matchAnyTag: string[];
  components?: DogmaComponentsKeys[];
};

type ReturnFrom = Partial<ReturnFromAllTags> | Partial<ReturnFromAnyTag>;

export default abstract class DogmaSystem {
  private isActive: boolean;
  private world!: DogmaWorld;
  constructor() {
    this.isActive = true;
    this.world;
  }
  public get getIsActive() {
    return this.isActive;
  }

  public set setIsActive(bool: boolean) {
    this.isActive = bool;
  }
  /**
   * DO NOT USE! This is set on system creation automatically
   */
  public set atCreateAttachWorld(world: DogmaWorld) {
    this.world = world;
  }
  onUpdate() {
    //override
  }
  onStart() {
    //override
  }
  onDestroy() {
    //override
  }
  selfDestroy() {
    this.world.removeSystem(this.constructor.name as DogmaSystemsKeys);
  }
  getComponentWithMarker<T extends DogmaComponentsKeys>(
    component: T,
    marker: string
  ) {
    const list = this.world.getComponentsFrom(component);
    for (const component of list.values()) {
      if (component.entityMarker[0] === marker) {
        return component as SystemComponent<T>;
      }
    }
  }
  getComponentWithID<T extends DogmaComponentsKeys>(component: T, id: string) {
    const list = this.world.getComponentsFrom(component);
    for (const component of list.values()) {
      if (component.entityID === id) {
        return component as SystemComponent<T>;
      }
    }
  }
  getComponentsList<T extends DogmaComponentsKeys>(component: T) {
    return this.world.getComponentsFrom(component) as SystemComponentList<T>;
  }
  getComponentsListWith<T extends DogmaComponentsKeys>(
    component: T,
    options: ReturnFrom
  ): SystemComponentList<T> {
    const mainComponentList = this.world.getComponentsFrom(component);
    const filteredList: Map<string, DogmaComponent> = new Map();
    if ("matchAllTags" in options) {
      mainComponentList.forEach((entity) => {
        if (options.matchAllTags!.every((tag) => entity.entityTags.has(tag))) {
          filteredList.set(entity.entityID, entity);
        }
      });
    } else if ("matchAnyTag" in options) {
      mainComponentList.forEach((entity) => {
        if (options.matchAnyTag!.some((tag) => entity.entityTags.has(tag))) {
          filteredList.set(entity.entityID, entity);
        }
      });
    } else {
      mainComponentList.forEach((component) =>
        filteredList.set(component.entityID, component)
      );
    }
    if ("components" in options) {
      options.components?.forEach((componentName) => {
        const componentList = this.world.getComponentsFrom(componentName);
        filteredList.forEach((component) => {
          if (!componentList.has(component.entityID)) {
            filteredList.delete(component.entityID);
          }
        });
      });
    }
    return filteredList as SystemComponentList<T>;
  }
}
