import DogmaSystem from "./system";
import DogmaComponent, { DogmaComponentProps } from "./component";

interface Config<T, O> {
  components: T;
  systems: O;
}
export default function config<
  T extends Record<string, unknown>,
  O extends Record<string, unknown>
>({ components, systems }: Config<T, O>) {
  const componentList = {
    AbstractComponent,
    ...components,
  } as T & { AbstractComponent: typeof AbstractComponent };
  const systemList = {
    AbstractSystem,
    ...systems,
  } as O & { AbstractSystem: typeof AbstractSystem };
  return {
    DOGMA_COMPONENTS_LIST: componentList,
    DOGMA_SYSTEM_LIST: systemList,
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
