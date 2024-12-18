import DogmaEntity from "../../dogma/entity";

export default class Player extends DogmaEntity {
  constructor() {
    super();
    this.addComponent("Camera");
    this.addComponent("Render");
    this.addComponent("Transform", { position: { x: 1, y: 1 } });
    this.addTag("seo");
    this.setMarker("player");
  }
}
