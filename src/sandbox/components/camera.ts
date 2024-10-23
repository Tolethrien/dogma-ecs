import DogmaComponent, { DogmaComponentProps } from "../../dogma/component";

export interface Props {
  position: {
    x: number;
    y: number;
  };
  size: {
    x: number;
    y: number;
  };
  rotation?: number;
}
interface Vec2DType {
  vecX: number;
  vecY: number;
}
export default class Camera extends DogmaComponent {
  cameraPos: Vec2DType;
  constructor(componentProps: DogmaComponentProps) {
    super(componentProps);
    this.cameraPos = { vecX: 1, vecY: 1 };
  }
}
