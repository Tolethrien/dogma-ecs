import DogmaEntity from "../../dogma/entity";

export default class Player extends DogmaEntity {
  constructor() {
    super();
    this.setMarker("player");
    this.addTag("seo");
    //TODO: poprawic by tag i marker nie musialby byc pierwsze przed komponentami bo sie nie przekaza
    this.addComponent("Camera");
    this.addComponent("Transform", { position: { x: 1, y: 1 } });
    this.addTag("player");
  }
}
