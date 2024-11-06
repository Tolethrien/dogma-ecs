import DogmaSystem from "../../dogma/system";
export default class Renderer extends DogmaSystem {
  constructor() {
    super();
  }
  onStart(): void {
    console.log("startuje");
  }
  onUpdate() {
    const a = this.getComponentsList("Transform");
    const b = this.getComponentsListWith("Transform", { marker: "" });
    console.log("zapetlam");
    console.log(b);
  }
  onDestroy(): void {
    console.log("wybucham");
  }
}
