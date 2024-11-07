import DogmaEntity from "../../dogma/entity";

export default class PlayerTwo extends DogmaEntity {
  constructor() {
    super();
    //TODO: poprawic by tag i marker nie musialby byc pierwsze przed komponentami bo sie nie przekaza
    this.addComponent("Camera");
    this.addComponent("Render");
    this.addComponent("Transform", { position: { x: 1, y: 1 } });
    this.setMarker("player");
    this.addTag("seo");
    this.addTag("player");
  }
}
