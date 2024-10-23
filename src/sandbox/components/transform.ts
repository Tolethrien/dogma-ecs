import DogmaComponent, { DogmaComponentProps } from "../../dogma/component";

export interface Props {
  position: {
    x: number;
    y: number;
  };
}
interface Vec2DType {
  vecX: number;
  vecY: number;
}
export default class Transform extends DogmaComponent {
  position: Vec2DType;
  constructor(
    componentProps: DogmaComponentProps,
    { position = { x: 10, y: 10 } }: Props
  ) {
    super(componentProps);
    this.position = { vecX: position.x, vecY: position.y };
  }
}
