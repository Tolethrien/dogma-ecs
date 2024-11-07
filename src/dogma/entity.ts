import DogmaComponent from "./component";
import { DOGMA_COMPONENTS_LIST } from "./dogma";
export default abstract class DogmaEntity {
  private id: string;
  private tags: Set<string>;
  private marker: string[];
  private components: Map<keyof typeof DOGMA_COMPONENTS_LIST, DogmaComponent>;
  constructor() {
    this.id = crypto.randomUUID();
    this.tags = new Set();
    this.marker = [];
    this.components = new Map();
  }
  public get getID() {
    return this.id;
  }
  public get getTags() {
    return this.tags;
  }
  public get getComponents() {
    return this.components;
  }
  public get getMarker() {
    return this.marker[0];
  }
  addComponent<
    T extends keyof Omit<typeof DOGMA_COMPONENTS_LIST, "AbstractComponent">
  >(
    componentName: T,
    props?: ConstructorParameters<(typeof DOGMA_COMPONENTS_LIST)[T]>[1]
  ) {
    const component = new DOGMA_COMPONENTS_LIST[componentName](
      {
        entityID: this.id,
        entityTags: this.tags,
        entityMarker: this.marker,
      },
      //@ts-ignore
      props
    );
    this.components.set(componentName, component);
  }
  public addTag(tag: string) {
    this.tags.add(tag);
  }
  public setMarker(marker: string) {
    this.marker[0] = marker;
  }
}
