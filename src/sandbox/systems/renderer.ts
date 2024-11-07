import DogmaSystem from "../../dogma/system";
export default class Renderer extends DogmaSystem {
  constructor() {
    super();
  }
  onStart(): void {
    console.log("startuje");
  }
  onUpdate() {
    console.log("zapetlam");
    const a = this.getComponentsList("Transform");
    const b = this.getComponentWithMarker("Camera", "player");
    const c = this.getComponentsListWith("Transform", {
      // matchAnyTag: ["seo", "player"],
      // components: ["Camera", "Render"],
      // matchAllTags: ["seo", "player"],
    });
    console.log("finalna lista: ", c);
  }
  onDestroy(): void {
    console.log("wybucham");
  }
}
