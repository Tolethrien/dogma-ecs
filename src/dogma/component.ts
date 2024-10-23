interface Props {
  entityID: string;
  entityTags: Set<string>;
  entityMarker: string;
}
export type DogmaComponentProps = Props;
export default abstract class DogmaComponent {
  entityID: string;
  entityTags: Set<string>;
  entityMarker: string;
  constructor({ entityID, entityTags, entityMarker }: Props) {
    this.entityID = entityID;
    this.entityTags = entityTags;
    this.entityMarker = entityMarker;
  }
}
export class AbstractComponent extends DogmaComponent {
  constructor({ entityID, entityTags, entityMarker }: Props) {
    super({ entityID, entityTags, entityMarker });
  }
}
