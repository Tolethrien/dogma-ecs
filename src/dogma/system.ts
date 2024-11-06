import DogmaComponent from "./component";
import { DOGMA_COMPONENTS_LIST } from "./dogma";
import DogmaWorld from "./world";

type OmitedComponent = keyof Omit<
  typeof DOGMA_COMPONENTS_LIST,
  "AbstractComponent"
>;

type SystemComponent<T extends OmitedComponent> =
  (typeof DOGMA_COMPONENTS_LIST)[T] extends new (...args: any[]) => infer R
    ? R
    : never;
type SystemComponentList<T extends OmitedComponent> = Map<
  string,
  SystemComponent<T>
>;

type ReturnFromMarker = { marker: string; tags?: never };
type ReturnFromTags = { tags: string[]; marker?: never };

type FilterReturnType<
  T extends OmitedComponent,
  O extends ReturnFromMarker | ReturnFromTags
> = O extends ReturnFromMarker
  ? SystemComponent<T> | undefined
  : SystemComponentList<T>;

export default abstract class DogmaSystem {
  private isActive: boolean;
  private isSelfDestroy: boolean;
  private world: DogmaWorld | undefined;
  constructor() {
    this.isActive = true;
    this.isSelfDestroy = false;
    this.world = undefined;
  }
  public get getIsActive() {
    return this.isActive;
  }
  public get getIsSelfDestroy() {
    return this.isSelfDestroy;
  }
  public set setIsActive(bool: boolean) {
    this.isActive = bool;
  }
  /**
   * DO NOT USE! This is set on system creation automatically
   */
  public attatchWorld(world: DogmaWorld) {
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

  getComponentsList<T extends OmitedComponent>(component: T) {
    return this.world!.getComponentsFrom(component) as SystemComponentList<T>;
  }
  getComponentsListWith<
    T extends OmitedComponent,
    O extends ReturnFromMarker | ReturnFromTags
  >(component: T, options: O): FilterReturnType<T, O> {
    const list = this.world!.getComponentsFrom(component);

    if ("marker" in options) {
      for (const component of list.values()) {
        if (component.entityMarker === options.marker) {
          return component as FilterReturnType<T, O>;
        }
      }
    } else if ("tags" in options) {
      const filteredList: Map<string, DogmaComponent> = new Map();
      //TODO: zrobic by loopowalo przez wszystkie tagi a nie uzywalo 0
      list.forEach((entity) => {
        if (entity.entityTags.has(options.tags[0])) {
          filteredList.set(entity.entityID, entity);
        }
      });
      return filteredList as FilterReturnType<T, O>;
    }
    return undefined as FilterReturnType<T, O>;
  }

  /**
   * WARINING! this function can be used ONLY in onStart(), will not delete self otherwise!
   */
  selfDestroy() {
    this.isSelfDestroy = true;
  }
}
//TODO: group search - filtruj komponenty ktore maja inne komponenty przy okazji
export class AbstractSystem extends DogmaSystem {
  constructor() {
    super();
  }
}
