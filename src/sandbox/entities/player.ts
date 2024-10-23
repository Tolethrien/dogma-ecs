import DogmaEntity from "../../dogma/entity";

export default class Player extends DogmaEntity {
  constructor() {
    super();
    this.addComponent("Camera");
    this.addComponent("Transform", { position: { x: 1, y: 1 } });
  }
}
