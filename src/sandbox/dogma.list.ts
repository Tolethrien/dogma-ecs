import Camera from "./components/camera";
import Transform from "./components/transform";
import Renderer from "./systems/renderer";
//TODO: no jakos to ladniej zrobic, chocby funkcje a nie taki chamski export
export const avalibleComponents = {
  Transform,
  Camera,
};
export const avalibleSystems = {
  Renderer,
};
// export const DogmaConfig = {
//   components: [Transform, Camera],
//   systems: [Renderer],
// };
