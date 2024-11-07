import Camera from "./components/camera";
import Render from "./components/render";
import Transform from "./components/transform";
import Renderer from "./systems/renderer";
//TODO: no jakos to ladniej zrobic, chocby funkcje a nie taki chamski export
export const avalibleComponents = {
  Transform,
  Camera,
  Render,
};
export const avalibleSystems = {
  Renderer,
};
// export const DogmaConfig = {
//   components: [Transform, Camera],
//   systems: [Renderer],
// };
