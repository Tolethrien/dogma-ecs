import DogmaComponent from "./component";
import DOGMA_CONFIG from "../sandbox/dogma-config";
import { DogmaComponentsKeys } from "./types";
import DogmaEntity from "./entity";

interface Props {
  id: string;
  tags: Set<string>;
  marker: string[];
  components: Set<DogmaComponent>;
}
export default class EntityClone extends DogmaEntity {
  protected components: Map<DogmaComponentsKeys, DogmaComponent>;
  constructor({ tags, components, id, marker }: Props) {
    super();
    this.components = new Map();
    components.forEach((component) =>
      this.components.set(
        component.constructor.name as DogmaComponentsKeys,
        component
      )
    );
  }
}
