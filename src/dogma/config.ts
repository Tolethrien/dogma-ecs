import DogmaSystem from "./system";
import DogmaComponent, { DogmaComponentProps } from "./component";

type ConfigReturn<T, O> = {
  DOGMA_COMPONENTS_LIST: T & { AbstractComponent: typeof AbstractComponent };
  DOGMA_SYSTEM_LIST: O & { AbstractSystem: typeof AbstractSystem };
};
interface Config<T, O> {
  components: T;
  systems: O;
}
export default function config<
  T extends Record<string, unknown>,
  O extends Record<string, unknown>
>({ components, systems }: Config<T, O>): ConfigReturn<T, O> {
  return {
    DOGMA_COMPONENTS_LIST: {
      AbstractComponent,
      ...components,
    },
    DOGMA_SYSTEM_LIST: {
      AbstractSystem,
      ...systems,
    },
  };
}

class AbstractSystem extends DogmaSystem {
  constructor() {
    super();
  }
}
class AbstractComponent extends DogmaComponent {
  constructor({ entityID, entityTags, entityMarker }: DogmaComponentProps) {
    super({ entityID, entityTags, entityMarker });
  }
}
