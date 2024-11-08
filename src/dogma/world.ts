import EngineDebugger from "../utils/debbuger";
import DogmaComponent from "./component";
import DogmaEntity from "./entity";
import DogmaSystem from "./system";
import { DogmaSystemsKeys } from "./types";
import DOGMA_CONFIG from "../sandbox/dogma-config";

interface Props {
  worldName: string;
}

export default class DogmaWorld {
  private components: Map<string, Map<string, DogmaComponent>>;
  private systems: Map<DogmaSystemsKeys, DogmaSystem>;
  private worldName: string;
  private entitiesInWorld: Set<DogmaEntity["id"]>;
  //OPTIMA: sprawdz czy lista map na styl componentow bedzie szybsza bo nie musi ciagle zmieniac
  //referencji do listy a jest posortowana komponentami

  private componentsToDispatch: Set<DogmaComponent>;
  private componentsToRemove: Set<DogmaEntity["id"]>;
  private systemsToDispatch: Set<DogmaSystemsKeys>;
  private systemsToRemove: Set<DogmaSystemsKeys>;
  constructor({ worldName }: Props) {
    this.worldName = worldName;
    this.componentsToDispatch = new Set();
    this.componentsToRemove = new Set();
    this.systemsToDispatch = new Set();
    this.systemsToRemove = new Set();
    this.entitiesInWorld = new Set();
    this.components = new Map();
    this.systems = new Map<DogmaSystemsKeys, DogmaSystem>();
    Object.keys(DOGMA_CONFIG.DOGMA_COMPONENTS_LIST).forEach((component) => {
      if (component !== "AbstractComponent")
        this.components.set(component, new Map());
    });
  }
  public get getAllComponentsList() {
    return this.components;
  }
  public get getName() {
    return this.worldName;
  }
  public get getEntitiesInWorld() {
    return this.entitiesInWorld;
  }
  public get getComponentToDispatch() {
    return this.componentsToDispatch;
  }
  public get getSystemsToDispatch() {
    return this.systemsToDispatch;
  }
  public get getComponentToRemove() {
    return this.componentsToRemove;
  }
  public get getSystemsToRemove() {
    return this.systemsToRemove;
  }
  public get getSystems() {
    return this.systems;
  }

  public getComponentsFrom(componentName: string) {
    const comp = this.components.get(componentName);
    EngineDebugger.AssertValue(
      comp,
      `Dogma Error\n Trying to get access to component list "${componentName}" but there is no list with this name`
    );
    return comp;
  }

  public addSystem<T extends DogmaSystemsKeys>(systemName: T) {
    this.systemsToDispatch.add(systemName);
  }
  public removeSystem<
    T extends keyof Omit<
      typeof DOGMA_CONFIG.DOGMA_SYSTEM_LIST,
      "AbstractSystem"
    >
  >(systemName: T) {
    this.systemsToRemove.add(systemName);
  }
  public pauseSystem<
    T extends keyof Omit<
      typeof DOGMA_CONFIG.DOGMA_SYSTEM_LIST,
      "AbstractSystem"
    >
  >(systemName: T) {
    if (!this.getSystems.has(systemName))
      EngineDebugger.showError(`
      Dogma Error\n Trying to pause System "${systemName}" but there is no system ith this name in the world: "${this.worldName}"
      `);
    this.getSystems.get(systemName)!.setIsActive = false;
  }
  public playSystem<
    T extends keyof Omit<
      typeof DOGMA_CONFIG.DOGMA_SYSTEM_LIST,
      "AbstractSystem"
    >
  >(systemName: T) {
    if (!this.getSystems.has(systemName))
      EngineDebugger.showError(`
      Dogma Error\n Trying to unpouse System "${systemName}" but there is no system ith this name in the world: "${this.worldName}"
      `);
    this.getSystems.get(systemName)!.setIsActive = true;
  }
}
