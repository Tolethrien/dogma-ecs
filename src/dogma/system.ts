import EngineDebugger from "../utils/debbuger";
import DogmaComponent from "./component";
import Dogma, { DOGMA_COMPONENTS_LIST } from "./dogma";
//TODO: Przydałoby sie by lista nie zezwalala na inny string nazwy bo obecnie moze byc Camera a moge w funkcji użyć Transform i nie ma bledu
//TODO: uzyc stringu a nie faktycznej klasy jako T dzieki czemu nie trzeba bedzie ich importowac w systemach?
export type GetComponentsList<T> = Map<string, T>;
export type GetComponent<T> = T | undefined;
type OmitedComponent = keyof Omit<
  typeof DOGMA_COMPONENTS_LIST,
  "AbstractComponent"
>;
export default abstract class DogmaSystem {
  private isActive: boolean;
  constructor() {
    this.isActive = true;
  }
  public get getIsActive() {
    return this.isActive;
  }
  public set setIsActive(bool: boolean) {
    this.isActive = bool;
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
  getComponentsList<T = DogmaComponent>(component: OmitedComponent) {
    return Dogma.getActiveWorld.getComponentsFrom(component) as T;
  }
  getComponentsByTag<T = DogmaComponent>(
    component: OmitedComponent,
    tag: string
  ) {
    const list = new Map<string, T>();
    const components = Dogma.getActiveWorld.getComponentsFrom(component);
    components.forEach(
      (component) =>
        component.entityTags.has(tag) &&
        list.set(component.entityID, component as T)
    );
    return list;
  }

  getComponentByMarker<T = DogmaComponent>(
    component: OmitedComponent,
    marker: string
  ) {
    const components = Dogma.getActiveWorld.getComponentsFrom(component);
    for (const component of components.values()) {
      if (component.entityMarker === marker) {
        return component as T;
      }
    }
    EngineDebugger.showWarn(
      `Dogma Warn:\nTrying to get component "${component}" by marker: "${marker}" in system "${this.constructor.name}" but there is no such component\nFunction will return undefined, make sure this is intentional`
    );
  }
  // getComponentsByFilter(){}
  // getComponentsByTagsGroup(){}
}
export class AbstractSystem extends DogmaSystem {
  constructor() {
    super();
  }
}
