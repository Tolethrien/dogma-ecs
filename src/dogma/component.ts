import DogmaEntity from "./entity";

interface Props {
  entityID: DogmaEntity["id"];
  entityTags: Set<string>;
  entityMarker: string[];
}
export type DogmaComponentProps = Props;
export default abstract class DogmaComponent {
  entityID: DogmaEntity["id"];
  entityTags: Set<string>;
  entityMarker: string[];
  constructor({ entityID, entityTags, entityMarker }: Props) {
    this.entityID = entityID;
    this.entityTags = entityTags;
    this.entityMarker = entityMarker;
  }
}
