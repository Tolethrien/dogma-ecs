import config from "../dogma/config";
import Camera from "./components/camera";
import Render from "./components/render";
import Transform from "./components/transform";
import Renderer from "./systems/renderer";

export default config({
  components: {
    Camera,
    Render,
    Transform,
  },
  systems: { Renderer },
});
