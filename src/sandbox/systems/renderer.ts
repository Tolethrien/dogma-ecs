import DogmaSystem, {
  GetComponentsList,
  GetComponent,
} from "../../dogma/system";
import Camera from "../components/camera";
import Transform from "../components/transform";
export default class Renderer extends DogmaSystem {
  list: GetComponentsList<Camera>;
  filtered: GetComponentsList<Transform>;
  marked: GetComponent<Transform>;

  constructor() {
    super();
    this.list = this.getComponentsList("Transform");
    this.filtered = this.getComponentsByTag("Transform", "player");
    this.marked = this.getComponentByMarker("Transform", "player");
  }
  onUpdate() {
    console.log("s");
  }
}
